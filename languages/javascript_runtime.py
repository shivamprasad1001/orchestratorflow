from .base import BaseRuntime

class JavaScriptRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "JavaScript"

    @property
    def file_extension(self) -> str:
        return ".js"

    @property
    def compile_cmd(self) -> list[str] | None:
        return None

    @property
    def run_cmd(self) -> list[str]:
        return ["node", "{source}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["node", "--version"]

    @property
    def comment_syntax(self) -> str:
        return "//"
