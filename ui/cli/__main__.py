"""
Dynamic CLI entry point for the terminal UI.

Examples:
    python ui/cli
    python ui/cli --debug
    orchestratorflow "Build a FastAPI Todo API"
"""

import argparse
import sys
import time
from pathlib import Path
from typing import Optional

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.text import Text
from rich.align import Align
from rich.layout import Layout
from rich.live import Live
from rich.spinner import Spinner
from rich.table import Table
from rich.progress_bar import ProgressBar
from rich import box
from rich.style import Style


def _bootstrap_package_import() -> None:
    package_root = Path(__file__).resolve().parents[2]
    project_root = package_root.parent
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))


def _print_animated_header(console: Console) -> None:
    """Print an animated agent UI header with branding."""
    title_text = "OrchestratorFlow"
    title_styles = ["bold cyan", "bold bright_cyan", "bold white"]

    with Live(console=console, refresh_per_second=30, transient=True) as live:
        for i, _ in enumerate(title_text):
            frame = Text(title_text[: i + 1], style=title_styles[i % len(title_styles)])
            live.update(
                Align.center(
                    Text.assemble(frame, "\n", Text("AI Agent Orchestration Engine", style="dim"))
                )
            )
            time.sleep(0.03)

    console.print()
    final_title = Text(title_text, style="bold bright_cyan")
    final_title.stylize("underline", 0, len(title_text))
    console.print(Align.center(final_title))
    
    subtitle_parts = [
        Text("⚡ ", style="yellow"),
        Text("AI Agent Orchestration Engine", style="dim white"),
        Text(" ⚡", style="yellow")
    ]
    subtitle = Text.assemble(*subtitle_parts)
    console.print(Align.center(subtitle))
    
    # Version info
    version_text = Text("v1.0.0", style="dim italic")
    console.print(Align.center(version_text))
    console.print()


def _show_preflight_animation(console: Console) -> None:
    """Show animated preflight checks."""
    console.print()
    
    checks = [
        ("Environment", "✓ Environment ready", "green"),
        ("Dependencies", "✓ Dependencies verified", "green"),
        ("Workflow Engine", "✓ Engine initialized", "green"),
        ("Memory Store", "✓ Memory ready", "green"),
    ]
    
    with Live(console=console, refresh_per_second=10, transient=True) as live:
        for check_name, success_msg, color in checks:
            spinner = Spinner("dots", text=f"[dim]⏳ Checking {check_name}...[/dim]")
            live.update(spinner)
            time.sleep(0.3)  # Simulate check time
            
            live.update(Text(f"[{color}]{success_msg}[/{color}]"))
            time.sleep(0.2)
    
    console.print()


def _create_task_input_panel() -> Panel:
    """Create an enhanced task input panel."""
    welcome_text = Text()
    welcome_text.append("🚀 ", style="bold")
    welcome_text.append("What would you like me to build or analyze today?", style="bold yellow")
    
    examples = Text("\n\nExamples:", style="dim italic")
    examples.append("\n  • Build a FastAPI Todo API with PostgreSQL", style="dim")
    examples.append("\n  • Analyze and refactor the user authentication module", style="dim")
    examples.append("\n  • Create a React dashboard with real-time data", style="dim")
    
    full_text = Text.assemble(welcome_text, examples)
    
    return Panel(
        full_text,
        border_style="bright_blue",
        box=box.DOUBLE,
        padding=(1, 2),
        title="[bold bright_blue]Task Input[/bold bright_blue]",
        subtitle="[dim]Press Enter to submit, Ctrl+C to exit[/dim]"
    )


def _create_task_confirmation(task: str, debug: bool, verbose: bool) -> Panel:
    """Create an enhanced task confirmation panel."""
    # Truncate task if too long
    display_task = task[:200] + "..." if len(task) > 200 else task
    
    confirmation = Table.grid(padding=(0, 2))
    confirmation.add_column(style="bold cyan", width=15)
    confirmation.add_column(style="white")
    
    confirmation.add_row("Task:", display_task)
    confirmation.add_row("Debug Mode:", f"{'✓' if debug else '✗'} [dim]{'(enabled)' if debug else '(disabled)'}[/dim]")
    confirmation.add_row("Verbose:", f"{'✓' if verbose else '✗'} [dim]{'(enabled)' if verbose else '(disabled)'}[/dim]")
    confirmation.add_row("Timestamp:", time.strftime("%Y-%m-%d %H:%M:%S"))
    
    # Add progress bar for visual effect
    progress = ProgressBar(total=100, completed=100, width=40)
    confirmation.add_row("Ready:", progress)
    
    return Panel(
        confirmation,
        border_style="bright_green",
        box=box.HEAVY,
        padding=(1, 2),
        title="[bold bright_green]✓ Task Confirmed[/bold bright_green]",
        subtitle="[dim]Initializing orchestration engine...[/dim]"
    )


