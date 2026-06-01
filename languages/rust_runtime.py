from .base import BaseRuntime

class RustRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "Rust"

    @property
    def file_extension(self) -> str:
        return ".rs"

    @property
    def compile_cmd(self) -> list[str] | None:
        return ["rustc", "-o", "{binary}", "{source}"]

    @property
    def run_cmd(self) -> list[str]:
        return ["{binary}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["rustc", "--version"]

    @property
    def comment_syntax(self) -> str:
        return "//"
