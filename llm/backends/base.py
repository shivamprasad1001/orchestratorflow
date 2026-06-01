import abc

class BaseLLMBackend(abc.ABC):
    @abc.abstractmethod
    def generate(self, prompt: str, system_prompt: str = "") -> str:
        """Generates a response from the LLM."""
        pass

    @property
    @abc.abstractmethod
    def model_name(self) -> str:
        """Returns the name of the model being used."""
        pass
