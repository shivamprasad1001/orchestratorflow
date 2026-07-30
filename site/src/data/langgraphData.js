export const LANGGRAPH_CONCEPTS = [
  {
    id: "stategraph",
    title: "StateGraph",
    tagline: "Typed graph schema with state reducer capabilities.",
    description: "StateGraph defines the underlying state schema and execution graph structure. Every node transition mutates the state dictionary atomically using typed reducers.",
    code: `from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, END

class GraphState(TypedDict):
    current_agent: str
    current_phase: str
    user_request: str
    plan: Optional[dict]
    design_specs: Optional[dict]
    review_status: str
    test_status: str
    review_feedback: List[str]
    iteration: int
    workspace_path: str
    clarification_needed: bool

# Initialize graph with state schema
workflow = StateGraph(GraphState)`
  },
  {
    id: "nodes",
    title: "Nodes",
    tagline: "Isolated python functions processing state.",
    description: "Nodes represent discrete agent functions. Each node accepts the current GraphState, executes LLM logic or tool actions, and returns state updates.",
    code: `def coder_node(state: GraphState) -> dict:
    workspace = state["workspace_path"]
    feedback = state.get("review_feedback", [])
    
    if feedback:
        # Incremental diff patch mode
        modified = patch_workspace_files(workspace, feedback)
    else:
        # Fresh code generation mode
        modified = generate_workspace_files(workspace, state["plan"])
        
    return {
        "current_agent": "Coder",
        "current_phase": "coding_complete",
        "review_status": "pending",
        "iteration": state["iteration"] + 1
    }`
  },
  {
    id: "conditional_routing",
    title: "Conditional Routing",
    tagline: "Dynamic edge resolution at runtime.",
    description: "Conditional edges evaluate the return state of a node dynamically to decide which downstream node to route control to next.",
    code: `def supervisor_router(state: GraphState) -> str:
    if state.get("clarification_needed"):
        return "Human"
    if state["review_status"] == "failed":
        if state["iteration"] >= 5:
            return "Human"  # Exceeded retries, ask user
        return "Coder"      # Feedback loop retry
    if state["test_status"] == "failed":
        return "Coder"
    if state["review_status"] == "passed" and state["test_status"] == "passed":
        return END
    return "Supervisor"

# Add conditional routing from Supervisor node
workflow.add_conditional_edges("supervisor", supervisor_router)`
  },
  {
    id: "supervisor_pattern",
    title: "Supervisor Pattern",
    tagline: "Star topology dynamic orchestration hub.",
    description: "Instead of hardcoding A -> B -> C sequential edges, all worker nodes transition back to the central Supervisor node, making the Supervisor the single source of truth for routing.",
    code: `# Central Supervisor Star Topology Connections
worker_nodes = ["planner", "designer", "coder", "reviewer", "tester", "human"]

for node in worker_nodes:
    workflow.add_edge(node, "supervisor")

workflow.add_conditional_edges("supervisor", supervisor_router)
workflow.set_entry_point("supervisor")`
  },
  {
    id: "checkpointing",
    title: "Checkpointing & Time Travel",
    tagline: "Persistent state snapshots per graph turn.",
    description: "Checkpointers record graph state after every node execution. Enables state rollback, crash recovery, and offline debugging.",
    code: `from langgraph.checkpoint.sqlite import SqliteSaver

# Persist graph state snapshots locally
with SqliteSaver.from_conn_string("orchestrator_state.db") as memory:
    app = workflow.compile(checkpointer=memory)
    
    # Run with specific thread ID
    config = {"configurable": {"thread_id": "run_042"}}
    app.invoke({"user_request": "Build FastAPI JWT Service"}, config)`
  },
  {
    id: "memory",
    title: "Thread & Long-Term Memory",
    tagline: "Cross-session state retention and store.",
    description: "Supports short-term thread memory within a single execution run and long-term semantic memory for re-using past architecture plans.",
    code: `from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
# Store reusable architectural patterns
store.put(
    namespace=("architecture_patterns", "fastapi"),
    key="jwt_auth",
    value={"recommended_libs": ["pyjwt", "passlib", "sqlalchemy"]}
)`
  },
  {
    id: "interrupts",
    title: "Human-in-the-Loop Interrupts",
    tagline: "Pause execution and wait for user input.",
    description: "Interrupts allow the graph to pause execution right before or after specific nodes, allowing human intervention before resuming graph execution.",
    code: `# Compile graph with interrupt before Human node
app = workflow.compile(
    checkpointer=checkpointer,
    interrupt_before=["human"]
)

# Execution pauses automatically when 'human' node is hit.
# User submits answer via CLI/Web, then app resumes:
app.invoke(Command(resume={"database": "PostgreSQL"}), config)`
  },
  {
    id: "langsmith",
    title: "LangSmith Tracing",
    tagline: "End-to-end agent tracing & telemetry.",
    description: "Automatically captures full graph trajectories, LLM latency, token counts, node transitions, and feedback loops in LangSmith dashboards.",
    code: `import os

# Enable automated LangSmith telemetry tracing
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "orchestratorflow-production"
os.environ["LANGCHAIN_API_KEY"] = "ls__..."`
  }
];
