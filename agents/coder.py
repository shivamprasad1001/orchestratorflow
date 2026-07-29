"""
Coder Agent implementation for OrchestratorFlow.

The coder generates a project once, then patches only affected files on
subsequent iterations.
"""

from pathlib import Path
from typing import Any, Dict, List

from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field

from orchestratorflow.agents import get_llm
from orchestratorflow.state import OrchestratorState
from orchestratorflow.workspace_manager import WorkspaceFile, WorkspaceManager

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "coder.md"
with open(PROMPT_PATH, "r", encoding="utf-8") as f:
    CODER_PROMPT = f.read()


class ProjectFileOutput(BaseModel):
    path: str = Field(description="Relative path inside the project workspace.")
    content: str = Field(description="Complete file contents.")


class GenerateProjectOutput(BaseModel):
    files: List[ProjectFileOutput] = Field(description="All files for the initial project.")
    summary_of_changes: str = Field(description="Short summary of the generated project.")


class PatchProjectOutput(BaseModel):
    modified_files: List[str] = Field(description="Relative paths changed by this patch.")
    updated_file_contents: List[ProjectFileOutput] = Field(description="Complete contents for modified files only.")
    summary_of_changes: str = Field(description="What changed and why.")


def coder_node(
    state: OrchestratorState,
    workspace_manager: WorkspaceManager | None = None,
) -> Dict[str, Any]:
    manager = workspace_manager or WorkspaceManager()
    if state.get("iteration", 0) == 0 or not state.get("project_path"):
        return _generate_project(state, manager)
    return _patch_project(state, manager)


def _generate_project(state: OrchestratorState, manager: WorkspaceManager) -> Dict[str, Any]:
    llm = get_llm(temperature=0.1)
    structured_llm = llm.with_structured_output(GenerateProjectOutput)
    project_path = manager.create_project()

    response: GenerateProjectOutput = structured_llm.invoke(
        [
            SystemMessage(content=CODER_PROMPT),
            HumanMessage(
                content=(
                    "Mode: GenerateProject\n\n"
                    "Generate the initial project exactly once.\n\n"
                    f"Task: {state['user_input']}\n"
                    f"Target Language: {state.get('target_language') or 'Python'}\n"
                    f"Plan:\n{state.get('plan') or ''}\n"
                    f"Design:\n{state.get('design') or ''}\n\n"
                    "Return all project files with relative paths and complete contents."
                )
            ),
        ]
    )

    metadata = manager.save_files(
        project_path,
        [_to_workspace_file(file) for file in response.files],
        iteration=1,
    )
    return _workspace_update(str(project_path), metadata.project_files, metadata.modified_files, metadata.iteration)


def _patch_project(state: OrchestratorState, manager: WorkspaceManager) -> Dict[str, Any]:
    llm = get_llm(temperature=0.1)
    structured_llm = llm.with_structured_output(PatchProjectOutput)

    project_path = state.get("project_path")
    if not project_path:
        raise ValueError("PatchProject requires an existing project_path.")

    existing_files = manager.load_files(project_path)
    response: PatchProjectOutput = structured_llm.invoke(
        [
            SystemMessage(content=CODER_PROMPT),
            HumanMessage(
                content=(
                    "Mode: PatchProject\n\n"
                    "You are maintaining an existing software project.\n"
                    "Modify only the necessary files. Do NOT regenerate the project. "
                    "Do NOT rewrite unrelated files.\n\n"
                    f"Task: {state['user_input']}\n"
                    f"Project Path: {project_path}\n"
                    f"Iteration: {state.get('iteration', 0) + 1}\n"
                    f"Project Files: {state.get('project_files', [])}\n\n"
                    f"Review Feedback:\n{state.get('review_feedback') or ''}\n\n"
                    f"Tester Feedback:\n{state.get('test_feedback') or ''}\n\n"
                    f"Existing Project Files:\n{_format_existing_files(existing_files)}\n\n"
                    "Return modified_files, updated_file_contents, and summary_of_changes. "
                    "updated_file_contents must include complete contents for modified files only."
                )
            ),
        ]
    )

    changed_files = [_to_workspace_file(file) for file in response.updated_file_contents]
    changed_paths = {file.path for file in changed_files}
    missing_contents = set(response.modified_files) - changed_paths
    if missing_contents:
        raise ValueError(f"modified_files missing updated contents: {sorted(missing_contents)}")

    metadata = manager.save_files(
        project_path,
        changed_files,
        iteration=state.get("iteration", 0) + 1,
    )
    return _workspace_update(project_path, metadata.project_files, metadata.modified_files, metadata.iteration)


def _workspace_update(project_path: str, project_files: List[str], modified_files: List[str], iteration: int) -> Dict[str, Any]:
    return {
        "project_path": project_path,
        "project_files": project_files,
        "modified_files": modified_files,
        "iteration": iteration,
        "workflow_status": "running",
        "review_status": None,
        "test_status": None,
        "review_feedback": None,
        "test_feedback": None,
    }


def _to_workspace_file(file: ProjectFileOutput) -> WorkspaceFile:
    return WorkspaceFile(path=file.path, content=file.content)


def _format_existing_files(files: Dict[str, str], max_chars_per_file: int = 12000) -> str:
    chunks: List[str] = []
    for path, content in files.items():
        clipped = content[:max_chars_per_file]
        suffix = "\n...<truncated>..." if len(content) > max_chars_per_file else ""
        chunks.append(f"--- {path} ---\n{clipped}{suffix}")
    return "\n\n".join(chunks)
