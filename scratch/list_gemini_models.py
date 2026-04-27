import os
import httpx
from dotenv import load_dotenv

def list_models():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found")
        return

    # Try listing models
    url = "https://generativelanguage.googleapis.com/v1/models"
    headers = {"x-goog-api-key": api_key}
    
    try:
        response = httpx.get(url, headers=headers)
        if response.status_code == 200:
            models = response.json().get("models", [])
            print("Available Models (v1):")
            for m in models:
                print(f" - {m['name']} (supported methods: {m.get('supportedGenerationMethods')})")
        else:
            print(f"v1 ListModels failed: {response.status_code} {response.text}")
            
        # Also try v1beta
        url_beta = "https://generativelanguage.googleapis.com/v1beta/models"
        response_beta = httpx.get(url_beta, headers=headers)
        if response_beta.status_code == 200:
            models_beta = response_beta.json().get("models", [])
            print("\nAvailable Models (v1beta):")
            for m in models_beta:
                print(f" - {m['name']} (supported methods: {m.get('supportedGenerationMethods')})")
        else:
            print(f"v1beta ListModels failed: {response_beta.status_code} {response_beta.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_models()
