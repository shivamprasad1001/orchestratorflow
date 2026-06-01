from .base import BaseRuntime

class GoRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "Go"

    @property
    def file_extension(self) -> str:
        return ".go"

    @property
    def compile_cmd(self) -> list[str] | None:
        return None

    @property
    def run_cmd(self) -> list[str]:
        return ["go", "run", "{source}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["go", "version"]

    @property
    def comment_syntax(self) -> str:
        return "//"
