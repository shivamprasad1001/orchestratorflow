"""
Main entry point for OrchestratorFlow CLI.
"""

import argparse

from rich.console import Console

from orchestratorflow.ui.cli.preflight import ensure_cli_dependencies


def main() -> None:
    parser = argparse.ArgumentParser(description="Run OrchestratorFlow in the terminal.")
    parser.add_argument("task", nargs="*", help="Task to send into the workflow.")
    parser.add_argument("--debug", action="store_true", help="Print state deltas and routing decisions.")
    args = parser.parse_args()

    console = Console()
    ensure_cli_dependencies(console)

    from orchestratorflow.ui.cli.renderer import WorkflowRenderer

    task = " ".join(args.task).strip()
    if not task:
        task = input("Task: ").strip()
    if not task:
        raise SystemExit("No task provided.")

    WorkflowRenderer(debug=args.debug).run(task)

if __name__ == "__main__":
    main()
