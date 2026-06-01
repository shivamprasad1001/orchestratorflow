from .python_runtime import PythonRuntime
from .javascript_runtime import JavaScriptRuntime
from .cpp_runtime import CPPRuntime
from .java_runtime import JavaRuntime
from .go_runtime import GoRuntime
from .rust_runtime import RustRuntime
from .base import BaseRuntime

_RUNTIMES = {
    "python": PythonRuntime(),
    "javascript": JavaScriptRuntime(),
    "cpp": CPPRuntime(),
    "java": JavaRuntime(),
    "go": GoRuntime(),
    "rust": RustRuntime(),
}

def get_runtime(lang: str) -> BaseRuntime:
    lang = lang.lower()
    if lang not in _RUNTIMES:
        raise ValueError(f"Unsupported language: {lang}. Supported: {list(_RUNTIMES.keys())}")
    return _RUNTIMES[lang]

def list_runtimes() -> list[BaseRuntime]:
    return list(_RUNTIMES.values())
