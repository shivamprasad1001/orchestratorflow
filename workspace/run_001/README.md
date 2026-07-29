# Simple To-Do App

A simple command-line interface (CLI) To-Do application built in Python.

## Features

*   Add new tasks
*   View all tasks with their status
*   Mark tasks as complete
*   Delete tasks

## Getting Started

### Prerequisites

*   Python 3.6 or higher

### Installation

1.  Clone the repository (or download the files):
    ```bash
    git clone <repository_url>
    cd todo-app
    ```

2.  No external dependencies are required for this basic version.

### How to Run

Navigate to the project's root directory and run the main application file:

```bash
python -m todo_app
```

This will start the CLI application, and you will be presented with a menu of options.

## Usage

Follow the on-screen menu prompts:

1.  **Add Task**: Enter a description for your new task.
2.  **View Tasks**: See a numbered list of all your tasks, indicating whether they are `[ ]` incomplete or `[x]` complete.
3.  **Mark Task Complete**: Enter the number corresponding to the task you wish to mark as complete.
4.  **Delete Task**: Enter the number corresponding to the task you wish to delete.
5.  **Exit**: Quit the application.

## Running Tests

To ensure everything is working correctly, you can run the provided unit and integration tests.

Navigate to the project's root directory and run:

```bash
python -m unittest discover tests
```

This command will discover and run all tests in the `tests/` directory.
