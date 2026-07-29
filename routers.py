"""
Routing logic for OrchestratorFlow state graph transitions.
"""

from typing import Literal
from langgraph.graph import END
from orchestratorflow.state import OrchestratorState

MAX_ITERATIONS = 5


def route_after_supervisor(state: OrchestratorState) -> str:
    """Route to the next agent selected by Supervisor."""
    next_agent = state.get("next_agent") or "end"
    if next_agent == "end":
        return END
    return next_agent


def route_after_intake(state: OrchestratorState) -> Literal["coder", "planner"]:
    """Route simple tasks directly to Coder; complex tasks through planning/design."""
    if state.get("route_mode") == "simple":
        return "coder"
    return "planner"


def route_after_planner(state: OrchestratorState) -> Literal["human", "designer"]:
    """Routes to Human-in-the-Loop if ambiguity detected, otherwise to Designer."""
    if state.get("ambiguity_detected"):
        return "human"
    return "designer"


def route_after_designer(state: OrchestratorState) -> Literal["human", "coder"]:
    """Routes to Human-in-the-Loop if design conflict detected, otherwise to Coder."""
    if state.get("ambiguity_detected"):
        return "human"
    return "coder"


def route_after_reviewer(state: OrchestratorState) -> str:
    """
    Routes back to Coder with reviewer feedback if fix required,
    otherwise proceeds to Tester.
    """
    if _max_iterations_reached(state):
        return END
    if state.get("review_status") == "fix":
        return "coder"
    return "tester"


def route_after_tester(state: OrchestratorState) -> str:
    """
    Routes back to Coder with test failure report if runtime test fails,
    otherwise completes the workflow (END).
    """
    if state.get("workflow_status") == "failed":
        return END
    if _max_iterations_reached(state):
        return END
    if state.get("test_status") == "fail":
        return "coder"
    return END


def route_after_human(state: OrchestratorState) -> str:
    """Stops for CLI clarification unless human feedback is already present."""
    if state.get("needs_human_input"):
        return END
    return "planner"


def _max_iterations_reached(state: OrchestratorState) -> bool:
    return state.get("iteration", 0) >= MAX_ITERATIONS and (
        state.get("review_status") == "fix" or state.get("test_status") == "fail"
    )
