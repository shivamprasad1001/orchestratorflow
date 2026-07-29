import unittest
from todo_app.task import Task

class TestTask(unittest.TestCase):

    def test_task_initialization(self):
        task = Task("Buy groceries")
        self.assertEqual(task.description, "Buy groceries")
        self.assertFalse(task.completed)

        completed_task = Task("Finish report", completed=True)
        self.assertEqual(completed_task.description, "Finish report")
        self.assertTrue(completed_task.completed)

    def test_task_description_strip(self):
        task = Task("  Walk the dog  ")
        self.assertEqual(task.description, "Walk the dog")

    def test_task_description_empty(self):
        with self.assertRaisesRegex(ValueError, "Task description cannot be empty."):
            Task("")
        with self.assertRaisesRegex(ValueError, "Task description cannot be empty."):
            Task("   ")

    def test_task_repr_incomplete(self):
        task = Task("Read a book")
        self.assertEqual(str(task), "[ ] Read a book")

    def test_task_repr_complete(self):
        task = Task("Pay bills", completed=True)
        self.assertEqual(str(task), "[x] Pay bills")

    def test_task_repr_with_special_chars(self):
        task = Task("Task with !@#$%^&*()")
        self.assertEqual(str(task), "[ ] Task with !@#$%^&*()")

