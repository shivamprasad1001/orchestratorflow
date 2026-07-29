from task_manager import TaskManager
from cli import CLI

if __name__ == "__main__":
    task_manager = TaskManager()
    cli = CLI(task_manager)
    cli.run()
