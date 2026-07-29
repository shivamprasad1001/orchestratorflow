import unittest
from todo_app.task_manager import TaskManager
from todo_app.task import Task

class TestTaskManager(unittest.TestCase):

    def setUp(self):
        self.manager = TaskManager()

    def test_initial_state(self):
        self.assertEqual(self.manager.get_all_tasks(), [])

    def test_add_task(self):
        self.manager.add_task("Task 1")
        tasks = self.manager.get_all_tasks()
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0].description, "Task 1")
        self.assertFalse(tasks[0].completed)

        self.manager.add_task("Task 2")
        tasks = self.manager.get_all_tasks()
        self.assertEqual(len(tasks), 2)
        self.assertEqual(tasks[1].description, "Task 2")

    def test_add_empty_task_description(self):
        # TaskManager's add_task should handle ValueError from Task constructor
        # and print an error, but not add the task.
        with unittest.mock.patch('builtins.print') as mock_print:
            self.manager.add_task("  ")
            self.assertEqual(len(self.manager.get_all_tasks()), 0)
            mock_print.assert_called_with("Error adding task: Task description cannot be empty.")

    def test_get_all_tasks_returns_copy(self):
        self.manager.add_task("Original Task")
        tasks_copy = self.manager.get_all_tasks()
        tasks_copy.append(Task("New Task in copy")) # Modify the copy

        self.assertEqual(len(self.manager.get_all_tasks()), 1)
        self.assertEqual(self.manager.get_all_tasks()[0].description, "Original Task")

    def test_mark_task_complete_valid_index(self):
        self.manager.add_task("Task A")
        self.manager.add_task("Task B")
        self.manager.add_task("Task C")

        self.assertTrue(self.manager.mark_task_complete(1))
        tasks = self.manager.get_all_tasks()
        self.assertFalse(tasks[0].completed)
        self.assertTrue(tasks[1].completed)
        self.assertFalse(tasks[2].completed)

    def test_mark_task_complete_invalid_index(self):
        self.manager.add_task("Task A")
        self.assertFalse(self.manager.mark_task_complete(1))
        self.assertFalse(self.manager.mark_task_complete(-1))
        self.assertFalse(self.manager.mark_task_complete(100))
        self.assertFalse(self.manager.get_all_tasks()[0].completed) # Should remain incomplete

    def test_mark_task_complete_empty_list(self):
        self.assertFalse(self.manager.mark_task_complete(0))

    def test_mark_already_completed_task(self):
        self.manager.add_task("Task X")
        self.manager.mark_task_complete(0)
        self.assertTrue(self.manager.get_all_tasks()[0].completed)
        self.assertTrue(self.manager.mark_task_complete(0)) # Marking again should still return True
        self.assertTrue(self.manager.get_all_tasks()[0].completed)

    def test_delete_task_valid_index(self):
        self.manager.add_task("Task 0")
        self.manager.add_task("Task 1")
        self.manager.add_task("Task 2")

        self.assertTrue(self.manager.delete_task(1))
        tasks = self.manager.get_all_tasks()
        self.assertEqual(len(tasks), 2)
        self.assertEqual(tasks[0].description, "Task 0")
        self.assertEqual(tasks[1].description, "Task 2") # Task 2 shifted to index 1

    def test_delete_task_invalid_index(self):
        self.manager.add_task("Task A")
        self.assertFalse(self.manager.delete_task(1))
        self.assertFalse(self.manager.delete_task(-1))
        self.assertFalse(self.manager.delete_task(100))
        self.assertEqual(len(self.manager.get_all_tasks()), 1) # List should remain unchanged

    def test_delete_task_empty_list(self):
        self.assertFalse(self.manager.delete_task(0))

    def test_delete_first_task(self):
        self.manager.add_task("First")
        self.manager.add_task("Second")
        self.assertTrue(self.manager.delete_task(0))
        self.assertEqual(len(self.manager.get_all_tasks()), 1)
        self.assertEqual(self.manager.get_all_tasks()[0].description, "Second")

    def test_delete_last_task(self):
        self.manager.add_task("First")
        self.manager.add_task("Second")
        self.assertTrue(self.manager.delete_task(1))
        self.assertEqual(len(self.manager.get_all_tasks()), 1)
        self.assertEqual(self.manager.get_all_tasks()[0].description, "First")

    def test_is_valid_index(self):
        self.manager.add_task("A")
        self.manager.add_task("B")
        self.assertTrue(self.manager._is_valid_index(0))
        self.assertTrue(self.manager._is_valid_index(1))
        self.assertFalse(self.manager._is_valid_index(2))
        self.assertFalse(self.manager._is_valid_index(-1))
        self.manager = TaskManager() # Empty list
        self.assertFalse(self.manager._is_valid_index(0))
