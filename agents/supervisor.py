"""
Supervisor Agent for dynamic LangGraph routing.

The supervisor owns workflow control. Worker agents do their focused jobs and
return here; this node decides which agent should run next.
"""

from typing import Any, Dict, Literal

from orchestratorflow.agents.intake import classify_task
from orchestratorflow.routers import MAX_ITERATIONS
from orchestratorflow.state import OrchestratorState

NextAgent = Literal["planner", "designer", "coder", "reviewer", "tester", "human", "end"]


def supervisor_node(state: OrchestratorState) -> Dict[str, Any]:
    route_mode = state.get("route_mode") or classify_task(state["user_input"])
    updates: Dict[str, Any] = {
        "route_mode": route_mode,
        "next_agent": "end",
        "supervisor_reasoning": "",
    }

    if state.get("target_language") is None:
        updates["target_language"] = _infer_language(state["user_input"])

    if state.get("workflow_status") in {"passed", "failed"}:
        updates.update(_decision("end", f"Workflow already {state.get('workflow_status')}."))
        return updates

    if state.get("needs_human_input"):
        updates.update(_decision("end", "Paused for human guidance."))
        return updates

    if _iteration_limit_hit(state):
        updates.update(
            {
                "workflow_status": "failed",
                **_decision("end", f"Reached max iterations ({MAX_ITERATIONS})."),
            }
        )
        return updates

    if state.get("ambiguity_detected") and not state.get("human_feedback"):
        updates.update(_decision("human", "Ambiguity detected; ask human or allow skip."))
        return updates

    next_agent, reason = _choose_next_agent(state, route_mode)
    if next_agent == "coder" and route_mode == "simple":
        updates.setdefault("plan", _simple_plan(state["user_input"]))
        updates.setdefault("design", _simple_design(state["user_input"]))

    updates.update(_decision(next_agent, reason))
    return updates


def _choose_next_agent(state: OrchestratorState, route_mode: str) -> tuple[NextAgent, str]:
    if not state.get("project_path"):
        if route_mode == "simple":
            return "coder", "Simple task: skip planning/design and generate directly."
        if not state.get("plan"):
            return "planner", "Standard task needs a plan."
        if not state.get("design"):
            return "designer", "Standard task needs architecture/design."
        return "coder", "Plan and design are ready; generate project."

    if state.get("review_status") == "fix":
        return "coder", "Reviewer requested targeted fixes."

    if state.get("test_status") == "fail":
        return "coder", "Tester failed; patch only affected files."

    if route_mode == "standard" and state.get("review_status") is None:
        return "reviewer", "Standard task should be reviewed before testing."

    if state.get("test_status") is None:
        return "tester", "Run project tests."

    if state.get("test_status") == "pass":
        return "end", "Tests passed."

    return "end", "No further action required."


def _decision(next_agent: NextAgent, reason: str) -> Dict[str, Any]:
    return {
        "next_agent": next_agent,
        "supervisor_reasoning": reason,
    }


def _iteration_limit_hit(state: OrchestratorState) -> bool:
    return state.get("iteration", 0) >= MAX_ITERATIONS and (
        state.get("review_status") == "fix" or state.get("test_status") == "fail"
    )


def _infer_language(task: str) -> str:
    text = task.lower()
    markers = {
        "python": "Python",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "java": "Java",
        "rust": "Rust",
        "go": "Go",
        "c++": "C++",
    }
    for marker, language in markers.items():
        if marker in text:
            return language
    return "Python"


def _simple_plan(task: str) -> str:
    return (
        "Simple task route selected. Build directly with a small, runnable "
        f"implementation.\n\nTask: {task}"
    )


def _simple_design(task: str) -> str:
    return (
        "Use a minimal project structure. Create only the files required to run "
        f"and test the request.\n\nTask: {task}"
    )
