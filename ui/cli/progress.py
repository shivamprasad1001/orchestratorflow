"""
Progress and spinner helpers for the CLI.
"""

from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.spinner import Spinner


def agent_progress() -> Progress:
    return Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TimeElapsedColumn(),
        transient=True,
    )


def spinner(text: str) -> Spinner:
    return Spinner("dots", text=text, style="cyan")
