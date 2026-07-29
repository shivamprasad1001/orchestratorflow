"""
Reviewer Agent implementation for OrchestratorFlow.
"""

from pathlib import Path
from typing import Any, Dict, Literal

from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field

from orchestratorflow.agents import get_llm
from orchestratorflow.state import OrchestratorState
from orchestratorflow.workspace_manager import WorkspaceManager

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "reviewer.md"
with open(PROMPT_PATH, "r", encoding="utf-8") as f:
    REVIEWER_PROMPT = f.read()


class ReviewerOutput(BaseModel):
    review_status: Literal["pass", "fix"] = Field(
        description="Set to pass if project is logically sound, or fix if issues exist."
    )
    review_feedback: str = Field(description="Specific feedback with file names when fixes are required.")


def reviewer_node(
    state: OrchestratorState,
    workspace_manager: WorkspaceManager | None = None,
) -> Dict[str, Any]:
    manager = workspace_manager or WorkspaceManager()
    project_path = state.get("project_path")
    if not project_path:
        return {
            "review_status": "fix",
            "review_feedback": "No project workspace exists yet.",
        }

    llm = get_llm(temperature=0.1)
    structured_llm = llm.with_structured_output(ReviewerOutput)
    files = manager.load_files(project_path)

    response: ReviewerOutput = structured_llm.invoke(
        [
            SystemMessage(content=REVIEWER_PROMPT),
            HumanMessage(
                content=(
                    "Review this disk-backed project. Reference specific files and minimal fixes.\n\n"
                    f"Task: {state['user_input']}\n"
                    f"Design Specifications:\n{state.get('design') or ''}\n"
                    f"Project Path: {project_path}\n"
                    f"Project Files:\n{_format_project_files(files)}"
                )
            ),
        ]
    )

    return {
        "review_status": response.review_status,
        "review_feedback": response.review_feedback,
        "workflow_status": "failed"
        if response.review_status == "fix" and state.get("iteration", 0) >= 5
        else state.get("workflow_status", "running"),
    }


def _format_project_files(files: Dict[str, str], max_chars_per_file: int = 10000) -> str:
    chunks = []
    for path, content in files.items():
        clipped = content[:max_chars_per_file]
        suffix = "\n...<truncated>..." if len(content) > max_chars_per_file else ""
        chunks.append(f"--- {path} ---\n{clipped}{suffix}")
    return "\n\n".join(chunks)
