"""State definitions for the OrchestratorFlow framework."""

from typing import List, Literal, Optional, TypedDict


class OrchestratorState(TypedDict):
    user_input: str
    target_language: Optional[str]
    route_mode: Optional[Literal["simple", "standard"]]
    next_agent: Optional[Literal["planner", "designer", "coder", "reviewer", "tester", "human", "end"]]
    supervisor_reasoning: Optional[str]
    completed_agents: List[str]
    last_agent: Optional[str]
    plan: Optional[str]
    design: Optional[str]

    project_path: Optional[str]
    project_files: List[str]
    modified_files: List[str]
    iteration: int

    review_status: Optional[Literal["pass", "fix"]]
    review_feedback: Optional[str]
    test_status: Optional[Literal["pass", "fail"]]
    test_feedback: Optional[str]
    workflow_status: Optional[Literal["running", "passed", "failed"]]

    ambiguity_detected: bool
    human_feedback: Optional[str]
    needs_human_input: bool
    clarification_question: Optional[str]
    clarification_options: List[str]
