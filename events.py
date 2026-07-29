"""
Presentation-neutral execution events emitted by the OrchestratorFlow graph.
"""

from dataclasses import dataclass, field
import re
from time import perf_counter
from typing import Any, Callable, Dict, List, Optional

GraphState = Dict[str, Any]
EventSink = Callable[["WorkflowEvent"], None]


class LLMQuotaError(RuntimeError):
    def __init__(self, message: str, retry_after_seconds: Optional[int] = None) -> None:
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


@dataclass(frozen=True)
class WorkflowEvent:
    type: str
    agent: Optional[str] = None
    message: str = ""
    previous_state: GraphState = field(default_factory=dict)
    updated_state: GraphState = field(default_factory=dict)
    router_decision: Optional[str] = None
    elapsed: Optional[float] = None


def emit_event(sink: Optional[EventSink], event: WorkflowEvent) -> None:
    if sink is not None:
        sink(event)


def wrap_agent_node(
    agent: str,
    node: Callable[[GraphState], GraphState],
    sink: Optional[EventSink],
) -> Callable[[GraphState], GraphState]:
    def wrapped(state: GraphState) -> GraphState:
        previous_state = dict(state)
        emit_event(
            sink,
            WorkflowEvent(
                type="agent_started",
                agent=agent,
                message=f"{agent.title()} started",
                previous_state=previous_state,
            ),
        )

        started_at = perf_counter()
        try:
            updates = node(state)
        except Exception as exc:
            quota_error = _quota_error(exc)
            if quota_error is None:
                raise
            updates = {
                "workflow_status": "failed",
                "next_agent": "end",
                "supervisor_reasoning": str(quota_error),
                "test_status": "fail",
                "test_feedback": str(quota_error),
                "last_agent": agent,
            }
        if updates is None:
            updates = {}
        if agent != "supervisor":
            completed_agents = list(previous_state.get("completed_agents", []))
            completed_agents.append(agent)
            updates = {
                **updates,
                "last_agent": agent,
                "completed_agents": completed_agents,
            }
        elapsed = perf_counter() - started_at
        updated_state = {**previous_state, **updates}

        emit_event(
            sink,
            WorkflowEvent(
                type="agent_finished",
                agent=agent,
                message=f"{agent.title()} finished",
                previous_state=previous_state,
                updated_state=updated_state,
                elapsed=elapsed,
            ),
        )
        return updates

    return wrapped


def _quota_error(exc: Exception) -> Optional[LLMQuotaError]:
    message = str(exc)
    if "RESOURCE_EXHAUSTED" not in message and "429" not in message and "quota" not in message.lower():
        return None
    retry_after = _retry_after_seconds(message)
    suffix = f" Retry after about {retry_after}s." if retry_after is not None else ""
    return LLMQuotaError(
        "LLM quota exhausted for the current provider/model. "
        "Wait for the quota window, switch models/providers, or add billing/quota."
        + suffix,
        retry_after_seconds=retry_after,
    )


def _retry_after_seconds(message: str) -> Optional[int]:
    match = re.search(r"retryDelay['\"]?: ['\"]?(\d+)s", message)
    if match:
        return int(match.group(1))
    match = re.search(r"retry in ([\d.]+)s", message, flags=re.IGNORECASE)
    if match:
        return int(float(match.group(1)))
    return None


def wrap_router(
    source: str,
    router: Callable[[GraphState], str],
    sink: Optional[EventSink],
) -> Callable[[GraphState], str]:
    def wrapped(state: GraphState) -> str:
        decision = router(state)
        emit_event(
            sink,
            WorkflowEvent(
                type="router_decision",
                agent=source,
                message=f"{source.title()} routed to {decision}",
                updated_state=dict(state),
                router_decision=str(decision),
            ),
        )
        return decision

    return wrapped


class EventRecorder:
    def __init__(self) -> None:
        self.events: List[WorkflowEvent] = []

    def emit(self, event: WorkflowEvent) -> None:
        self.events.append(event)
