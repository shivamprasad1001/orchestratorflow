"""
Runtime checks for the terminal UI.
"""

from importlib.util import find_spec
from typing import Iterable, List

from rich.console import Console
from rich.panel import Panel

REQUIRED_MODULES = {
    "langgraph": "langgraph",
    "langchain_core": "langchain-core",
    "langchain_google_genai": "langchain-google-genai",
    "langchain_openai": "langchain-openai",
    "dotenv": "python-dotenv",
    "rich": "rich",
}


def ensure_cli_dependencies(console: Console) -> None:
    missing = _missing_modules(REQUIRED_MODULES)
    if not missing:
        return

    packages = " ".join(REQUIRED_MODULES[module] for module in missing)
    message = (
        "[bold red]Missing Python dependencies[/]\n\n"
        "Install the project requirements in the same Python environment used to run the CLI:\n\n"
        "[bold]python -m pip install -r requirements.txt[/]\n\n"
        "Or install only the missing packages:\n\n"
        f"[bold]python -m pip install {packages}[/]"
    )
    console.print(Panel(message, title="OrchestratorFlow CLI", border_style="red"))
    raise SystemExit(1)


def _missing_modules(modules: Iterable[str]) -> List[str]:
    return [module for module in modules if find_spec(module) is None]
