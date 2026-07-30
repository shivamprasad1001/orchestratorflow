export const FEATURES_LIST = [
  {
    id: "adaptive_routing",
    title: "Adaptive Routing",
    description: "Evaluates workflow state after every single step. Routes dynamically based on real-time code quality, test results, and missing requirements.",
    icon: "Compass",
    accent: "purple"
  },
  {
    id: "supervisor_arch",
    title: "Supervisor Architecture",
    description: "Centralized hub-and-spoke model where every specialized agent reports back control to the Supervisor brain before proceeding.",
    icon: "Cpu",
    accent: "cyan"
  },
  {
    id: "workspace_persistence",
    title: "Workspace Persistence",
    description: "Maintains a structured disk workspace (`workspace/run_xxx/`). Project files stay intact across iterations and sessions.",
    icon: "Folder",
    accent: "emerald"
  },
  {
    id: "incremental_updates",
    title: "Incremental File Updates",
    description: "Never regenerates the whole codebase. Generates precision patch diffs for updated files, preserving untouched code.",
    icon: "GitBranch",
    accent: "amber"
  },
  {
    id: "code_review",
    title: "Automated Code Review",
    description: "Performs AST static analysis, checks for hardcoded credentials, verifies API contracts, and emits structured failure feedback.",
    icon: "ShieldCheck",
    accent: "rose"
  },
  {
    id: "testing_engine",
    title: "Isolated Testing Engine",
    description: "Spawns sandboxed Pytest/Jest runs to verify functionality and provides full failure tracebacks directly back to the Coder agent.",
    icon: "TestTube2",
    accent: "blue"
  },
  {
    id: "human_in_loop",
    title: "Human-in-the-Loop",
    description: "Uses native LangGraph interrupts to pause execution, solicit user clarification, and resume seamlessly without losing state.",
    icon: "UserCheck",
    accent: "fuchsia"
  },
  {
    id: "checkpointing",
    title: "State Checkpointing",
    description: "Persists every graph node transition to SQLite or PostgreSQL, enabling instant state inspection and time travel debugging.",
    icon: "Database",
    accent: "indigo"
  },
  {
    id: "observability",
    title: "Full Observability",
    description: "Track decision paths, execution time per agent, token burn rates, and state diffs with microsecond precision telemetry.",
    icon: "Activity",
    accent: "teal"
  },
  {
    id: "langsmith_integration",
    title: "LangSmith Integration",
    description: "Deep out-of-the-box integration with LangSmith for agent trace monitoring, prompt evaluation, and trajectory analytics.",
    icon: "Sparkles",
    accent: "purple"
  },
  {
    id: "rich_cli",
    title: "Rich Terminal CLI",
    description: "Interactive terminal interface powered by Rich with live streaming tree graphs, progress bars, and status dashboards.",
    icon: "Terminal",
    accent: "emerald"
  }
];
