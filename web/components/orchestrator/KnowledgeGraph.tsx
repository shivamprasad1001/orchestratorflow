'use client'

import { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { useOrchestratorStore } from '@/lib/store'
import { AGENT_TYPES } from '@/lib/constants'

export function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)
  const executionState = useOrchestratorStore((state) => state.executionState)
  const agentsMap = executionState.agents
  const events = executionState.events

  useEffect(() => {
    if (!containerRef.current) return

    // 1. Build Nodes
    const nodesArray = Array.from(agentsMap.values()).map((agent) => {
      // Find matching type info if possible, or use defaults
      const typeKey = agent.name?.toLowerCase().includes('plan') ? 'planner' :
                      agent.name?.toLowerCase().includes('coder') || agent.name?.toLowerCase().includes('dev') ? 'coder' :
                      agent.name?.toLowerCase().includes('review') ? 'reviewer' :
                      agent.name?.toLowerCase().includes('test') ? 'tester' : 'optimizer'
      
      const typeInfo = AGENT_TYPES[typeKey as keyof typeof AGENT_TYPES] || AGENT_TYPES.planner
      const isActive = agent.state === 'thinking'

      return {
        id: agent.id,
        label: `<b>${agent.name}</b>`,
        title: `Status: ${agent.state}`,
        shape: 'circularImage',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=${typeInfo.color.replace('#', '')}&color=fff&size=128`,
        size: isActive ? 35 : 25,
        font: { 
          multi: 'html', 
          color: '#c9d1d9', 
          size: 14,
          face: 'Inter, system-ui'
        },
        borderWidth: isActive ? 4 : 2,
        color: {
          border: isActive ? '#FF8C42' : '#30363d',
          background: '#0d1117',
          highlight: { border: '#FF8C42', background: '#161b22' }
        },
        shadow: isActive ? { enabled: true, color: 'rgba(255, 140, 66, 0.5)', size: 15 } : false
      }
    })

    // 2. Build Edges (Transitions)
    const edgesArray: any[] = []
    const processedEdges = new Set<string>()
    let lastAgentId: string | null = null

    // Track transitions from events
    events.forEach((event) => {
      if (event.type === 'agent_start') {
        const currentAgentId = event.agent
        if (lastAgentId && currentAgentId) {
          const edgeKey = `${lastAgentId}-${currentAgentId}`
          // We allow duplicates or multiple edges if we want to show frequency, 
          // but for a clean graph we'll stick to unique transitions
          if (!processedEdges.has(edgeKey) || lastAgentId === currentAgentId) {
            processedEdges.add(edgeKey)
            edgesArray.push({
              from: lastAgentId,
              to: currentAgentId,
              arrows: 'to',
              width: 2,
              color: { color: '#30363d', highlight: '#FF8C42', hover: '#FF8C42' },
              smooth: { 
                type: lastAgentId === currentAgentId ? 'curvedCW' : 'curvedCCW',
                roundness: lastAgentId === currentAgentId ? 0.5 : 0.2
              },
              // Self-loop handling
              selfReference: {
                size: 20,
                angle: Math.PI / 4,
                renderBehindTheNode: true
              }
            })
          }
        }
        lastAgentId = currentAgentId
      }
    })

    const nodes = new DataSet(nodesArray.length > 0 ? nodesArray : [
      { id: 'start', label: '<b>Waiting for Agents...</b>', shape: 'dot', size: 10, color: '#30363d', font: { multi: 'html', color: '#8b949e' } }
    ])
    const edges = new DataSet(edgesArray)

    const options: any = {
      nodes: {
        shapeProperties: {
          useImageSize: false,
        },
      },
      edges: {
        font: { size: 10, align: 'top', color: '#8b949e' },
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -100,
          centralGravity: 0.01,
          springLength: 150,
          springConstant: 0.08,
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
      }
    }

    const data = { nodes, edges }
    networkRef.current = new Network(containerRef.current, data, options)

    // Fit on double click
    networkRef.current.on('doubleClick', () => {
      networkRef.current?.fit({ animation: true })
    })

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
      }
    }
  }, [agentsMap, events])

  return (
    <div className="w-full h-full relative group">
      <div
        ref={containerRef}
        className="w-full h-full bg-[#0b0e14]"
      />
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Active Agent
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full bg-[#30363d]" />
          Idle Agent
        </div>
      </div>
      
      {/* Hint */}
      <div className="absolute top-4 right-4 text-[9px] font-mono text-muted-foreground/30 uppercase">
        Double click to re-center
      </div>
    </div>
  )
}
