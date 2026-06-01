import abc
from models.state import SystemState
from llm.backends.base import BaseLLMBackend

class AbstractBaseAgent(abc.ABC):
    def __init__(self, llm: BaseLLMBackend):
        self.llm = llm
        self.mode = "initial"

    @abc.abstractmethod
    def run(self, state: SystemState) -> SystemState:
        """Runs the agent's logic on the current state."""
        pass

    @property
    @abc.abstractmethod
    def name(self) -> str:
        """Returns the name of the agent."""
        pass

    def _estimate_tokens(self, text: str) -> int:
        """Simple token estimation (len // 4)."""
        return len(text) // 4
