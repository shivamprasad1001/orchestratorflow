import os
import json
from datetime import datetime
from languages import get_runtime

def _extract_java_classname(code: str) -> str:
    """
    Priority 1: public class containing 'public static void main'
    Priority 2: first public class found
    Fallback: 'Solution'
    """
    import re
    # Find all public class names
    all_public = re.findall(r'public\s+class\s+(\w+)', code)
    if not all_public:
        return "Solution"

    # Check which one contains main()
    for cls in all_public:
        # Find the class body and check for main inside it
        # This is a simplified regex to look for main after the class declaration
        pattern = rf'class\s+{cls}\s*\{{[^}}]*public\s+static\s+void\s+main'
        if re.search(pattern, code, re.DOTALL):
            return cls

    # Fallback: first public class
    return all_public[0]

def save_output(state, config) -> dict[str, str]:
    """
    Saves the final code and report to the outputs directory.
    Uses runtime-specific extensions for the code file.
    """
    os.makedirs("outputs", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    runtime = get_runtime(state.target_language)
    ext = runtime.file_extension
    
    # Determine filename
    if state.target_language.lower() == "java":
        classname = _extract_java_classname(state.code)
        code_filename = f"{classname}_{timestamp}{ext}"
    else:
        code_filename = f"solution_{timestamp}{ext}"

    code_path = os.path.join("outputs", code_filename)
    report_path = os.path.join("outputs", f"report_{timestamp}.md")
    
    # Save code
    with open(code_path, "w") as f:
        f.write(state.code)
        
    # Save report
    report_content = f"""# OrchestratorFlow Report
- **Task:** {state.task}
- **Language:** {runtime.name}
- **Timestamp:** {datetime.now().isoformat()}

## Plan
{state.plan}

## Design
{state.design}

## Test Results
{state.test_results}

## Code
```{state.target_language}
{state.code}
```
"""
    with open(report_path, "w") as f:
        f.write(report_content)
        
    return {
        "code_path": code_path,
        "report_path": report_path
    }
