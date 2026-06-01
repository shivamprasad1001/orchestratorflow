'use client'

import { useState } from 'react'
import { AgentInfo } from '@/lib/types'
import { formatDuration, formatAgentName, formatTimestamp } from '@/lib/formatting'
import { useOrchestratorStore } from '@/lib/store'
import { ChevronDown, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AgentCardProps {
  agent: AgentInfo
  isSelected: boolean
  onSelect: () => void
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false)
  const toggleThinkingExpanded = useOrchestratorStore((state) => state.toggleThinkingExpanded)

  const statusColors = {
    idle: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    running: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 animate-pulse',
    thinking: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    waiting: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    done: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  }

  const handleToggleThinking = () => {
    toggleThinkingExpanded(agent.id)
    setIsThinkingExpanded(!isThinkingExpanded)
  }

  const handleCopyOutput = () => {
    if (agent.output) {
      navigator.clipboard.writeText(agent.output)
    }
  }

  const handleDownloadOutput = () => {
    if (agent.output) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(agent.output))
      element.setAttribute('download', `${agent.name}_output.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected
          ? 'border-accent bg-accent/5 shadow-sm'
          : 'border-border hover:border-accent/50 bg-background/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[agent.state]}`}>
            {formatAgentName(agent.name)}
          </span>
          {agent.iteration && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
              Iteration {agent.iteration}
            </span>
          )}
        </div>
        {agent.duration && (
          <span className="text-xs text-muted-foreground">{formatDuration(agent.duration)}</span>
        )}
      </div>

      {/* Thinking Section */}
      {agent.thinking && (
        <div className="mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleThinking()
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isThinkingExpanded ? 'rotate-180' : ''}`}
            />
            <span>💭 Thinking</span>
          </button>
          {isThinkingExpanded && (
            <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground max-h-32 overflow-y-auto">
              {agent.thinking}
            </div>
          )}
        </div>
      )}

      {/* Output Section */}
      {agent.output && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">Output</div>
          <div className="bg-muted rounded p-2 text-xs font-mono text-foreground max-h-24 overflow-y-auto mb-2">
            {agent.output}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                handleCopyOutput()
              }}
              className="h-6 w-6 p-0"
              title="Copy output"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                handleDownloadOutput()
              }}
              className="h-6 w-6 p-0"
              title="Download output"
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Status Info */}
      {agent.status && agent.state === 'done' && (
        <div className="mt-2 pt-2 border-t border-border text-xs">
          <span
            className={`px-2 py-1 rounded ${
              agent.status === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : agent.status === 'failed'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }`}
          >
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
          {agent.tokensUsed && (
            <span className="text-muted-foreground ml-2">{agent.tokensUsed} tokens</span>
          )}
        </div>
      )}
    </div>
  )
}
