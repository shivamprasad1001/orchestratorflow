"""
Task intake agent for dynamic workflow routing.
"""

from typing import Any, Dict, Literal

from orchestratorflow.state import OrchestratorState

RouteMode = Literal["simple", "standard"]


def intake_node(state: OrchestratorState) -> Dict[str, Any]:
    task = state["user_input"]
    route_mode = classify_task(task)
    return {
        "route_mode": route_mode,
        "target_language": _infer_language(task),
        "plan": _simple_plan(task) if route_mode == "simple" else state.get("plan"),
        "design": _simple_design(task) if route_mode == "simple" else state.get("design"),
        "ambiguity_detected": False if route_mode == "simple" else state.get("ambiguity_detected", False),
    }


def classify_task(task: str) -> RouteMode:
    text = task.lower()
    complex_markers = [
        "fastapi",
        "jwt",
        "auth",
        "authentication",
        "database",
        "postgres",
        "sqlite",
        "docker",
        "microservice",
        "distributed",
        "architecture",
        "production",
        "refactor",
        "analyze",
        "multi-agent",
        "api",
        "frontend",
        "react",
        "tests",
        "pytest",
    ]
    simple_markers = [
        "simple",
        "basic",
        "small",
        "toy",
        "script",
        "calculator",
        "todo app",
        "todo",
        "game",
    ]
    if any(marker in text for marker in complex_markers):
        return "standard"
    if any(marker in text for marker in simple_markers) and len(text.split()) <= 12:
        return "simple"
    return "standard"


def _infer_language(task: str) -> str:
    text = task.lower()
    language_markers = {
        "python": "Python",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "java": "Java",
        "rust": "Rust",
        "go": "Go",
        "c++": "C++",
    }
    for marker, language in language_markers.items():
        if marker in text:
            return language
    return "Python"


def _simple_plan(task: str) -> str:
    return (
        "Simple task route selected. Build the requested project directly, "
        "keep the implementation small, include basic validation, and add a "
        "minimal runnable entrypoint or tests when useful.\n\n"
        f"Task: {task}"
    )


def _simple_design(task: str) -> str:
    return (
        "Use a minimal single-project structure. Avoid unnecessary architecture. "
        "Create only the files required to run and test the requested app.\n\n"
        f"Task: {task}"
    )
