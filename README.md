# OrchestratorFlow

**Developed by Shivam Prasad**

A modular infrastructure for orchestrating multiple AI coding agents. This system provides a collaborative environment where specialized AI agents (e.g., Implementer, Reviewer, Refiner) work together on complex software development tasks.

## Features
- **Two Independent Systems**:
  - **Orchestrator**: Workflow-based multi-agent coordination.
  - **Agentic Team**: Role-based team collaboration.
- **Unified CLI**: Start interactive shells for both systems with a single entry point.
- **Modern Web UI**: Responsive dashboards for monitoring and managing agent tasks.
- **UV Powered**: Optimized for the `uv` package manager.

## Execution

### CLI Mode
```bash
# Orchestrator CLI
uv run ./orchestratorflow shell

# Agentic Team CLI
uv run ./orchestratorflow agentic-shell
```

### Web UI
1. **Orchestrator UI**: `uv run python orchestrator/ui/app.py` (Port 5001)
2. **Agentic Team UI**: `uv run python agentic_team/ui/app.py` (Port 5002)

---
© 2026 Shivam Prasad. All rights reserved.