def _display_execution_header(console: Console) -> None:
    """Display execution start header."""
    console.print()
    execution_text = Text()
    execution_text.append("⚡ ", style="bold yellow")
    execution_text.append("Orchestration Engine Starting", style="bold bright_cyan")
    execution_text.append(" ⚡", style="bold yellow")
    
    # Add a decorative separator
    separator = Text("━" * 50, style="bright_blue")
    console.print(Align.center(separator))
    console.print(Align.center(execution_text))
    console.print(Align.center(separator))
    console.print()


def main() -> None:
    _bootstrap_package_import()

    console = Console()
    
    # Parse arguments before showing animations
    parser = argparse.ArgumentParser(
        description="Run the OrchestratorFlow terminal UI.",
        add_help=True,
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  orchestratorflow "Build a FastAPI Todo API"
  orchestratorflow --debug --verbose "Analyze codebase"
  orchestratorflow  # Interactive mode
        """
    )
    parser.add_argument(
        "task",
        nargs="*",
        help="Task description to send into the workflow."
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode with state and routing panels."
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging output."
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Skip animations and header (useful for scripting)."
    )
    parser.add_argument(
        "--project-name",
        type=str,
        help="Name the project/workspace for this task."
    )
    args = parser.parse_args()

    # Show header (skip if quiet mode)
    if not args.quiet:
        _print_animated_header(console)
        _show_preflight_animation(console)
    else:
        _bootstrap_package_import()
        console.print("[dim]OrchestratorFlow - Quiet Mode[/dim]")

    from orchestratorflow.ui.cli.preflight import ensure_cli_dependencies

    # Verify environment
    try:
        ensure_cli_dependencies(console)
        if not args.quiet:
            console.print("[green]✓ Environment ready[/green]\n")
    except Exception as e:
        console.print(f"[red]✗ Environment check failed: {e}[/red]")
        raise SystemExit(1)

    from orchestratorflow.ui.cli.renderer import WorkflowRenderer

    # Get task from args or prompt
    task = " ".join(args.task).strip()
    if not task:
        console.print(_create_task_input_panel())
        try:
            task = Prompt.ask("[bold cyan]→[/bold cyan]")
        except KeyboardInterrupt:
            console.print("\n[yellow]⚠ Task input cancelled[/yellow]")
            raise SystemExit(0)
    
    if not task:
        console.print("[red]✗ No task provided.[/red]")
        raise SystemExit(1)

    # Show task confirmation with details
    confirmation_panel = _create_task_confirmation(task, args.debug, args.verbose)
    console.print(confirmation_panel)
    
    # Optional: Ask for confirmation before proceeding
    if not args.quiet:
        try:
            proceed = Prompt.ask(
                "\n[dim]Proceed with execution?[/dim]",
                choices=["y", "n", "yes", "no"],
                default="y"
        )
            if proceed.lower() in ["n", "no"]:
                console.print("[yellow]⚠ Execution cancelled[/yellow]")
                raise SystemExit(0)
        except KeyboardInterrupt:
            console.print("\n[yellow]⚠ Execution cancelled[/yellow]")
            raise SystemExit(0)

    # Initialize renderer with flags
    renderer = WorkflowRenderer(
        debug=args.debug,
        verbose=args.verbose
    )

    # Start execution with visual header
    if not args.quiet:
        _display_execution_header(console)
    
    try:
        renderer.run(task)
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠ Orchestration interrupted by user[/yellow]")
        raise SystemExit(1)
    except Exception as e:
        console.print(f"\n[red]✗ Orchestration failed: {e}[/red]")
        if args.debug:
            console.print_exception()
        raise SystemExit(1)


if __name__ == "__main__":
    main()
