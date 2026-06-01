import abc
import subprocess
import tempfile
import time
import os
import shutil
from dataclasses import dataclass, field

@dataclass
class ExecutionResult:
    source_file: str
    stdout: str
    stderr: str
    exit_code: int
    elapsed_ms: float
    timed_out: bool = False
    compile_error: str = ""

    @property
    def success(self) -> bool:
        return self.exit_code == 0 and not self.timed_out and not self.compile_error

class BaseRuntime(abc.ABC):
    @property
    @abc.abstractmethod
    def name(self) -> str:
        """Language name (e.g., 'Python')"""
        pass

    @property
    @abc.abstractmethod
    def file_extension(self) -> str:
        """File extension (e.g., '.py')"""
        pass

    @property
    @abc.abstractmethod
    def compile_cmd(self) -> list[str] | None:
        """Command to compile the file, or None for interpreted languages."""
        pass

    @property
    @abc.abstractmethod
    def run_cmd(self) -> list[str]:
        """Command to run the file or compiled binary."""
        pass

    @property
    @abc.abstractmethod
    def version_cmd(self) -> list[str]:
        """Command to check the version (e.g., ['python', '--version'])."""
        pass

    @property
    @abc.abstractmethod
    def comment_syntax(self) -> str:
        """Comment syntax (e.g., '#', '//')."""
        pass

    def is_available(self) -> bool:
        """Checks if the runtime is available in the system PATH."""
        try:
            subprocess.run(self.version_cmd, capture_output=True, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False

    def execute(self, code: str, timeout: int = 15) -> ExecutionResult:
        """Executes the provided code and returns the result."""
        temp_dir = tempfile.mkdtemp(prefix=f"orchestrator_{self.name.lower()}_")
        source_file = os.path.join(temp_dir, f"solution{self.file_extension}")
        binary_file = os.path.join(temp_dir, "solution.bin")
        
        # Java special case: filename must match public class name
        if self.name == "Java":
            import re
            match = re.search(r"public\s+class\s+(\w+)", code)
            if match:
                class_name = match.group(1)
                source_file = os.path.join(temp_dir, f"{class_name}.java")
            else:
                source_file = os.path.join(temp_dir, "Solution.java")

        try:
            with open(source_file, "w") as f:
                f.write(code)

            compile_error = ""
            start_time = time.time()
            
            # Compilation phase
            if self.compile_cmd:
                cmd = []
                for part in self.compile_cmd:
                    formatted = part.replace("{source}", source_file).replace("{binary}", binary_file)
                    cmd.append(formatted)
                
                # Java javac produces .class files in the same dir, doesn't use -o binary
                if self.name == "Java":
                    cmd = ["javac", source_file]

                comp_proc = subprocess.run(cmd, capture_output=True, text=True)
                if comp_proc.returncode != 0:
                    return ExecutionResult(
                        source_file=source_file,
                        stdout="",
                        stderr=comp_proc.stderr,
                        exit_code=comp_proc.returncode,
                        elapsed_ms=(time.time() - start_time) * 1000,
                        compile_error=comp_proc.stderr
                    )

            # Execution phase
            run_cmd = []
            for part in self.run_cmd:
                if self.name == "Java":
                    # java -cp {dir} {classname}
                    class_name = os.path.splitext(os.path.basename(source_file))[0]
                    formatted = part.replace("{dir}", temp_dir).replace("{classname}", class_name)
                else:
                    formatted = part.replace("{source}", source_file).replace("{binary}", binary_file)
                run_cmd.append(formatted)

            try:
                proc = subprocess.run(run_cmd, capture_output=True, text=True, timeout=timeout)
                elapsed_ms = (time.time() - start_time) * 1000
                return ExecutionResult(
                    source_file=source_file,
                    stdout=proc.stdout,
                    stderr=proc.stderr,
                    exit_code=proc.returncode,
                    elapsed_ms=elapsed_ms
                )
            except subprocess.TimeoutExpired:
                return ExecutionResult(
                    source_file=source_file,
                    stdout="",
                    stderr="Execution timed out",
                    exit_code=-1,
                    elapsed_ms=timeout * 1000,
                    timed_out=True
                )

        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

    def format_error(self, result: ExecutionResult) -> str:
        """Returns a human-readable error string."""
        if result.compile_error:
            return f"COMPILATION ERROR:\n{result.compile_error}"
        if result.timed_out:
            return f"TIMEOUT ERROR: Execution timed out after {result.elapsed_ms/1000:.1f}s"
        return f"RUNTIME ERROR (Exit Code {result.exit_code}):\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
