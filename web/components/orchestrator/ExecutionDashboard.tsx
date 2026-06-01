'use client'

import { useOrchestratorStore } from '@/lib/store'
import { formatDuration, formatTokens } from '@/lib/formatting'
import { Activity, Timer, Zap, AlertCircle, Share2, Trash2 } from 'lucide-react'
import { MetricsChart } from './MetricsChart'

export function ExecutionDashboard() {
  const executionState = useOrchestratorStore((state) => state.executionState)

  const metrics = [
    {
      label: 'Duration',
      value: formatDuration(executionState.totalDuration),
      icon: Timer,
      color: 'text-accent',
    },
    {
      label: 'Tokens',
      value: formatTokens(executionState.totalTokens),
      icon: Zap,
      color: 'text-secondary',
    },
    {
      label: 'Iterations',
      value: executionState.totalIterations,
      icon: Activity,
      color: 'text-accent',
    },
  ]

  const statusIcon =
    executionState.status === 'completed'
      ? '✓'
      : executionState.status === 'error'
        ? '✕'
        : executionState.status === 'running'
          ? '⟳'
          : '○'

  const statusColor =
    executionState.status === 'completed'
      ? 'text-accent animate-pulse'
      : executionState.status === 'error'
        ? 'text-destructive'
        : executionState.status === 'running'
          ? 'text-accent animate-spin'
          : 'text-muted-foreground'

  return (
    <div className="flex flex-col h-full overflow-hidden space-y-6">
      {/* Status Card */}
      <div className="bg-black/20 rounded-lg border border-[#30363d] p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-xl ${statusColor} border border-[#30363d]`}>
            {statusIcon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Status</p>
            <p className="text-sm font-bold capitalize text-[#c9d1d9]">{executionState.status}</p>
          </div>
        </div>

        {executionState.errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-900/50 rounded text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{executionState.errorMessage}</span>
          </div>
        )}
      </div>

      {/* Metrics List */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Performance Metrics</p>
        <div className="grid gap-2">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="flex items-center justify-between p-3 bg-black/10 border border-[#30363d] rounded-md group hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-xs text-[#8b949e]">{metric.label}</span>
                </div>
                <span className="text-sm font-mono font-bold text-[#c9d1d9]">{metric.value}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 min-h-[150px] flex flex-col bg-black/20 rounded-lg border border-[#30363d] p-4 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Token Consumption</p>
        <div className="flex-1">
          <MetricsChart type="tokens" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 pt-4">
        <button className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold uppercase bg-[#161b22] border border-[#30363d] rounded hover:bg-[#30363d] transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          Export
        </button>
        <button className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-bold uppercase bg-[#161b22] border border-[#30363d] rounded hover:bg-[#30363d] transition-colors text-red-400/80">
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  )
}
