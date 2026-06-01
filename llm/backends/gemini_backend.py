import google.generativeai as genai
from .base import BaseLLMBackend

class GeminiBackend(BaseLLMBackend):
    def __init__(self, api_key: str, model: str, temperature: float, max_tokens: int):
        genai.configure(api_key=api_key)
        self.model_name_str = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.model = genai.GenerativeModel(model)

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        response = self.model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=self.temperature,
                max_output_tokens=self.max_tokens,
            )
        )
        return response.text

    @property
    def model_name(self) -> str:
        return f"gemini/{self.model_name_str}"
