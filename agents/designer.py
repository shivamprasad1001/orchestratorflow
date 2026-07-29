"""
Design Agent implementation for OrchestratorFlow.
"""

from pathlib import Path
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field

from orchestratorflow.agents import get_llm
from orchestratorflow.state import OrchestratorState

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "designer.md"
with open(PROMPT_PATH, "r") as f:
    DESIGNER_PROMPT = f.read()


class DesignOutput(BaseModel):
    design: str = Field(description="Structured software architecture blueprint, signatures, and data structures.")
    design_conflict: bool = Field(
        default=False, 
        description="Set to true if there is an unresolvable design conflict requiring human intervention."
    )


def designer_node(state: OrchestratorState) -> Dict[str, Any]:
    """
    Design Agent Node for LangGraph.
    """
    llm = get_llm(temperature=0.2)
    structured_llm = llm.with_structured_output(DesignOutput)

    user_input = state["user_input"]
    target_language = state.get("target_language", "Python")
    plan = state.get("plan", "")
    human_feedback = state.get("human_feedback")

    prompt = f"{DESIGNER_PROMPT}\n\nUser Request: {user_input}\nTarget Language: {target_language}\nPlan:\n{plan}"
    if human_feedback:
        prompt += f"\nHuman Guidance: {human_feedback}"

    response: DesignOutput = structured_llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content="Create the detailed software architecture and testing strategy.")
    ])

    return {
        "design": response.design,
        "ambiguity_detected": response.design_conflict
    }
