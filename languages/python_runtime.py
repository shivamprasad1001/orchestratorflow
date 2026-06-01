from .base import BaseRuntime

class PythonRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "Python"

    @property
    def file_extension(self) -> str:
        return ".py"

    @property
    def compile_cmd(self) -> list[str] | None:
        return None

    @property
    def run_cmd(self) -> list[str]:
        return ["python3", "{source}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["python3", "--version"]

    @property
    def comment_syntax(self) -> str:
        return "#"
