from rich.console import Console
from rich.theme import Theme
from rich.panel import Panel

t = Theme({"primary": "cyan", "success": "bold green"})
c = Console(theme=t)

try:
    c.print(Panel("hello", border_style="success"))
    print("success border_style worked")
except Exception as e:
    print(f"Error: {e}")

try:
    c.print(Panel("hello", border_style="primary bold"))
    print("primary bold border_style worked")
except Exception as e:
    print(f"Error: {e}")
