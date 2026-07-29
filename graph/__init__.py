"""
Graph construction and workflow compilation for OrchestratorFlow using LangGraph.
"""

from langgraph.graph import END, START, StateGraph

from orchestratorflow.agents.coder import coder_node
from orchestratorflow.agents.designer import designer_node
from orchestratorflow.agents.human import human_node
from orchestratorflow.agents.planner import planning_node
from orchestratorflow.agents.reviewer import reviewer_node
from orchestratorflow.agents.supervisor import supervisor_node
from orchestratorflow.agents.tester import tester_node
from orchestratorflow.events import EventSink, wrap_agent_node, wrap_router
from orchestratorflow.routers import (
    route_after_supervisor,
)
from orchestratorflow.state import OrchestratorState


def create_orchestrator_graph(event_sink: EventSink | None = None):
    workflow = StateGraph(OrchestratorState)

    workflow.add_node("supervisor", wrap_agent_node("supervisor", supervisor_node, event_sink))
    workflow.add_node("planner", wrap_agent_node("planner", planning_node, event_sink))
    workflow.add_node("designer", wrap_agent_node("designer", designer_node, event_sink))
    workflow.add_node("coder", wrap_agent_node("coder", coder_node, event_sink))
    workflow.add_node("reviewer", wrap_agent_node("reviewer", reviewer_node, event_sink))
    workflow.add_node("tester", wrap_agent_node("tester", tester_node, event_sink))
    workflow.add_node("human", wrap_agent_node("human", human_node, event_sink))

    workflow.add_edge(START, "supervisor")
    workflow.add_conditional_edges(
        "supervisor",
        wrap_router("supervisor", route_after_supervisor, event_sink),
        {
            "planner": "planner",
            "designer": "designer",
            "coder": "coder",
            "reviewer": "reviewer",
            "tester": "tester",
            "human": "human",
            END: END,
        },
    )
    workflow.add_edge("planner", "supervisor")
    workflow.add_edge("designer", "supervisor")
    workflow.add_edge("coder", "supervisor")
    workflow.add_edge("reviewer", "supervisor")
    workflow.add_edge("tester", "supervisor")
    workflow.add_edge("human", "supervisor")

    return workflow.compile()
