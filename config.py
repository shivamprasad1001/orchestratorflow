import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Config(BaseSettings):
    # LLM Configuration
    llm_provider: str = "groq"  # groq, gemini, ollama
    
    # Groq
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Gemini
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-1.5-pro"
    
    # Ollama
    ollama_model: str = "codellama"
    ollama_host: str = "http://localhost:11434"
    
    # Generation Settings
    temperature: float = 0.2
    max_tokens: int = 4096
    
    # System Settings
    debug: bool = False
    max_iterations: int = 3
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore",
        frozen=False
    )

# Global config instance
config = Config()