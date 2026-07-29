"""
Event subscriber and workflow runner for the Rich CLI.
"""

from time import perf_counter
from typing import Any, Dict

from rich.align import Align
from rich.columns import Columns
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.prompt import Prompt
from rich.table import Table

from orchestratorflow.events import WorkflowEvent
from orchestratorflow.graph import create_orchestrator_graph
from orchestratorflow.ui.cli.display import TerminalDisplay
from orchestratorflow.ui.cli.logger import WorkflowLogger
from orchestratorflow.ui.cli.panels import header_panel, summary_table
from orchestratorflow.ui.cli.progress import agent_progress, spinner


class WorkflowRenderer:
    def __init__(self, debug: bool = False, verbose: bool = False) -> None:
        self.console = Console()
        self.display = TerminalDisplay(self.console)
        self.logger = WorkflowLogger()
        self.debug = debug
        self.verbose = verbose
        self.state: Dict[str, Any] = {}

    def handle_event(self, event: WorkflowEvent) -> None:
        self.logger.record(event)
        if event.updated_state:
            self.state = dict(event.updated_state)

        if event.type == "agent_started" and event.agent:
            self.display.print_started(event.agent)
            if event.agent == "coder":
                self._show_coder_progress()
        elif event.type == "agent_finished":
            self.display.print_agent_result(event)
        elif event.type == "router_decision" and event.agent and event.router_decision:
            self.display.print_route(event.agent, event.router_decision)

        if self.debug:
            self.display.print_debug(event)

    def run(self, task: str) -> None:
        started_at = perf_counter()
        self.state = _initial_state(task)
        self.console.print(header_panel(task, "Planning..."))

        while True:
            graph = create_orchestrator_graph(event_sink=self.handle_event)
            with Live(Align.center(spinner("Running workflow...")), console=self.console, refresh_per_second=12, transient=True):
                self.state = graph.invoke(self.state)

            if self.state.get("needs_human_input"):
                self._handle_human_input()
                continue
            break

        total_time = perf_counter() - started_at
        status = self.state.get("workflow_status")
        if status == "failed":
            self.console.print(
                Panel(
                    self.state.get("test_feedback") or self.state.get("supervisor_reasoning") or "Workflow failed.",
                    title="[bold red]Workflow Failed[/bold red]",
                    border_style="red",
                )
            )
        else:
            self.console.print(Panel("[bold green]Workflow Finished[/]", border_style="green"))
        self.console.print(Columns([summary_table(self.state, total_time), header_panel(task, status or "Finished")]))
        self._command_loop()

    def _handle_human_input(self) -> None:
        question = self.state.get("clarification_question") or "Please provide clarification."
        options = self.state.get("clarification_options") or [
            "Answer with guidance",
            "Skip and let agents decide",
        ]
        table = Table(show_header=False, box=None, padding=(0, 1))
        table.add_column("Option", style="bold red", width=4)
        table.add_column("Action")
        for index, option in enumerate(options, start=1):
            table.add_row(str(index), option)
        table.add_row("/state", "Show current graph state")
        table.add_row("/logs", "Show state transition logs")

        self.console.print(
            Panel(
                table,
                title="[bold red]Planner Needs Guidance[/bold red]",
                subtitle="[dim]Choose 1 to answer, 2 to skip[/dim]",
                border_style="red",
            )
        )
        self.console.print(Panel(question, title="Question", border_style="red"))
        while True:
            choice = Prompt.ask("[bold red]Choice[/bold red]", default="2")
            choice = choice.strip().lower()
            if choice == "/state":
                self.display.print_state(self.state)
                continue
            if choice == "/logs":
                self.display.print_logs(self.logger.all())
                continue
            if choice in {"2", "s", "skip"}:
                self.state["human_feedback"] = "User skipped clarification. Proceed with sensible defaults."
                self.state["needs_human_input"] = False
                self.state["ambiguity_detected"] = False
                self.state["clarification_options"] = []
                return
            if choice in {"1", "a", "answer"}:
                answer = Prompt.ask("[bold red]Guidance[/bold red]")
                if answer.strip():
                    self.state["human_feedback"] = answer.strip()
                    self.state["needs_human_input"] = False
                    self.state["ambiguity_detected"] = False
                    self.state["clarification_options"] = []
                    return
                self.console.print("[yellow]Empty guidance. Choose 2 to skip.[/]")
                continue
            if choice:
                self.state["human_feedback"] = choice
                self.state["needs_human_input"] = False
                self.state["ambiguity_detected"] = False
                self.state["clarification_options"] = []
                return

    def _command_loop(self) -> None:
        self.console.print("[dim]Commands: /state, /logs, /exit[/]")
        while True:
            command = Prompt.ask("[bold cyan]orchestratorflow[/]", default="/exit")
            if command == "/state":
                self.display.print_state(self.state)
            elif command == "/logs":
                self.display.print_logs(self.logger.all())
            elif command in {"/exit", "exit", "quit"}:
                return
            else:
                self.console.print("[yellow]Unknown command. Try /state, /logs, or /exit.[/]")

    def _show_coder_progress(self) -> None:
        progress = agent_progress()
        with progress:
            description = "Creating project..." if self.state.get("iteration", 0) == 0 else "Patching project..."
            task_id = progress.add_task(description, total=100)
            for completed in (20, 45, 70, 100):
                progress.update(task_id, completed=completed)


def _initial_state(task: str) -> Dict[str, Any]:
    return {
        "user_input": task,
        "target_language": None,
        "route_mode": None,
        "next_agent": None,
        "supervisor_reasoning": None,
        "completed_agents": [],
        "last_agent": None,
        "plan": None,
        "design": None,
        "project_path": None,
        "project_files": [],
        "modified_files": [],
        "iteration": 0,
        "review_status": None,
        "review_feedback": None,
        "test_status": None,
        "test_feedback": None,
        "workflow_status": "running",
        "ambiguity_detected": False,
        "human_feedback": None,
        "needs_human_input": False,
        "clarification_question": None,
        "clarification_options": [],
    }
