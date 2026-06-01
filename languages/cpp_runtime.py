from .base import BaseRuntime

class CPPRuntime(BaseRuntime):
    @property
    def name(self) -> str:
        return "C++"

    @property
    def file_extension(self) -> str:
        return ".cpp"

    @property
    def compile_cmd(self) -> list[str] | None:
        return ["g++", "-o", "{binary}", "{source}", "-std=c++17"]

    @property
    def run_cmd(self) -> list[str]:
        return ["{binary}"]

    @property
    def version_cmd(self) -> list[str]:
        return ["g++", "--version"]

    @property
    def comment_syntax(self) -> str:
        return "//"
