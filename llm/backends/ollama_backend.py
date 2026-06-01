import requests
from .base import BaseLLMBackend

class OllamaBackend(BaseLLMBackend):
    def __init__(self, host: str, model: str):
        self.model = model
        self.host = host

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        url = f"{self.host}/api/generate"
        payload = {
            "model": self.model,
            "prompt": f"{system_prompt}\n\n{prompt}",
            "stream": False
        }
        try:
            response = requests.post(url, json=payload, timeout=60)
            if response.status_code != 200:
                raise Exception(f"Ollama server error ({response.status_code}): {response.text}")
            return response.json()["response"]
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to connect to Ollama at {self.host}: {str(e)}")

    @property
    def model_name(self) -> str:
        return f"ollama/{self.model}"
