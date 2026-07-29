"""
Python code execution tool for running generated code in a controlled environment.
Captures stdout, stderr, execution status, and tracebacks for the Tester Agent.
"""

import sys
import subprocess
import tempfile
import os
from typing import Dict, Any


def execute_python_code(code: str, timeout: int = 15) -> Dict[str, Any]:
    """
    Executes a string of Python code in an isolated subprocess.

    Returns:
        Dict containing:
        - success (bool): True if exit code is 0, False otherwise
        - stdout (str): Standard output from code execution
        - stderr (str): Standard error output (e.g. tracebacks)
        - exit_code (int): Subprocess exit code
    """
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as tmp_file:
        tmp_file.write(code)
        tmp_path = tmp_file.name

    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )
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
            "stderr": f"Execution timed out after {timeout} seconds.",
            "exit_code": -1
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Subprocess execution error: {str(e)}",
            "exit_code": -1
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
