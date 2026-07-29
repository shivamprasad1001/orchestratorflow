"""
Polyglot code execution tool for running generated code in any programming language.
Supports Python, JavaScript/Node.js, TypeScript, C++, C, Go, Rust, Java, Shell, etc.
"""

import subprocess
import tempfile
import os
import shutil
from typing import Dict, Any, Optional


DEFAULT_RUN_COMMANDS = {
    ".py": "python3 {file}",
    ".js": "node {file}",
    ".ts": "npx ts-node {file}",
    ".sh": "bash {file}",
    ".rb": "ruby {file}",
    ".php": "php {file}",
}

DEFAULT_BUILD_RUN_COMMANDS = {
    ".cpp": {"build": "g++ -O2 {file} -o {bin}", "run": "{bin}"},
    ".c": {"build": "gcc -O2 {file} -o {bin}", "run": "{bin}"},
    ".go": {"build": "go build -o {bin} {file}", "run": "{bin}"},
    ".rs": {"build": "rustc {file} -o {bin}", "run": "{bin}"},
    ".java": {"build": "javac {file}", "run": "java -cp {dir} Main"},
}


def execute_code(
    code: str,
    file_name: Optional[str] = None,
    build_cmd: Optional[str] = None,
    run_cmd: Optional[str] = None,
    timeout: int = 15
) -> Dict[str, Any]:
    """
    Executes code in any programming language inside a controlled temporary directory.

    Returns:
        Dict containing:
        - success (bool)
        - stdout (str)
        - stderr (str)
        - exit_code (int)
    """
    if not file_name:
        file_name = "main.py"

    ext = os.path.splitext(file_name)[1].lower()

    with tempfile.TemporaryDirectory() as tmp_dir:
        file_path = os.path.join(tmp_dir, file_name)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        bin_path = os.path.join(tmp_dir, "app_bin")

        # Determine compilation step if needed
        if build_cmd:
            formatted_build = build_cmd.format(file=file_path, bin=bin_path, dir=tmp_dir)
        elif ext in DEFAULT_BUILD_RUN_COMMANDS:
            formatted_build = DEFAULT_BUILD_RUN_COMMANDS[ext]["build"].format(file=file_path, bin=bin_path, dir=tmp_dir)
        else:
            formatted_build = None

        # Execute build if present
        if formatted_build:
            try:
                build_res = subprocess.run(
                    formatted_build,
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    cwd=tmp_dir
                )
                if build_res.returncode != 0:
                    return {
                        "success": False,
                        "stdout": build_res.stdout,
                        "stderr": f"Compilation Error:\n{build_res.stderr}",
                        "exit_code": build_res.returncode
                    }
            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "stdout": "",
                    "stderr": f"Compilation timed out after {timeout} seconds.",
                    "exit_code": -1
                }

        # Determine run command
        if run_cmd:
            formatted_run = run_cmd.format(file=file_path, bin=bin_path, dir=tmp_dir)
        elif formatted_build and ext in DEFAULT_BUILD_RUN_COMMANDS:
            formatted_run = DEFAULT_BUILD_RUN_COMMANDS[ext]["run"].format(file=file_path, bin=bin_path, dir=tmp_dir)
        elif ext in DEFAULT_RUN_COMMANDS:
            formatted_run = DEFAULT_RUN_COMMANDS[ext]["run"].format(file=file_path, bin=bin_path, dir=tmp_dir) if isinstance(DEFAULT_RUN_COMMANDS[ext], dict) else DEFAULT_RUN_COMMANDS[ext].format(file=file_path, bin=bin_path, dir=tmp_dir)
        else:
            # Fallback to python3 if unknown
            formatted_run = f"python3 {file_path}"

        try:
            res = subprocess.run(
                formatted_run,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=tmp_dir
            )
            return {
                "success": res.returncode == 0,
                "stdout": res.stdout,
                "stderr": res.stderr,
                "exit_code": res.returncode
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
                "stderr": f"Execution error: {str(e)}",
                "exit_code": -1
            }
