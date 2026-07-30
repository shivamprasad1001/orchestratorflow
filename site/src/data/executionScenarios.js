export const DEMO_STEPS = [
  {
    stepIndex: 0,
    agent: "user",
    title: "User Request Ingestion",
    description: "User submits prompt: 'Build a secure FastAPI OAuth2 JWT microservice with SQLAlchemy and Pytest.'",
    supervisorThought: "Initializing new workflow graph run_042. Establishing shared GraphState.",
    state: {
      current_agent: "User",
      current_phase: "initialized",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SYSTEM] Initialized GraphState for run_042",
      "[SUPERVISOR] Routing START -> Planner"
    ]
  },
  {
    stepIndex: 1,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor inspects GraphState: plan == null.",
    supervisorThought: "Condition matched: Planning Required. Routing execution to Planner node.",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_planner",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Evaluating GraphState condition...",
      "[SUPERVISOR] Selected next node: Planner"
    ]
  },
  {
    stepIndex: 2,
    agent: "planner",
    title: "Planner Execution",
    description: "Planner deconstructs request into architectural DAG and file manifest. Control returns to Supervisor.",
    supervisorThought: "Planner finished. Control returned to Supervisor.",
    state: {
      current_agent: "Planner",
      current_phase: "planning_complete",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[PLANNER] Discovered components: Auth, Security, Database, Tests",
      "[PLANNER] Created file manifest: main.py, auth.py, db.py, test_auth.py",
      "[PLANNER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 3,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor inspects GraphState: Design Missing.",
    supervisorThought: "Condition matched: Design Missing. Routing to Designer node.",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_designer",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Plan validated. Design specifications missing.",
      "[SUPERVISOR] Selected next node: Designer"
    ]
  },
  {
    stepIndex: 4,
    agent: "designer",
    title: "Designer Execution",
    description: "Designer produces API schemas and database models. Control returns to Supervisor.",
    supervisorThought: "Designer finished. Control returned to Supervisor.",
    state: {
      current_agent: "Designer",
      current_phase: "design_complete",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[DESIGNER] Generated Pydantic specs for TokenResponse & UserCreate",
      "[DESIGNER] Defined SQLite / SQLAlchemy ORM mappings",
      "[DESIGNER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 5,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor inspects GraphState: Code Missing.",
    supervisorThought: "Condition matched: Code Missing. Routing to Coder node.",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_coder",
      review_status: "pending",
      test_status: "pending",
      iteration: 0,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Design contracts ready. Source code missing.",
      "[SUPERVISOR] Selected next node: Coder"
    ]
  },
  {
    stepIndex: 6,
    agent: "coder",
    title: "Coder Execution",
    description: "Coder writes workspace code: main.py, auth.py, db.py, and test_auth.py. Control returns to Supervisor.",
    supervisorThought: "Coder finished. Control returned to Supervisor.",
    state: {
      current_agent: "Coder",
      current_phase: "coding_complete",
      review_status: "pending",
      test_status: "pending",
      iteration: 1,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[CODER] Created src/main.py, src/auth.py, src/db.py",
      "[CODER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 7,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor inspects GraphState: Code updated, review required.",
    supervisorThought: "Routing control to Reviewer node.",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_reviewer",
      review_status: "pending",
      test_status: "pending",
      iteration: 1,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Selected next node: Reviewer"
    ]
  },
  {
    stepIndex: 8,
    agent: "reviewer",
    title: "Reviewer Audit (FAILS)",
    description: "Reviewer detects missing JWT exception handling in auth.py. Control returns to Supervisor.",
    supervisorThought: "Review audit completed with status: FAILED. Control returned to Supervisor.",
    state: {
      current_agent: "Reviewer",
      current_phase: "review_failed",
      review_status: "failed",
      test_status: "pending",
      iteration: 1,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[REVIEWER] ✖ ERROR: Hardcoded SECRET_KEY fallback detected (line 12)",
      "[REVIEWER] Setting state.review_status = 'failed'",
      "[REVIEWER] Control returned to Supervisor"
    ],
    isFailureStep: true
  },
  {
    stepIndex: 9,
    agent: "supervisor",
    title: "Supervisor Retry Decision",
    description: "Supervisor detects Review Failed. Routes control back to Coder node.",
    supervisorThought: "Condition matched: Review Failed. Routing BACK to Coder for incremental diff patch.",
    state: {
      current_agent: "Supervisor",
      current_phase: "feedback_loop_retry",
      review_status: "failed",
      test_status: "pending",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] ⚠️ Feedback Loop Triggered: Review Failed!",
      "[SUPERVISOR] Selected next node: Coder (Iteration 2/5)"
    ],
    isFailureStep: true
  },
  {
    stepIndex: 10,
    agent: "coder",
    title: "Coder Incremental Patch",
    description: "Coder applies git diff patch to auth.py. Control returns to Supervisor.",
    supervisorThought: "Patch applied. Control returned to Supervisor.",
    state: {
      current_agent: "Coder",
      current_phase: "coding_complete",
      review_status: "pending",
      test_status: "pending",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[CODER] Applied git diff patch to src/auth.py",
      "[CODER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 11,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor re-triggers Reviewer node.",
    supervisorThought: "Selected next node: Reviewer",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_reviewer",
      review_status: "pending",
      test_status: "pending",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Re-triggering code review."
    ]
  },
  {
    stepIndex: 12,
    agent: "reviewer",
    title: "Reviewer Audit (PASSES)",
    description: "Reviewer inspects patched auth.py. All checks pass cleanly! Control returns to Supervisor.",
    supervisorThought: "Review status: PASSED. Control returned to Supervisor.",
    state: {
      current_agent: "Reviewer",
      current_phase: "review_passed",
      review_status: "passed",
      test_status: "pending",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[REVIEWER] ✔ Security and syntax check passed",
      "[REVIEWER] Setting state.review_status = 'passed'",
      "[REVIEWER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 13,
    agent: "supervisor",
    title: "Supervisor Dynamic Route",
    description: "Supervisor inspects GraphState: Review passed, tests pending.",
    supervisorThought: "Selected next node: Tester",
    state: {
      current_agent: "Supervisor",
      current_phase: "routing_to_tester",
      review_status: "passed",
      test_status: "pending",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] Routing to Tester node."
    ]
  },
  {
    stepIndex: 14,
    agent: "tester",
    title: "Tester Execution",
    description: "Tester executes Pytest suite. All 6 tests pass! Control returns to Supervisor.",
    supervisorThought: "All tests passed. Control returned to Supervisor.",
    state: {
      current_agent: "Tester",
      current_phase: "testing_passed",
      review_status: "passed",
      test_status: "passed",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[TESTER] 6 passed in 0.14s. Setting state.test_status = 'passed'",
      "[TESTER] Control returned to Supervisor"
    ]
  },
  {
    stepIndex: 15,
    agent: "supervisor",
    title: "Supervisor Workflow Completion",
    description: "Supervisor inspects GraphState: Everything Passed.",
    supervisorThought: "Condition matched: Everything Passed. Routing to END node.",
    state: {
      current_agent: "Supervisor",
      current_phase: "completed",
      review_status: "passed",
      test_status: "passed",
      iteration: 2,
      workspace: "workspace/run_042",
      clarification_needed: false
    },
    logs: [
      "[SUPERVISOR] ✔ Everything Passed (Review: Passed, Tests: Passed)",
      "[SUPERVISOR] Routing -> END. Workflow complete!"
    ]
  }
];

