class Task:
    def __init__(self, description: str, completed: bool = False):
        if not isinstance(description, str) or not description.strip():
            raise ValueError("Task description cannot be empty.")
        self.description = description.strip()
        self.completed = completed

    def __repr__(self) -> str:
        status = "[x]" if self.completed else "[ ]"
        return f"{status} {self.description}"
