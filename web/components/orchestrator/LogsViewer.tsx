'use client'

import { useOrchestratorStore } from '@/lib/store'
import { Activity } from 'lucide-react'

export function LogsViewer() {
  const executionState = useOrchestratorStore((state) => state.executionState)

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Activity className="w-3.5 h-3.5" />
        <span>Event Logs</span>
      </div>
      
      <div className="flex-1 p-4 font-mono text-[11px] space-y-1.5 overflow-y-auto bg-black/30 scrollbar-thin scrollbar-thumb-[#30363d]">
        {executionState.events.length === 0 ? (
          <div className="text-muted-foreground italic opacity-50">Waiting for events...</div>
        ) : (
          executionState.events.map((event, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-[#30363d] pl-3 py-0.5 hover:bg-[#161b22] transition-colors group">
              <span className="text-[#8b949e] shrink-0 font-mono">
                {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              <span className={`shrink-0 font-bold uppercase tracking-tighter ${
                event.type.includes('error') ? 'text-red-400' : 
                event.type.includes('complete') ? 'text-green-400' : 'text-accent'
              }`}>
                {event.type}
              </span>
              <span className="text-[#c9d1d9] break-words">
                {event.type === 'agent_start' && (
                  <>
                    <span className="text-accent font-bold">[{event.agent}]</span> {event.message || 'Processing...'}
                  </>
                )}
                {event.type === 'agent_end' && (
                  <>
                    <span className="text-accent font-bold">[{event.agent}]</span> Finished with status: 
                    <span className={event.status === 'success' ? 'text-green-400' : 'text-red-400'}> {event.status}</span>
                    {event.elapsed && <span className="text-muted-foreground ml-2">({(event.elapsed / 1000).toFixed(1)}s)</span>}
                  </>
                )}
                {event.type === 'code_generated' && `New code block committed to state (${(event.code?.length || 0)} chars)`}
                {event.type === 'routing' && (
                  <>
                    <span className="text-yellow-400">➜ Routing to {event.next_agent}</span>
                    <span className="text-muted-foreground ml-2">Reason: {event.reason}</span>
                  </>
                )}
                {(!['agent_start', 'agent_end', 'code_generated', 'routing'].includes(event.type)) && (
                  <span className="opacity-70">{event.message || JSON.stringify(event.payload || event)}</span>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
