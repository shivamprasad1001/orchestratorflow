"""
Human-in-the-Loop Agent implementation for OrchestratorFlow.
"""

from typing import Dict, Any
from orchestratorflow.state import OrchestratorState


def human_node(state: OrchestratorState) -> Dict[str, Any]:
    """
    Human-in-the-Loop Node.
    """
    if state.get("human_feedback"):
        return {
            "needs_human_input": False,
            "ambiguity_detected": False,
        }

    return {
        "needs_human_input": True,
        "clarification_question": _clarification_question(state),
        "clarification_options": [
            "Answer with guidance",
            "Skip and let agents decide",
        ],
    }


def _clarification_question(state: OrchestratorState) -> str:
    if state.get("plan"):
        return (
            "The planner found ambiguity. Add guidance if you care about a specific choice, "
            "or skip and OrchestratorFlow will choose sensible defaults."
        )
    return (
        "The agents need clarification. Add guidance if you have a preference, "
        "or skip and OrchestratorFlow will choose sensible defaults."
    )
