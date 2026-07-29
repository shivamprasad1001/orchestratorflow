import unittest
from unittest.mock import patch, call
from io import StringIO
from todo_app.task_manager import TaskManager
from todo_app.cli import CLI
from todo_app.task import Task

class TestCLI(unittest.TestCase):

    def setUp(self):
        self.task_manager = TaskManager()
        self.cli = CLI(self.task_manager)

    @patch('builtins.print')
    def test_display_menu(self, mock_print):
        self.cli.display_menu()
        expected_calls = [
            call("\n--- To-Do App Menu ---"),
            call("1. Add Task"),
            call("2. View Tasks"),
            call("3. Mark Task Complete"),
            call("4. Delete Task"),
            call("5. Exit"),
            call("----------------------")
        ]
        mock_print.assert_has_calls(expected_calls)

    @patch('builtins.input', return_value='1')
    def test_get_user_choice(self, mock_input):
        choice = self.cli.get_user_choice()
        self.assertEqual(choice, '1')
        mock_input.assert_called_once_with("Enter your choice: ")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'New Task', '5'])
    def test_handle_add_task_and_exit(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 1)
        self.assertEqual(self.task_manager.get_all_tasks()[0].description, "New Task")
        mock_print.assert_any_call("Task 'New Task' added.")
        mock_print.assert_any_call("Exiting To-Do App. Goodbye!")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', '  ', '5'])
    def test_handle_add_task_empty_description(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 0)
        mock_print.assert_any_call("Task description cannot be empty.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['2', '5'])
    def test_handle_view_tasks_empty(self, mock_input, mock_print):
        self.cli.run()
        mock_print.assert_any_call("No tasks in the list.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task A', '1', 'Task B', '2', '5'])
    def test_handle_view_tasks_with_tasks(self, mock_input, mock_print):
        self.cli.run()
        expected_calls = [
            call("\n--- Your Tasks ---"),
            call("1. [ ] Task A"),
            call("2. [ ] Task B"),
            call("------------------")
        ]
        mock_print.assert_has_calls(expected_calls, any_order=False)

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task to complete', '3', '1', '2', '5'])
    def test_handle_mark_complete_valid(self, mock_input, mock_print):
        self.cli.run()
        self.assertTrue(self.task_manager.get_all_tasks()[0].completed)
        mock_print.assert_any_call("Task marked as complete.")
        # Verify view tasks shows it as complete
        expected_view_call = call("1. [x] Task to complete")
        self.assertIn(expected_view_call, mock_print.call_args_list)

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '3', '99', '5'])
    def test_handle_mark_complete_invalid_index(self, mock_input, mock_print):
        self.cli.run()
        self.assertFalse(self.task_manager.get_all_tasks()[0].completed)
        mock_print.assert_any_call("Invalid task number. Please try again.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '3', 'abc', '5'])
    def test_handle_mark_complete_non_integer_input(self, mock_input, mock_print):
        self.cli.run()
        self.assertFalse(self.task_manager.get_all_tasks()[0].completed)
        mock_print.assert_any_call("Invalid input. Please enter a number.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '3', '-1', '5'])
    def test_handle_mark_complete_negative_input(self, mock_input, mock_print):
        self.cli.run()
        self.assertFalse(self.task_manager.get_all_tasks()[0].completed)
        mock_print.assert_any_call("Task number must be positive.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task 1', '1', 'Task 2', '4', '1', '2', '5'])
    def test_handle_delete_task_valid(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 1)
        self.assertEqual(self.task_manager.get_all_tasks()[0].description, "Task 2")
        mock_print.assert_any_call("Task deleted.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '4', '99', '5'])
    def test_handle_delete_task_invalid_index(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 1)
        mock_print.assert_any_call("Invalid task number. Please try again.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '4', 'abc', '5'])
    def test_handle_delete_task_non_integer_input(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 1)
        mock_print.assert_any_call("Invalid input. Please enter a number.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['1', 'Task', '4', '-1', '5'])
    def test_handle_delete_task_negative_input(self, mock_input, mock_print):
        self.cli.run()
        self.assertEqual(len(self.task_manager.get_all_tasks()), 1)
        mock_print.assert_any_call("Task number must be positive.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['6', '5'])
    def test_run_invalid_menu_choice(self, mock_input, mock_print):
        self.cli.run()
        mock_print.assert_any_call("Invalid choice. Please try again.")
        mock_print.assert_any_call("Exiting To-Do App. Goodbye!")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['5'])
    def test_run_exit_option(self, mock_input, mock_print):
        self.cli.run()
        mock_print.assert_any_call("Exiting To-Do App. Goodbye!")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['3', '1', '5'])
    def test_mark_complete_on_empty_list(self, mock_input, mock_print):
        self.cli.run()
        mock_print.assert_any_call("No tasks in the list.")
        mock_print.assert_any_call("Invalid task number. Please try again.")

    @patch('builtins.print')
    @patch('builtins.input', side_effect=['4', '1', '5'])
    def test_delete_on_empty_list(self, mock_input, mock_print):
        self.cli.run()
        mock_print.assert_any_call("No tasks in the list.")
        mock_print.assert_any_call("Invalid task number. Please try again.")
