"""Agents module for OrchestratorFlow."""

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def get_llm(temperature: float = 0.2, **kwargs: Any) -> Any:
    model = os.getenv("LLM_MODEL", "gemini-2.5-flash").strip()
    provider = os.getenv("LLM_PROVIDER", "").strip().lower()

    if provider == "openai" or model.startswith(("gpt-", "o1", "o3", "o4")):
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(model=model, temperature=temperature, **kwargs)

    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(model=model, temperature=temperature, **kwargs)
