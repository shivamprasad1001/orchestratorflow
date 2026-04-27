import os
import sys

# Add project root to sys.path
sys.path.append(os.getcwd())

from orchestrator.core.engine import Orchestrator
from orchestrator.adapters.groq_adapter import GroqAdapter
from orchestrator.adapters.gemini_api_adapter import GeminiAPIAdapter

def verify_adapters():
    print("Verifying adapter registration...")
    
    # Mock environment for availability check
    os.environ["GROQ_API_KEY"] = "mock_key"
    os.environ["GEMINI_API_KEY"] = "mock_key"
    
    try:
        orch = Orchestrator()
        print(f"Available adapters: {orch.get_available_agents()}")
        
        # Check if groq and gemini are in the adapters dict (if they pass is_available)
        if "groq" in orch.adapters:
            print("✓ Groq adapter initialized and available")
        else:
            print("✗ Groq adapter missing or unavailable")
            
        if "gemini" in orch.adapters:
            print("✓ Gemini API adapter initialized and available")
        else:
            print("✗ Gemini API adapter missing or unavailable")
            
    except Exception as e:
        print(f"Error during verification: {e}")

if __name__ == "__main__":
    verify_adapters()
