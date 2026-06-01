import os
from groq import Groq
from .base import BaseLLMBackend

class GroqBackend(BaseLLMBackend):
    def __init__(self, api_key: str, model: str, temperature: float, max_tokens: int):
        self.client = Groq(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return response.choices[0].message.content

    @property
    def model_name(self) -> str:
        return f"groq/{self.model}"
