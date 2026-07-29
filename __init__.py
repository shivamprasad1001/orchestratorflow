"""
OrchestratorFlow: Adaptive Multi-Agent Orchestration Framework for Automated Code Generation.
"""

from .state import OrchestratorState


def __getattr__(name: str):
    if name == "create_orchestrator_graph":
        from .graph import create_orchestrator_graph

        return create_orchestrator_graph
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

__all__ = [
    "OrchestratorState",
    "create_orchestrator_graph",
]
