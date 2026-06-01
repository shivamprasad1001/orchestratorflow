from .backends.groq_backend import GroqBackend
from .backends.gemini_backend import GeminiBackend
from .backends.ollama_backend import OllamaBackend
from .backends.base import BaseLLMBackend

def get_llm_backend(config) -> BaseLLMBackend:
    """
    Returns the appropriate LLM backend based on configuration.
    """
    provider = config.llm_provider.lower()
    
    if provider == "groq":
        return GroqBackend(api_key=config.groq_api_key, model=config.groq_model, temperature=config.temperature, max_tokens=config.max_tokens)
    elif provider == "gemini":
        return GeminiBackend(api_key=config.gemini_api_key, model=config.gemini_model, temperature=config.temperature, max_tokens=config.max_tokens)
    elif provider == "ollama":
        return OllamaBackend(host=config.ollama_host, model=config.ollama_model)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")
