import typer
import time
import os
import subprocess
import sys
from pathlib import Path
from rich.table import Table
from rich.console import Console
from rich.panel import Panel
from orchestrator import OrchestratorFlow
from config import config
from ui.console import print_banner, print_summary, console
from languages import list_runtimes, get_runtime

app = typer.Typer(name="OrchestratorFlow", help="Language-agnostic multi-agent coding orchestrator")

@app.command()
def run(
    task: str = typer.Argument(..., help="The coding task to perform"),
    lang: str = typer.Option("python", "--lang", "-l", help="Target language [python|javascript|cpp|java|go|rust]"),
    backend: str = typer.Option(None, "--backend", "-b", help="groq | gemini | ollama"),
    model: str = typer.Option(None, "--model", "-m", help="Override model name"),
    max_iter: int = typer.Option(None, "--max-iter", help="Max correction iterations")
):
    """Run the orchestration loop for a specific task and language."""
    # Apply overrides
    if backend:
        config.llm_provider = backend.lower()
    
    if model:
        _b = config.llm_provider
        if _b == "groq": config.groq_model = model
        elif _b == "gemini": config.gemini_model = model
        elif _b == "ollama": config.ollama_model = model

    if max_iter:
        config.max_iterations = max_iter

    # Validate API keys
    if config.llm_provider == "groq" and not config.groq_api_key:
        console.print("[bold red]Error: GROQ_API_KEY not set[/]")
        raise typer.Exit(1)
    if config.llm_provider == "gemini" and not config.gemini_api_key:
        console.print("[bold red]Error: GEMINI_API_KEY not set[/]")
        raise typer.Exit(1)

    # Check if runtime is available
    try:
        runtime = get_runtime(lang)
    except ValueError as e:
        console.print(f"[red]Error:[/] {e}")
        raise typer.Exit(1)

    if not runtime.is_available():
        console.print(f"[bold red]Error: {runtime.name} runtime is not available.[/]")
        console.print(f"Please install it before proceeding.")
        # Provide hints
        hints = {
            "python": "sudo apt install python3",
            "javascript": "sudo apt install nodejs",
            "cpp": "sudo apt install g++",
            "java": "sudo apt install default-jdk",
            "go": "sudo apt install golang",
            "rust": "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        }
        console.print(f"[dim]Hint:[/] {hints.get(lang.lower(), '')}")
        raise typer.Exit(1)

    print_banner(config, runtime.name)
    
    start_time = time.time()
    orchestrator = OrchestratorFlow(config)
    state = orchestrator.run(task, lang)
    elapsed_time = time.time() - start_time
    
    print_summary(state, elapsed_time)

@app.command()
def ui(
    port: int = typer.Option(8000, "--port", "-p", help="Backend port"),
    frontend: bool = typer.Option(True, "--frontend", help="Start frontend dev server")
):
    """Start the OrchestratorFlow Web UI (Backend + Frontend)."""
    console.print(Panel.fit(
        "[bold cyan]OrchestratorFlow Web Interface[/]\n"
        "[dim]Launching backend and frontend servers...[/]",
        border_style="cyan"
    ))

    processes = []
    try:
        # 1. Start Backend (FastAPI)
        console.print(f"[yellow]➜[/] Starting Backend on http://localhost:{port}...")
        backend_proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "web.bridge:app", "--host", "0.0.0.0", "--port", str(port), "--reload"],
            env=os.environ.copy()
        )
        processes.append(backend_proc)

        # 2. Start Frontend (Next.js)
        if frontend:
            web_dir = Path("web")
            if (web_dir / "package.json").exists():
                console.print("[yellow]➜[/] Starting Frontend dev server...")
                # Try npm or yarn
                npm_cmd = "npm" if not (web_dir / "yarn.lock").exists() else "yarn"
                frontend_proc = subprocess.Popen(
                    [npm_cmd, "run", "dev"],
                    cwd=str(web_dir),
                    env=os.environ.copy()
                )
                processes.append(frontend_proc)
            else:
                console.print("[red]✗[/] Frontend source not found in web/ directory.")

        console.print("\n[bold green]✓ Both servers are running![/]")
        console.print(f"[dim]Backend:  http://localhost:{port}[/]")
        console.print(f"[dim]Frontend: http://localhost:3000[/]\n")
        console.print("[yellow]Press Ctrl+C to stop both servers.[/]")

        # Keep main thread alive
        while True:
            time.sleep(1)
            # Check if any process died
            for p in processes:
                if p.poll() is not None:
                    console.print(f"[red]✗ One of the servers stopped unexpectedly (Exit Code: {p.returncode})[/]")
                    raise KeyboardInterrupt

    except KeyboardInterrupt:
        console.print("\n[yellow]Stopping servers...[/]")
        for p in processes:
            p.terminate()
        for p in processes:
            p.wait()
        console.print("[green]Stopped.[/]")
    except Exception as e:
        console.print(f"[red]Error launching UI: {e}[/]")
        for p in processes:
            p.terminate()

@app.command()
def frontend():
    """Start only the Frontend development server."""
    web_dir = Path("web")
    if not web_dir.exists():
        console.print("[red]✗ Web directory not found.[/]")
        return
        
    console.print(Panel.fit("[bold cyan]➜ Starting Frontend (Next.js) only...[/]", border_style="cyan"))
    npm_cmd = "npm" if not (web_dir / "yarn.lock").exists() else "yarn"
    try:
        subprocess.run([npm_cmd, "run", "dev"], cwd=str(web_dir))
    except KeyboardInterrupt:
        console.print("\n[yellow]Frontend stopped.[/]")

@app.command()
def build():
    """Build the frontend for production."""
    web_dir = Path("web")
    if not web_dir.exists():
        console.print("[red]✗ Web directory not found.[/]")
        return
        
    console.print(Panel.fit("[bold green]➜ Building frontend for production...[/]", border_style="green"))
    npm_cmd = "npm" if not (web_dir / "yarn.lock").exists() else "yarn"
    subprocess.run([npm_cmd, "run", "build"], cwd=str(web_dir))


@app.command()
def check_env():
    """Verify system environment and available language runtimes."""
    table = Table(title="Environment Check", border_style="blue")
    table.add_column("Runtime", style="cyan")
    table.add_column("Status", style="bold")
    table.add_column("Version / Info", style="dim")

    # Python (Host)
    import sys
    table.add_row("Python (Host)", "[green]✓ available[/]", f"{sys.version.split()[0]}")

    # APIs
    table.add_row("Groq API", "[green]✓ configured[/]" if config.groq_api_key else "[yellow]✗ missing[/]", config.groq_model)
    table.add_row("Gemini API", "[green]✓ configured[/]" if config.gemini_api_key else "[yellow]✗ missing[/]", config.gemini_model)

    table.add_section()
    
    # Target Runtimes
    runtimes = list_runtimes()
    for rt in runtimes:
        if rt.is_available():
            import subprocess
            try:
                ver_out = subprocess.check_output(rt.version_cmd, stderr=subprocess.STDOUT, text=True).strip().split('\n')[0]
            except:
                ver_out = "Available"
            table.add_row(rt.name, "[green]✓ available[/]", ver_out)
        else:
            table.add_row(rt.name, "[red]✗ missing[/]", "Not found in PATH")

    console.print(table)

if __name__ == "__main__":
    app()
