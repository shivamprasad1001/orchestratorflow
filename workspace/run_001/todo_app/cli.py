from typing import Optional
from task_manager import TaskManager

class CLI:
    def __init__(self, task_manager: TaskManager) -> None:
        self._task_manager = task_manager

    def display_menu(self) -> None:
        print("\n--- To-Do App Menu ---")
        print("1. Add Task")
        print("2. View Tasks")
        print("3. Mark Task Complete")
        print("4. Delete Task")
        print("5. Exit")
        print("----------------------")

    def get_user_choice(self) -> str:
        return input("Enter your choice: ").strip()

    def run(self) -> None:
        while True:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == '1':
                self._handle_add_task()
            elif choice == '2':
                self._handle_view_tasks()
            elif choice == '3':
                self._handle_mark_complete()
            elif choice == '4':
                self._handle_delete_task()
            elif choice == '5':
                print("Exiting To-Do App. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.")

    def _handle_add_task(self) -> None:
        description = input("Enter task description: ").strip()
        if description:
            self._task_manager.add_task(description)
            print(f"Task '{description}' added.")
        else:
            print("Task description cannot be empty.")

    def _handle_view_tasks(self) -> None:
        tasks = self._task_manager.get_all_tasks()
        if not tasks:
            print("No tasks in the list.")
            return

        print("\n--- Your Tasks ---")
        for i, task in enumerate(tasks):
            print(f"{i + 1}. {task}")
        print("------------------")

    def _handle_mark_complete(self) -> None:
        self._handle_view_tasks()
        task_index = self._get_task_index_input("Enter the number of the task to mark complete: ")
        if task_index is not None:
            if self._task_manager.mark_task_complete(task_index - 1):
                print("Task marked as complete.")
            else:
                print("Invalid task number. Please try again.")

    def _handle_delete_task(self) -> None:
        self._handle_view_tasks()
        task_index = self._get_task_index_input("Enter the number of the task to delete: ")
        if task_index is not None:
            if self._task_manager.delete_task(task_index - 1):
                print("Task deleted.")
            else:
                print("Invalid task number. Please try again.")

    def _get_task_index_input(self, prompt: str) -> Optional[int]:
        try:
            user_input = input(prompt)
            index = int(user_input)
            if index <= 0:
                print("Task number must be positive.")
                return None
            return index
        except ValueError:
            print("Invalid input. Please enter a number.")
            return None
