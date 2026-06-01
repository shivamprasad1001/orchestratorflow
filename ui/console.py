from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.layout import Layout
from rich.text import Text
from rich.status import Status
from datetime import datetime

console = Console()

def print_banner(config, language: str):
    """Print the application banner with system status."""
    # Lookup model name dynamically
    _backend_model_map = {
        "groq":   lambda c: c.groq_model,
        "gemini": lambda c: c.gemini_model,
        "ollama": lambda c: c.ollama_model,
    }
    model = _backend_model_map.get(
        config.llm_provider.lower(), lambda c: "unknown"
    )(config)

    banner_text = Text()
    banner_text.append("\n", style="none")
    banner_text.append(" ▟▙ ", style="bold cyan")
    banner_text.append("OrchestratorFlow ", style="bold white")
    banner_text.append(f"v2.1.0", style="dim white")
    banner_text.append("  ·  ", style="dim")
    banner_text.append(f"{config.llm_provider}", style="bold green")
    banner_text.append("/", style="dim")
    banner_text.append(f"{model}", style="green")
    banner_text.append("\n")
    banner_text.append(" ▜▛ ", style="bold cyan")
    banner_text.append(f"CORE ENGINE ACTIVE", style="overline dim cyan")
    banner_text.append("  ·  ", style="dim")
    banner_text.append(f"{language.upper()}", style="bold yellow")
    banner_text.append("\n", style="none")

    console.print(Panel(
        banner_text,
        border_style="cyan",
        padding=(0, 2),
        subtitle="[dim]Advanced Agentic Logic[/]",
        subtitle_align="right"
    ))

def print_step(agent: str, status: str, message: str):
    """Print a single agent step with premium icons."""
    icons = {
        "Planner": "📋",
        "Design":  "📐",
        "Designer": "📐",
        "Coder":   "💻",
        "Reviewer": "🔍",
        "Tester":   "🧪",
        "System":   "⚙️",
    }
    
    colors = {
        "running": "yellow",
        "success": "green",
        "fail":    "red",
        "info":    "blue"
    }
    
    icon = icons.get(agent, "🤖")
    color = colors.get(status, "white")
    
    prefix = "[bold yellow]➜[/]" if status == "running" else ("[bold green]✓[/]" if status == "success" else "[bold red]✗[/]")
    
    console.print(f"{prefix} [bold {color}][{agent}]:[/] {message}")

def print_summary(state, total_time: float):
    """Print a premium execution summary table."""
    table = Table(
        title="[bold cyan]FINAL EXECUTION SUMMARY[/]",
        box=None,
        header_style="bold magenta",
        border_style="dim white",
        padding=(0, 2)
    )
    
    table.add_column("METRIC", style="dim cyan")
    table.add_column("VALUE", style="bold white")
    
    table.add_row("Task", state.task[:50] + "..." if len(state.task) > 50 else state.task)
    table.add_row("Language", state.target_language, style="yellow")
    table.add_row("Total Iterations", str(state.iteration))
    table.add_row("In Tokens", str(state.total_input_tokens), style="dim green")
    table.add_row("Out Tokens", str(state.total_output_tokens), style="dim green")
    table.add_row("Time Elapsed", f"{total_time:.2f}s", style="magenta")
    table.add_row("Status", "SUCCESS" if state.is_complete else "FAILED", style="bold green" if state.is_complete else "bold red")
    
    console.print("\n")
    console.print(table)
    console.print("\n")