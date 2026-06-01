'use client'

import { useOrchestratorStore } from '@/lib/store'
import { AgentCard } from './AgentCard'

export function AgentTimeline() {
  const executionState = useOrchestratorStore((state) => state.executionState)
  const selectedAgentId = useOrchestratorStore((state) => state.selectedAgentId)
  const setSelectedAgentId = useOrchestratorStore((state) => state.setSelectedAgentId)

  const agents = Array.from(executionState.agents.values())

  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <div className="text-3xl mb-2">📋</div>
          <p>No agents running yet</p>
          <p className="text-xs mt-1">Execute a task to see agents in action</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isSelected={selectedAgentId === agent.id}
          onSelect={() => setSelectedAgentId(agent.id)}
        />
      ))}
    </div>
  )
}
