import sys
from pathlib import Path

# Add project root directory to sys.path so orchestratorflow package is importable
project_root = str(Path(__file__).parent.parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from orchestratorflow.graph import create_orchestrator_graph

graph = create_orchestrator_graph()
