export const COMPARISON_FRAMEWORKS = [
  { id: "single_llm", name: "Single LLM", highlight: false },
  { id: "crewai", name: "CrewAI", highlight: false },
  { id: "autogen", name: "AutoGen", highlight: false },
  { id: "metagpt", name: "MetaGPT", highlight: false },
  { id: "chatdev", name: "ChatDev", highlight: false },
  { id: "orchestratorflow", name: "OrchestratorFlow", highlight: true }
];

export const COMPARISON_FEATURES = [
  {
    category: "Orchestration & Control",
    title: "Routing Architecture",
    values: {
      single_llm: "None (Single prompt)",
      crewai: "Sequential / Hierarchical",
      autogen: "GroupChat / Conversational",
      metagpt: "SOP Sequential Pipeline",
      chatdev: "Linear Phase Chat",
      orchestratorflow: "Adaptive Dynamic Supervisor Hub (LangGraph)"
    }
  },
  {
    category: "Orchestration & Control",
    title: "Decision Engine",
    values: {
      single_llm: "Static",
      crewai: "Fixed Task Chain",
      autogen: "LLM Speaker Selection",
      metagpt: "Rigid SOP Steps",
      chatdev: "Predefined Chat Turn",
      orchestratorflow: "StateGraph Conditional Edge Routing"
    }
  },
  {
    category: "Workspace & File Management",
    title: "File Modification Engine",
    values: {
      single_llm: "Full Code Dumps",
      crewai: "Overwrites Output File",
      autogen: "Script Overwrite",
      metagpt: "Full Repository Rewrite",
      chatdev: "Full File Regeneration",
      orchestratorflow: "Persistent Workspace + Incremental Git Diffs"
    }
  },
  {
    category: "Quality & Verification",
    title: "Feedback & Retry Loops",
    values: {
      single_llm: "Manual Re-prompting",
      crewai: "Basic Task Retry",
      autogen: "Conversational Retry",
      metagpt: "Fixed Review Phase",
      chatdev: "Simple Chat Critique",
      orchestratorflow: "Autonomous Multi-pass Review & Pytest Feedback Loops"
    }
  },
  {
    category: "Human-in-the-loop & State",
    title: "Human Interruption / Pause",
    values: {
      single_llm: "N/A",
      crewai: "Input Prompts (Basic)",
      autogen: "Human Admin Agent",
      metagpt: "Manual Input Flags",
      chatdev: "Phase Interruption",
      orchestratorflow: "First-Class LangGraph Checkpoint Interrupts"
    }
  },
  {
    category: "State & Telemetry",
    title: "State Engine & Persistence",
    values: {
      single_llm: "Context Window Only",
      crewai: "Memory Buffer",
      autogen: "Message Logs",
      metagpt: "Memory Store",
      chatdev: "Chat Logs",
      orchestratorflow: "Typed GraphState + Checkpointing + Time Travel"
    }
  },
  {
    category: "State & Telemetry",
    title: "Telemetry & Tracing",
    values: {
      single_llm: "Basic Token Logs",
      crewai: "Custom Handlers",
      autogen: "Console Logs",
      metagpt: "Log Files",
      chatdev: "Visualizer Tool",
      orchestratorflow: "Native LangSmith Tracing & Telemetry"
    }
  }
];
