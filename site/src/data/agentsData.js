export const AGENTS_DATA = [
  {
    id: "supervisor",
    name: "Supervisor",
    role: "The Central Brain & Dynamic Router",
    tagline: "Evaluates global GraphState after every step to decide which agent executes next.",
    badge: "Hub Brain",
    purpose: "Coordinates multiple specialized AI agents. Every agent returns control to the Supervisor. The Supervisor analyzes the GraphState and dynamically routes execution.",
    responsibilities: [
      "Analyze GraphState after every single agent node execution",
      "Evaluate state flags (review_status, test_status, iteration count)",
      "Dynamically select next target node: Planner, Designer, Coder, Reviewer, Tester, Human, or END",
      "Enforce maximum iteration limits to prevent infinite loops",
      "Escalate to Human node when clarification is required"
    ],
    inputs: `{
  "current_phase": "review_complete",
  "review_status": "failed",
  "review_feedback": ["Unused import 'jwt'", "Missing docstring in auth.py"],
  "iteration": 1,
  "workspace_path": "workspace/run_001"
}`,
    outputs: `{
  "next_agent": "Coder",
  "routing_reason": "Review failed with linting issues; sending control back to Coder with feedback payload.",
  "increment_iteration": true
}`,
    executionTrigger: "Triggers automatically after any worker agent finishes execution or upon workflow start (START).",
    stateUpdates: [
      "Sets 'current_agent' to selected target agent",
      "Increments 'iteration' counter on feedback loop retries",
      "Sets 'current_phase' to 'routing_decision_complete'",
      "Emits telemetry trace to LangSmith"
    ]
  },
  {
    id: "planner",
    name: "Planner",
    role: "Deconstructor & Strategy Architect",
    tagline: "Translates high-level requests into modular execution plans and file manifests.",
    badge: "Strategy",
    purpose: "Deconstructs software prompt requests into structured execution DAGs, file manifests, and architectural requirements before code generation.",
    responsibilities: [
      "Parse prompt requirements and define component boundaries",
      "Formulate file manifest with target file paths and dependencies",
      "Specify verification criteria for Reviewer and Tester agents",
      "Adapt execution DAG if Supervisor routes back for refactoring"
    ],
    inputs: `{
  "user_request": "Build a FastAPI REST API with JWT auth and SQLite database",
  "existing_workspace": null
}`,
    outputs: `{
  "plan": {
    "architecture": "Layered FastAPI Microservice",
    "files": ["src/main.py", "src/auth/jwt.py", "src/db/models.py", "tests/test_auth.py"],
    "dependencies": ["fastapi", "pyjwt", "sqlalchemy", "pytest"]
  }
}`,
    executionTrigger: "Triggered by Supervisor when GraphState indicates plan == null or major refactor required.",
    stateUpdates: [
      "Populates 'state.plan' schema",
      "Populates 'state.file_manifest'",
      "Sets 'state.current_phase' to 'planning_complete'"
    ]
  },
  {
    id: "designer",
    name: "Designer",
    role: "Schema & Interface Specialist",
    tagline: "Establishes Pydantic models, API contracts, and database schemas.",
    badge: "Schemas",
    purpose: "Ensures structural consistency by defining API contracts, Pydantic request/response models, and database schema mappings before code implementation.",
    responsibilities: [
      "Define request/response Pydantic models & OpenAPI specs",
      "Structure SQL database table relationships and ORM models",
      "Validate API contracts against Planner requirements"
    ],
    inputs: `{
  "plan": { "files": ["src/main.py", "src/auth/jwt.py"] },
  "user_request": "FastAPI JWT Auth"
}`,
    outputs: `{
  "schemas": {
    "UserCreate": { "email": "str", "password": "str" },
    "TokenResponse": { "access_token": "str", "token_type": "str" }
  }
}`,
    executionTrigger: "Triggered by Supervisor after Planner completes initial project architecture.",
    stateUpdates: [
      "Appends schema definitions to 'state.design_specs'",
      "Sets 'state.current_phase' to 'design_complete'"
    ]
  },
  {
    id: "coder",
    name: "Coder",
    role: "Workspace Code Engine",
    tagline: "Generates or incrementally patches workspace files with production code.",
    badge: "Implementation",
    purpose: "Writes source files inside the persistent workspace directory. In feedback loops, applies targeted diff patches instead of regenerating the project.",
    responsibilities: [
      "Implement source files according to Planner & Designer specifications",
      "Apply localized diff patches to modified files during feedback retries",
      "Maintain persistent workspace file structure under 'workspace/run_xxx/'"
    ],
    inputs: `{
  "plan": { ... },
  "design_specs": { ... },
  "review_feedback": ["Fix missing import 'pyjwt' in src/auth/jwt.py"]
}`,
    outputs: `{
  "modified_files": ["src/auth/jwt.py"],
  "diff_summary": "+ import jwt\\n- # placeholder"
}`,
    executionTrigger: "Triggered by Supervisor after Designer completes specs or when Reviewer/Tester fails.",
    stateUpdates: [
      "Mutates workspace files on disk",
      "Populates 'state.last_modified_files'",
      "Sets 'state.current_phase' to 'coding_complete'"
    ]
  },
  {
    id: "reviewer",
    name: "Reviewer",
    role: "Static Analysis & Security Auditor",
    tagline: "Performs AST code inspection to verify syntax, security, and contract compliance.",
    badge: "Quality Gate",
    purpose: "Acts as an automated quality gatekeeper. Inspects workspace files for syntax errors, missing imports, hardcoded secrets, and contract violations.",
    responsibilities: [
      "Execute AST syntax validation and static code analysis",
      "Check for hardcoded credentials, security risks, or dangerous functions",
      "Verify code adheres to Designer API schemas",
      "Emit structured feedback array if issues are found"
    ],
    inputs: `{
  "workspace_files": { "src/auth/jwt.py": "..." },
  "design_specs": { ... }
}`,
    outputs: `{
  "status": "failed",
  "issues": [
    { "file": "src/auth/jwt.py", "line": 12, "rule": "security", "message": "Secret key hardcoded in source." }
  ]
}`,
    executionTrigger: "Triggered by Supervisor immediately after Coder updates workspace code.",
    stateUpdates: [
      "Sets 'state.review_status' to 'passed' or 'failed'",
      "Appends structured feedback to 'state.review_feedback'",
      "Sets 'state.current_phase' to 'review_complete'"
    ]
  },
  {
    id: "tester",
    name: "Tester",
    role: "Unit & Integration Test Engine",
    tagline: "Generates unit test suites and executes them in isolated sandboxes.",
    badge: "Verification",
    purpose: "Generates Pytest/Jest test suites and executes them against the workspace codebase, capturing stdout/stderr tracebacks if assertions fail.",
    responsibilities: [
      "Generate unit & integration test files matching specs",
      "Run tests in isolated process sandbox",
      "Capture test output, exit codes, and failure tracebacks"
    ],
    inputs: `{
  "workspace_path": "workspace/run_001",
  "review_status": "passed"
}`,
    outputs: `{
  "test_status": "passed",
  "passed_count": 6,
  "failed_count": 0,
  "execution_time_ms": 140
}`,
    executionTrigger: "Triggered by Supervisor after Reviewer status is 'passed'.",
    stateUpdates: [
      "Sets 'state.test_status' to 'passed' or 'failed'",
      "Stores test logs in 'state.test_results'",
      "Sets 'state.current_phase' to 'testing_complete'"
    ]
  },
  {
    id: "human",
    name: "Human",
    role: "Human-in-the-Loop Clarification Node",
    tagline: "Pauses graph execution via LangGraph checkpointer interrupts for user input.",
    badge: "Interrupt Node",
    purpose: "Pauses execution when ambiguous requirements or critical trade-offs arise, prompting the user for input without losing graph context.",
    responsibilities: [
      "Suspend execution state via LangGraph Checkpointer interrupt",
      "Present explicit prompt options to human user",
      "Inject user response back into GraphState payload",
      "Resume graph execution seamlessly from checkpointed state"
    ],
    inputs: `{
  "question": "Which database engine do you prefer?",
  "options": ["SQLite (Default)", "PostgreSQL", "MongoDB"]
}`,
    outputs: `{
  "user_selection": "PostgreSQL"
}`,
    executionTrigger: "Triggered by Supervisor when 'state.clarification_needed == true'.",
    stateUpdates: [
      "Clears 'state.clarification_needed' flag",
      "Appends user decisions to 'state.human_inputs'",
      "Resumes workflow routing via Supervisor"
    ]
  }
];
