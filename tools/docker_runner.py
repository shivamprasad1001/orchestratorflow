"""
Docker container execution tool for running generated code in an isolated container environment.
"""

import subprocess
import tempfile
import os
from typing import Dict, Any
from orchestratorflow.tools.code_executor import execute_code


def run_code_in_docker(code: str, image: str = "python:3.11-slim", timeout: int = 20) -> Dict[str, Any]:
    """
    Executes Python/Polyglot code in a sandboxed Docker container.
    """
    try:
        check = subprocess.run(["docker", "--version"], capture_output=True, text=True)
        if check.returncode != 0:
            return execute_code(code, timeout=timeout)
    except FileNotFoundError:
        return execute_code(code, timeout=timeout)

    with tempfile.TemporaryDirectory() as tmp_dir:
        code_file = os.path.join(tmp_dir, "main.py")
        with open(code_file, "w") as f:
            f.write(code)

        cmd = [
            "docker", "run", "--rm",
            "-v", f"{tmp_dir}:/app",
            "-w", "/app",
            "--network", "none",
            image,
            "python", "main.py"
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "exit_code": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Docker container timed out after {timeout} seconds.",
                "exit_code": -1
            }
        except Exception as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Docker execution error: {str(e)}",
                "exit_code": -1
            }
