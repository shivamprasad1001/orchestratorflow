"""
Adapter for Groq Cloud API (OpenAI-compatible).
"""

import asyncio
from typing import Any, Dict, List, Optional

import os
import httpx

from orchestrator.resilience.retry import retry_agent_execution
from .base import AgentCapability, AgentResponse, BaseAdapter


class GroqAdapter(BaseAdapter):
    """Adapter for interacting with Groq Cloud API."""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"
        self.api_key = config.get("api_key") or os.getenv("GROQ_API_KEY", "")
        self.model = config.get("model", "llama-3.3-70b-versatile")
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("max_tokens", 4096)

    def get_capabilities(self) -> List[AgentCapability]:
        """Groq is extremely fast for implementation and refactoring."""
        return [
            AgentCapability.IMPLEMENTATION,
            AgentCapability.REFACTORING,
            AgentCapability.DEBUGGING,
            AgentCapability.TESTING,
        ]

    @retry_agent_execution()
    def execute_task(self, task: str, context: Dict[str, Any]) -> AgentResponse:
        """Execute task synchronously using httpx."""
        try:
            return asyncio.run(self.execute_task_async(task, context))
        except RuntimeError:
            return self._execute_sync(task, context)

    def _execute_sync(self, task: str, context: Dict[str, Any]) -> AgentResponse:
        payload = self._build_payload(task, context)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(self.endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                self.logger.error("Groq error: %s %s", response.status_code, response.text)
            response.raise_for_status()
            data = response.json()
            
            content = data["choices"][0]["message"]["content"]
            return AgentResponse(
                success=True,
                output=content,
                metadata={"model": self.model, "usage": data.get("usage", {})}
            )

    async def execute_task_async(self, task: str, context: Dict[str, Any]) -> AgentResponse:
        """Execute task asynchronously using httpx."""
        payload = self._build_payload(task, context)
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(self.endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                self.logger.error("Groq error: %s %s", response.status_code, response.text)
            response.raise_for_status()
            data = response.json()
            
            content = data["choices"][0]["message"]["content"]
            return AgentResponse(
                success=True,
                output=content,
                metadata={"model": self.model, "usage": data.get("usage", {})}
            )

    def _build_payload(self, task: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Build the OpenAI-compatible payload for Groq."""
        system_prompt = "You are an expert software engineer specializing in clean, efficient code."
        user_prompt = self.format_task_prompt(task, context)

        return {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

    def is_available(self) -> bool:
        """Check if API key is provided and endpoint is reachable."""
        if not self.enabled:
            return False
        if not self.api_key:
            self.logger.warning("Groq agent disabled: missing GROQ_API_KEY environment variable.")
            return False
        return True
