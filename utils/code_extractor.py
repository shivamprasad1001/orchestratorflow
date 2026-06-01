import re

def strip_fences(text: str, language: str = "python") -> str:
    """
    Strips markdown code fences from the given text for any language.
    Handles specific language tags like ```python, ```js, etc.
    """
    # Pattern to match code blocks with or without language tags
    # Supports common variations like ```python, ```javascript, ```js, ```cpp, ```c++, ```java, ```go, ```rust, ```rs
    pattern = r"```(?:\w+[\+\#]*)?\n?(.*?)\n?```"
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
    
    if match:
        return match.group(1).strip()
    
    # If no fences found, check for a single block without a closing tag or just raw code
    # Sometimes LLMs fail to close the block
    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) > 1:
            return "\n".join(lines[1:]).strip()
            
    return text.strip()
