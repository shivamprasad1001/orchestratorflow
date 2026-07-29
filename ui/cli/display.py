"""
High-level terminal display helpers.
"""

from typing import Any, Dict, Iterable

from rich.console import Console, Group
from rich.panel import Panel
from rich.table import Table
from rich.tree import Tree

from orchestratorflow.events import WorkflowEvent
from orchestratorflow.ui.cli.panels import (
    AGENT_COLORS,
    agent_started_panel,
    routing_panel,
    state_table,
)


class TerminalDisplay:
    def __init__(self, console: Console | None = None) -> None:
        self.console = console or Console()

    def print_started(self, agent: str) -> None:
        self.console.print(agent_started_panel(agent))

    def print_agent_result(self, event: WorkflowEvent) -> None:
        agent = event.agent or "agent"
        state = event.updated_state
        color = AGENT_COLORS.get(agent, "white")
        renderable = self._agent_renderable(agent, state, event.elapsed or 0)
        self.console.print(Panel(renderable, title=f"{agent.title()} Result", border_style=color))

    def print_route(self, source: str, target: str) -> None:
        if source == "supervisor":
            reason = self._last_reason()
            if reason:
                self.console.print(f"[dim]{reason}[/dim]")
        if source == "reviewer" and target == "coder":
            self.console.print("[yellow]Reviewer detected logical issues.[/]")
        if source == "tester" and target == "coder":
            self.console.print("[magenta]Tests Failed[/]")
        if source == "planner" and target == "human":
            self.console.print("[red]Planner requires clarification.[/]")
        self.console.print(routing_panel(source, target))

    def print_state(self, state: Dict[str, Any]) -> None:
        self.console.print(state_table(state))

    def print_logs(self, events: Iterable[WorkflowEvent]) -> None:
        table = Table(title="State Transitions", show_header=True, header_style="bold cyan")
        table.add_column("Type")
        table.add_column("Agent")
        table.add_column("Decision")
        table.add_column("Time")
        for event in events:
            table.add_row(
                event.type,
                event.agent or "",
                event.router_decision or "",
                f"{event.elapsed:.2f}s" if event.elapsed is not None else "",
            )
        self.console.print(table)

    def print_debug(self, event: WorkflowEvent) -> None:
        if event.type not in {"agent_finished", "router_decision"}:
            return
        tree = Tree("[bold]Debug Trace[/]")
        tree.add(f"Agent: [bold]{event.agent or '-'}[/bold]")
        if event.type == "agent_finished":
            changes = _changed_fields(event.previous_state, event.updated_state)
            changed_branch = tree.add("State Changes")
            if changes:
                for key, value in changes.items():
                    changed_branch.add(f"[cyan]{key}[/cyan]: {_short_value(value)}")
            else:
                changed_branch.add("[dim]No state changes[/dim]")
        decision = event.router_decision or "-"
        if decision == "__end__" and event.updated_state.get("needs_human_input"):
            decision = "pause for human input"
        tree.add(f"Router Decision: [bold]{decision}[/bold]")
        self.console.print(Panel(tree, border_style="dim"))

    def _agent_renderable(self, agent: str, state: Dict[str, Any], elapsed: float) -> Group:
        if agent == "supervisor":
            return Group(
                Panel(
                    f"Next: [bold]{state.get('next_agent') or 'end'}[/bold]\n"
                    f"Reason: {state.get('supervisor_reasoning') or '-'}",
                    title="Supervisor Decision",
                    border_style="bright_blue",
                ),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "intake":
            route_mode = str(state.get("route_mode") or "standard").title()
            next_step = "Coder" if state.get("route_mode") == "simple" else "Planner"
            return Group(
                Panel(f"[bold]{route_mode} Route[/bold]\nNext: {next_step}", title="Dynamic Routing", border_style="bright_white"),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "planner":
            return Group(
                Panel(state.get("user_input") or "", title="Goal", border_style="blue"),
                Panel(state.get("plan") or "", title="Algorithm", border_style="blue"),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "designer":
            return Group(
                Panel(state.get("design") or "", title="Architecture Decisions", border_style="cyan"),
                self._project_tree(state),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "coder":
            iteration = state.get("iteration", 0)
            title = "Project Created" if iteration == 1 else f"Iteration {iteration} Patch"
            return Group(
                Panel(str(state.get("project_path") or ""), title=title, border_style="green"),
                self._modified_files_table(state),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "reviewer":
            status = str(state.get("review_status") or "unknown").upper()
            style = "green" if status == "PASS" else "yellow"
            return Group(
                Panel(f"[bold {style}]{status}[/]", title="Status", border_style=style),
                Panel(state.get("review_feedback") or "", title="Feedback", border_style="yellow"),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "tester":
            status = str(state.get("test_status") or "unknown").upper()
            style = "green" if status == "PASS" else "magenta"
            return Group(
                Panel(f"[bold {style}]{status}[/]", title="Status", border_style=style),
                Panel(state.get("test_feedback") or "", title="Test Output", border_style="magenta"),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        if agent == "human":
            return Group(
                Panel(state.get("clarification_question") or "Clarification needed.", title="Question", border_style="red"),
                f"[dim]Time: {elapsed:.2f} sec[/]",
            )
        return Group(str(state), f"[dim]Time: {elapsed:.2f} sec[/]")

    def _project_tree(self, state: Dict[str, Any]) -> Tree:
        tree = Tree("[bold]Project Files[/]")
        for file_path in state.get("project_files", []) or ["pending"]:
            tree.add(file_path)
        return tree

    def _modified_files_table(self, state: Dict[str, Any]) -> Table:
        table = Table(title="Modified Files", show_header=False)
        table.add_column("File")
        for file_path in state.get("modified_files", []):
            table.add_row(f"[green]✓[/] {file_path}")
        return table

    def _last_reason(self) -> str:
        return ""


def _changed_fields(previous: Dict[str, Any], updated: Dict[str, Any]) -> Dict[str, Any]:
    changes: Dict[str, Any] = {}
    for key in sorted(set(previous) | set(updated)):
        if previous.get(key) != updated.get(key):
            changes[key] = updated.get(key)
    return changes


def _short_value(value: Any, limit: int = 140) -> str:
    if value is None:
        return "[dim]None[/dim]"
    if isinstance(value, str):
        text = value.replace("\n", " ")
        return text if len(text) <= limit else text[: limit - 3] + "..."
    if isinstance(value, list):
        if not value:
            return "[]"
        return ", ".join(str(item) for item in value[:5])
    return str(value)
