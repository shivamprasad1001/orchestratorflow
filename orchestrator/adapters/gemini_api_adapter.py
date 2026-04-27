"""
Adapter for Google Gemini API (Direct integration).
"""

import asyncio
from typing import Any, Dict, List, Optional

import os
import httpx

from orchestrator.resilience.retry import retry_agent_execution
from .base import AgentCapability, AgentResponse, BaseAdapter


class GeminiAPIAdapter(BaseAdapter):
    """Adapter for interacting with Google Gemini API directly."""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.api_key = config.get("api_key") or os.getenv("GEMINI_API_KEY", "")
        self.model = config.get("model", "gemini-2.0-flash")
        # Use v1 endpoint as v1beta might be less stable or different for this model
        self.endpoint = f"https://generativelanguage.googleapis.com/v1/models/{self.model}:generateContent"
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("max_tokens", 4096)

    def get_capabilities(self) -> List[AgentCapability]:
        """Gemini is excellent for code review and architecture analysis."""
        return [
            AgentCapability.CODE_REVIEW,
            AgentCapability.ARCHITECTURE,
            AgentCapability.DOCUMENTATION,
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
        headers = {"x-goog-api-key": self.api_key, "Content-Type": "application/json"}

        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(self.endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                self.logger.error("Gemini API error: %s %s", response.status_code, response.text)
            response.raise_for_status()
            data = response.json()
            
            # Parse Gemini response structure
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            return AgentResponse(
                success=True,
                output=content,
                metadata={"model": self.model}
            )

    async def execute_task_async(self, task: str, context: Dict[str, Any]) -> AgentResponse:
        """Execute task asynchronously using httpx."""
        payload = self._build_payload(task, context)
        headers = {"x-goog-api-key": self.api_key, "Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(self.endpoint, json=payload, headers=headers)
            if response.status_code != 200:
                self.logger.error("Gemini API error: %s %s", response.status_code, response.text)
            response.raise_for_status()
            data = response.json()
            
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            return AgentResponse(
                success=True,
                output=content,
                metadata={"model": self.model}
            )

    def _build_payload(self, task: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Build the Google Gemini API payload."""
        prompt = self.format_task_prompt(task, context)
        
        # Simple structure for Gemini
        return {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": self.max_tokens,
            }
        }

    def is_available(self) -> bool:
        """Check if API key is provided."""
        if not self.enabled:
            return False
        if not self.api_key:
            self.logger.warning("Gemini API agent disabled: missing GEMINI_API_KEY environment variable.")
            return False
        return True
