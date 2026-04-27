import os
from dotenv import load_dotenv
from orchestrator.core.engine import Orchestrator
from agentic_team.engine import AgenticTeamEngine

def test_availability(name, engine_class):
    print(f"\n--- Testing {name} ---")
    print(f"Before load_dotenv:")
    print(f"GROQ_API_KEY: {os.getenv('GROQ_API_KEY')}")
    try:
        engine = engine_class()
        print(f"Available agents: {engine.get_available_agents()}")
    except Exception as e:
        print(f"Error initializing: {e}")
    
    print("\nAfter load_dotenv:")
    load_dotenv()
    print(f"GROQ_API_KEY: {os.getenv('GROQ_API_KEY')}")
    try:
        engine = engine_class()
        print(f"Available agents: {engine.get_available_agents()}")
    except Exception as e:
        print(f"Error initializing: {e}")

if __name__ == "__main__":
    test_availability("Orchestrator", Orchestrator)
    test_availability("AgenticTeamEngine", AgenticTeamEngine)
