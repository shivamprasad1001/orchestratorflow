from .base import BaseRuntime

class JavaRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "Java"

    @property
    def file_extension(self) -> str:
        return ".java"

    @property
    def compile_cmd(self) -> list[str] | None:
        return ["javac", "{source}"]

    @property
    def run_cmd(self) -> list[str]:
        return ["java", "-cp", "{dir}", "{classname}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["java", "--version"]

    @property
    def comment_syntax(self) -> str:
        return "//"
