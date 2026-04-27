import os
import sys
from dotenv import load_dotenv

# Add project root to sys.path
sys.path.append(os.getcwd())

from orchestrator.adapters.groq_adapter import GroqAdapter
from orchestrator.adapters.gemini_api_adapter import GeminiAPIAdapter

def test_connections():
    # Load .env
    load_dotenv()
    
    print("Testing Groq Connection...")
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        print("✗ Groq API Key missing in .env")
    else:
        groq = GroqAdapter({"api_key": groq_key, "enabled": True})
        response = groq.execute_task("Say 'Groq connection successful' and nothing else.", {})
        if response.success:
            print(f"✓ Groq Response: {response.output.strip()}")
        else:
            print(f"✗ Groq Failed: {response.error}")

    print("\nTesting Gemini Connection...")
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("✗ Gemini API Key missing in .env")
    else:
        # Use simple config
        gemini = GeminiAPIAdapter({"api_key": gemini_key, "enabled": True})
        response = gemini.execute_task("Say 'Gemini connection successful' and nothing else.", {})
        if response.success:
            print(f"✓ Gemini Response: {response.output.strip()}")
        else:
            print(f"✗ Gemini Failed: {response.error}")

if __name__ == "__main__":
    test_connections()
