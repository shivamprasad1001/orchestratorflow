"""
Disk-backed workspace management for OrchestratorFlow runs.
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List

from pydantic import BaseModel, Field


class WorkspaceFile(BaseModel):
    path: str = Field(description="Relative path inside the project workspace.")
    content: str = Field(description="Complete file contents.")


class WorkspaceMetadata(BaseModel):
    run_id: str
    created_at: str
    updated_at: str
    project_files: List[str] = Field(default_factory=list)
    modified_files: List[str] = Field(default_factory=list)
    iteration: int = 0


class WorkspaceManager:
    def __init__(self, workspace_root: Path | None = None) -> None:
        package_root = Path(__file__).resolve().parent
        self.workspace_root = workspace_root or package_root / "workspace"

    def create_project(self) -> Path:
        self.workspace_root.mkdir(parents=True, exist_ok=True)
        project_path = self.workspace_root / f"run_{self._next_run_number():03d}"
        project_path.mkdir(parents=True, exist_ok=False)
        now = _utc_now()
        metadata = WorkspaceMetadata(
            run_id=project_path.name,
            created_at=now,
            updated_at=now,
        )
        self.save_metadata(project_path, metadata)
        return project_path

    def save_files(self, project_path: str | Path, files: Iterable[WorkspaceFile], iteration: int) -> WorkspaceMetadata:
        root = Path(project_path)
        root.mkdir(parents=True, exist_ok=True)

        modified_files: List[str] = []
        for file in files:
            safe_path = self._safe_file_path(root, file.path)
            safe_path.parent.mkdir(parents=True, exist_ok=True)
            safe_path.write_text(file.content, encoding="utf-8")
            modified_files.append(file.path)

        metadata = self.load_metadata(root)
        metadata.project_files = self.list_files(root)
        metadata.modified_files = modified_files
        metadata.iteration = iteration
        metadata.updated_at = _utc_now()
        self.save_metadata(root, metadata)
        return metadata

    def load_files(self, project_path: str | Path) -> Dict[str, str]:
        root = Path(project_path)
        files: Dict[str, str] = {}
        for path in self.list_files(root):
            files[path] = (root / path).read_text(encoding="utf-8")
        return files

    def delete_file(self, project_path: str | Path, relative_path: str) -> WorkspaceMetadata:
        root = Path(project_path)
        path = self._safe_file_path(root, relative_path)
        if path.exists():
            path.unlink()
        metadata = self.load_metadata(root)
        metadata.project_files = self.list_files(root)
        metadata.modified_files = [relative_path]
        metadata.updated_at = _utc_now()
        self.save_metadata(root, metadata)
        return metadata

    def list_files(self, project_path: str | Path) -> List[str]:
        root = Path(project_path)
        if not root.exists():
            return []
        return sorted(
            str(path.relative_to(root))
            for path in root.rglob("*")
            if path.is_file() and path.name != "metadata.json"
        )

    def load_metadata(self, project_path: str | Path) -> WorkspaceMetadata:
        metadata_path = Path(project_path) / "metadata.json"
        if not metadata_path.exists():
            now = _utc_now()
            return WorkspaceMetadata(
                run_id=Path(project_path).name,
                created_at=now,
                updated_at=now,
            )
        return WorkspaceMetadata.model_validate_json(metadata_path.read_text(encoding="utf-8"))

    def save_metadata(self, project_path: str | Path, metadata: WorkspaceMetadata) -> None:
        metadata_path = Path(project_path) / "metadata.json"
        metadata_path.write_text(
            json.dumps(metadata.model_dump(), indent=2),
            encoding="utf-8",
        )

    def _next_run_number(self) -> int:
        existing = [
            int(path.name.removeprefix("run_"))
            for path in self.workspace_root.glob("run_*")
            if path.is_dir() and path.name.removeprefix("run_").isdigit()
        ]
        return max(existing, default=0) + 1

    def _safe_file_path(self, project_path: Path, relative_path: str) -> Path:
        target = (project_path / relative_path).resolve()
        root = project_path.resolve()
        if root != target and root not in target.parents:
            raise ValueError(f"File path escapes workspace: {relative_path}")
        return target


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()
