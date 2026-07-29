from typing import List
from task import Task

class TaskManager:
    def __init__(self) -> None:
        self._tasks: List[Task] = []

    def add_task(self, description: str) -> None:
        try:
            new_task = Task(description)
            self._tasks.append(new_task)
        except ValueError as e:
            print(f"Error adding task: {e}")

    def get_all_tasks(self) -> List[Task]:
        return list(self._tasks) # Return a copy to prevent external modification

    def mark_task_complete(self, task_index: int) -> bool:
        if self._is_valid_index(task_index):
            self._tasks[task_index].completed = True
            return True
        return False

    def delete_task(self, task_index: int) -> bool:
        if self._is_valid_index(task_index):
            del self._tasks[task_index]
            return True
        return False

    def _is_valid_index(self, index: int) -> bool:
        return 0 <= index < len(self._tasks)
