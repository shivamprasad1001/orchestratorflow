from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AgentStep(BaseModel):
    agent: str
    status: str
    output: str
    timestamp: float
    input_tokens: int = 0
    output_tokens: int = 0
    elapsed_ms: float = 0.0

class SystemState(BaseModel):
    task: str
    target_language: str = "python"
    plan: str = ""
    design: str = ""
    code: str = ""
    review: str = ""
    test_results: str = ""
    history: List[AgentStep] = Field(default_factory=list)
    current_step: str = "planning"
    is_complete: bool = False
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    iteration: int = 0

    @property
    def total_input_tokens(self) -> int:
        return sum(getattr(h, "input_tokens", 0) for h in self.history)

    @property
    def total_output_tokens(self) -> int:
        return sum(getattr(h, "output_tokens", 0) for h in self.history)

    def add_step(self, agent: str, status: str, output: str, input_tokens: int = 0, output_tokens: int = 0, elapsed_ms: float = 0.0):
        import time
        self.history.append(AgentStep(
            agent=agent,
            status=status,
            output=output,
            timestamp=time.time(),
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            elapsed_ms=elapsed_ms
        ))
