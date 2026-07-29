"""
Reusable Rich panels for the OrchestratorFlow CLI.
"""

from typing import Any, Dict

from rich.align import Align
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

AGENT_COLORS = {
    "supervisor": "bright_blue",
    "intake": "bright_white",
    "planner": "blue",
    "designer": "cyan",
    "coder": "green",
    "reviewer": "yellow",
    "tester": "magenta",
    "human": "red",
}


def header_panel(task: str, status: str) -> Panel:
    body = Text()
    body.append("OrchestratorFlow v1.0\n", style="bold white")
    body.append("Adaptive Multi-Agent Code Generation\n\n", style="dim")
    body.append("Task:\n", style="bold")
    body.append(f"{task}\n\n", style="white")
    body.append("Status:\n", style="bold")
    body.append(status, style="bold cyan")
    return Panel(Align.left(body), border_style="bright_blue")


def agent_started_panel(agent: str) -> Panel:
    color = AGENT_COLORS.get(agent, "white")
    return Panel(f"[bold {color}]✓ {agent.title()} Started[/]", border_style=color)


def routing_panel(source: str, target: str) -> Panel:
    color = AGENT_COLORS.get(source, "white")
    body = Text()
    body.append("Routing...\n\n", style="bold")
    body.append(source.title(), style=color)
    body.append("\n    ↓\n", style="dim")
    body.append(target.title() if target != "__end__" else "Workflow Finished", style="bold")
    return Panel(body, title="Adaptive Routing", border_style=color)


def state_table(state: Dict[str, Any]) -> Table:
    table = Table(title="Current GraphState", show_header=True, header_style="bold cyan")
    table.add_column("Key", style="bold")
    table.add_column("Value", overflow="fold")
    for key in sorted(state):
        table.add_row(str(key), _format_value(state[key]))
    return table


def summary_table(state: Dict[str, Any], total_time: float) -> Table:
    table = Table(title="Execution Summary", show_header=True, header_style="bold cyan")
    table.add_column("Agent")
    table.add_column("Status", justify="center")
    for agent in state.get("completed_agents", []) or ["supervisor"]:
        table.add_row(agent.title(), "[green]✓[/]")
    table.add_row("Iterations", str(state.get("iteration", 0)))
    table.add_row("Project Path", str(state.get("project_path") or ""))
    table.add_row("Total Time", f"{total_time:.1f} sec")
    return table


def _format_value(value: Any) -> str:
    if value is None:
        return "[dim]None[/]"
    if isinstance(value, str):
        return value if len(value) <= 500 else value[:500] + "..."
    return repr(value)
