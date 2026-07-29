"""
Tester Agent implementation for OrchestratorFlow.
"""

import ast
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

from orchestratorflow.state import OrchestratorState

DEFAULT_TIMEOUT_SECONDS = 20


def tester_node(state: OrchestratorState) -> Dict[str, Any]:
    project_path_value = state.get("project_path")
    if not project_path_value:
        return {
            "test_status": "fail",
            "test_feedback": "No project workspace exists to test.",
        }

    project_path = Path(project_path_value)
    if not project_path.exists():
        return {
            "test_status": "fail",
            "test_feedback": f"Project path does not exist: {project_path}",
        }

    result = _run_project_tests(project_path)
    if result["success"]:
        return {
            "test_status": "pass",
            "test_feedback": result["feedback"],
            "workflow_status": "passed",
        }

    return {
        "test_status": "fail",
        "test_feedback": result["feedback"],
        "workflow_status": "failed" if state.get("iteration", 0) >= 5 else "running",
    }


def _run_project_tests(project_path: Path) -> Dict[str, Any]:
    pytest_files = _find_pytest_files(project_path)
    if pytest_files:
        return _run_command([sys.executable, "-m", "pytest", "-q"], project_path, "pytest")

    python_files = _python_files(project_path)
    if not python_files:
        return {"success": True, "feedback": "No Python files found. Nothing to execute."}

    entrypoint = _select_entrypoint(project_path, python_files)
    if entrypoint is None:
        return {"success": True, "feedback": "No runnable entrypoint or pytest tests found."}

    if _is_interactive(entrypoint):
        result = _run_command([sys.executable, str(entrypoint.name)], project_path, "interactive stdin", stdin="\n\n\n")
        if result["timed_out"]:
            return {
                "success": True,
                "feedback": (
                    "Interactive program timed out while waiting for more input. "
                    "This is treated as inconclusive rather than a code failure."
                ),
            }
        return result

    return _run_command([sys.executable, str(entrypoint.name)], project_path, "python entrypoint")


def _run_command(command: List[str], cwd: Path, label: str, stdin: str | None = None) -> Dict[str, Any]:
    try:
        completed = subprocess.run(
            command,
            input=stdin,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=DEFAULT_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired as exc:
        stdout = exc.stdout or ""
        stderr = exc.stderr or ""
        return {
            "success": False,
            "timed_out": True,
            "feedback": (
                f"{label} timed out after {DEFAULT_TIMEOUT_SECONDS}s.\n"
                "Timeout may indicate an interactive program waiting for input.\n"
                f"stdout:\n{stdout}\n\nstderr:\n{stderr}"
            ),
        }

    return {
        "success": completed.returncode == 0,
        "timed_out": False,
        "feedback": (
            f"Command: {' '.join(command)}\n"
            f"Exit Code: {completed.returncode}\n"
            f"stdout:\n{completed.stdout}\n\nstderr:\n{completed.stderr}"
        ),
    }


def _find_pytest_files(project_path: Path) -> List[Path]:
    return sorted(project_path.glob("test_*.py")) + sorted(project_path.glob("tests/test_*.py"))


def _python_files(project_path: Path) -> List[Path]:
    return sorted(
        path
        for path in project_path.rglob("*.py")
        if "__pycache__" not in path.parts and not path.name.startswith("test_")
    )


def _select_entrypoint(project_path: Path, python_files: List[Path]) -> Path | None:
    for candidate in ["main.py", "app.py"]:
        path = project_path / candidate
        if path.exists():
            return path
    return python_files[0] if len(python_files) == 1 else None


def _is_interactive(path: Path) -> bool:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except SyntaxError:
        return False
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "input":
            return True
    return False
