"""
Execution log storage for CLI rendering.
"""

from typing import Iterable, List

from orchestratorflow.events import WorkflowEvent


class WorkflowLogger:
    def __init__(self) -> None:
        self._events: List[WorkflowEvent] = []

    def record(self, event: WorkflowEvent) -> None:
        self._events.append(event)

    def all(self) -> Iterable[WorkflowEvent]:
        return tuple(self._events)
