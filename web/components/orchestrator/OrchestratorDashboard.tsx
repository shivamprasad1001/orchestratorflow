'use client'

import { useEffect } from 'react'
import { useOrchestratorStore } from '@/lib/store'
import { SideBar } from './SideBar'
import { CodeViewer } from './CodeViewer'
import { AgentTimeline } from './AgentTimeline'
import { ExecutionDashboard } from './ExecutionDashboard'
import { LogsViewer } from './LogsViewer'
import { KnowledgeGraph } from './KnowledgeGraph'
import { ReconnectingBanner } from './ReconnectingBanner'
import { HITLModal } from './HITLModal'
import { CompleteModal } from './CompleteModal'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'
import { Activity, Layout, Terminal } from 'lucide-react'

interface OrchestratorDashboardProps {
  sessionId: string
}

export function OrchestratorDashboard({ sessionId }: OrchestratorDashboardProps) {
  const executionState = useOrchestratorStore((state) => state.executionState)
  const isConnected = useOrchestratorStore((state) => state.isConnected)
  const pendingHITL = useOrchestratorStore((state) => state.pendingHITL)

  return (
    <div className="w-full h-screen flex flex-row bg-[#0b0e14] text-[#c9d1d9] overflow-hidden">
      {!isConnected && <ReconnectingBanner />}
      <SideBar />

      <div className="flex-1 h-full overflow-hidden p-2">
        <PanelGroup direction="vertical">
          {/* Top Row: Timeline | Editor | Iterations */}
          <Panel defaultSize={70} minSize={30}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20} minSize={15}>
                <div className="h-full flex flex-col bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Timeline</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <AgentTimeline />
                  </div>
                </div>
              </Panel>
              
              <PanelResizeHandle className="w-1.5 transition-colors hover:bg-accent/20" />
              
              <Panel defaultSize={55} minSize={30}>
                <CodeViewer />
              </Panel>
              
              <PanelResizeHandle className="w-1.5 transition-colors hover:bg-accent/20" />
              
              <Panel defaultSize={25} minSize={20}>
                <div className="h-full flex flex-col bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Layout className="w-3.5 h-3.5" />
                    <span>Iterations</span>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
                    <ExecutionDashboard />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="h-1.5 transition-colors hover:bg-accent/20" />

          {/* Bottom Row: Knowledge Graph | Logs */}
          <Panel defaultSize={30} minSize={20}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full flex flex-col bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Knowledge Graph</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <KnowledgeGraph />
                  </div>
                </div>
              </Panel>
              
              <PanelResizeHandle className="w-1.5 transition-colors hover:bg-accent/20" />
              
              <Panel defaultSize={50} minSize={30}>
                <LogsViewer />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      {pendingHITL && <HITLModal hitlId={pendingHITL} />}
      
      {executionState.status === 'completed' && (
        <CompleteModal
          success={true}
          finalCode={executionState.currentCode}
          metrics={{
            duration: executionState.totalDuration,
            tokens: executionState.totalTokens,
            iterations: executionState.totalIterations,
          }}
        />
      )}
      
      {executionState.status === 'error' && (
        <CompleteModal
          success={false}
          errorMessage={executionState.errorMessage}
          metrics={{
            duration: executionState.totalDuration,
            tokens: executionState.totalTokens,
            iterations: executionState.totalIterations,
          }}
        />
      )}
    </div>
  )
}
