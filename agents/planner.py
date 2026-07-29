"""
Planning Agent implementation for OrchestratorFlow using Gemini / Configured LLM API.
"""

from pathlib import Path
from typing import Dict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field

from orchestratorflow.agents import get_llm
from orchestratorflow.state import OrchestratorState

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "planner.md"
with open(PROMPT_PATH, "r") as f:
    PLANNER_PROMPT = f.read()


class PlanningOutput(BaseModel):
    target_language: str = Field(
        description="Identified target programming language (e.g. Python, C++, JavaScript, TypeScript, Rust, Go, Java)."
    )
    plan: str = Field(description="Step-by-step technical plan and algorithm decomposition.")
    ambiguity_detected: bool = Field(
        default=False, 
        description="Set to true if user request is ambiguous, incomplete, or requires human clarification."
    )


def planning_node(state: OrchestratorState) -> Dict[str, Any]:
    """
    Planning Agent Node for LangGraph.
    """
    llm = get_llm(temperature=0.2)
    structured_llm = llm.with_structured_output(PlanningOutput)

    user_input = state["user_input"]
    human_feedback = state.get("human_feedback")

    prompt = f"{PLANNER_PROMPT}\n\nUser Request: {user_input}"
    if human_feedback:
        prompt += f"\nHuman Guidance provided: {human_feedback}"

    response: PlanningOutput = structured_llm.invoke([
        SystemMessage(content=prompt),
        HumanMessage(content="Identify target programming language, generate the plan, and check for ambiguities.")
    ])

    return {
        "target_language": response.target_language,
        "plan": response.plan,
        "ambiguity_detected": response.ambiguity_detected
    }