export const STATE_MACHINE_DECISIONS = [
  {
    id: "plan_required",
    condition: "Planning Required",
    trigger: "state.plan == null",
    targetNode: "Planner",
    desc: "Initial state or spec missing. Supervisor routes to Planner."
  },
  {
    id: "design_missing",
    condition: "Design Missing",
    trigger: "state.plan != null && state.design_specs == null",
    targetNode: "Designer",
    desc: "Architecture ready, API models missing. Supervisor routes to Designer."
  },
  {
    id: "code_missing",
    condition: "Code Missing",
    trigger: "state.design_specs != null && state.workspace == null",
    targetNode: "Coder",
    desc: "Design contracts ready, workspace source files missing. Supervisor routes to Coder."
  },
  {
    id: "review_failed",
    condition: "Review Failed",
    trigger: "state.review_status == 'failed'",
    targetNode: "Coder",
    desc: "AST static analysis or security check failed. Supervisor routes back to Coder with error feedback payload."
  },
  {
    id: "tests_failed",
    condition: "Tests Failed",
    trigger: "state.test_status == 'failed'",
    targetNode: "Coder",
    desc: "Pytest or integration tests failed. Supervisor routes back to Coder to fix implementation."
  },
  {
    id: "need_clarification",
    condition: "Need Clarification",
    trigger: "state.clarification_needed == true",
    targetNode: "Human",
    desc: "Ambiguous user prompt or critical trade-off detected. Supervisor interrupts graph execution and asks human."
  },
  {
    id: "everything_passed",
    condition: "Everything Passed",
    trigger: "state.review_status == 'passed' && state.test_status == 'passed'",
    targetNode: "END",
    desc: "All code review and test gates satisfied. Supervisor finalizes workflow and transitions to END."
  }
];
