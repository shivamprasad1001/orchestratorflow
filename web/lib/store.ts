import { create } from 'zustand'
import { AnyWebSocketEvent, AgentInfo, Theme, TaskConfig, ExecutionState } from './types'

interface OrchestratorStore {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void

  // Task Configuration
  taskConfig: TaskConfig
  setTaskConfig: (config: Partial<TaskConfig>) => void

  // Execution State
  executionState: ExecutionState
  setExecutionStatus: (status: ExecutionState['status']) => void
  addEvent: (event: AnyWebSocketEvent) => void
  updateAgent: (agentId: string, agent: Partial<AgentInfo>) => void
  setCurrentCode: (code: string, metadata?: ExecutionState['codeMetadata']) => void
  setExecutionMetrics: (duration: number, tokens: number, iterations: number) => void
  setErrorMessage: (message: string | undefined) => void
  resetExecution: () => void

  // WebSocket State
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  reconnectionAttempts: number
  setReconnectionAttempts: (attempts: number) => void

  // HITL State
  pendingHITL: string | null
  setPendingHITL: (hitlId: string | null) => void

  // UI State
  selectedAgentId: string | null
  setSelectedAgentId: (agentId: string | null) => void
  expandedThinking: Set<string>
  toggleThinkingExpanded: (agentId: string) => void

  // Messaging
  sendMessage: (msg: any) => void
  setSendMessage: (fn: (msg: any) => void) => void
}

const initialExecutionState: ExecutionState = {
  status: 'idle',
  agents: new Map(),
  events: [],
  totalDuration: 0,
  totalTokens: 0,
  totalIterations: 0,
  codeMetadata: {
    language: 'javascript',
  },
}

export const useOrchestratorStore = create<OrchestratorStore>((set) => ({
  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  // Task Configuration
  taskConfig: {
    task: '',
    backend: 'ollama',
    model: 'codellama:13b',
    iterations: 3,
    temperature: 0.2,
  },
  setTaskConfig: (config) =>
    set((state) => ({
      taskConfig: { ...state.taskConfig, ...config },
    })),

  // Execution State
  executionState: initialExecutionState,
  setExecutionStatus: (status) =>
    set((state) => ({
      executionState: { ...state.executionState, status },
    })),
  addEvent: (event) =>
    set((state) => ({
      executionState: {
        ...state.executionState,
        events: [...state.executionState.events, event],
      },
    })),
  updateAgent: (agentId, agent) =>
    set((state) => {
      const updatedAgents = new Map(state.executionState.agents)
      const existing = updatedAgents.get(agentId) || {
        id: agentId,
        name: '',
        state: 'idle' as const,
      }
      updatedAgents.set(agentId, { ...existing, ...agent })
      return {
        executionState: {
          ...state.executionState,
          agents: updatedAgents,
        },
      }
    }),
  setCurrentCode: (code, metadata) =>
    set((state) => ({
      executionState: {
        ...state.executionState,
        currentCode: code,
        codeMetadata: metadata || state.executionState.codeMetadata,
      },
    })),
  setExecutionMetrics: (duration, tokens, iterations) =>
    set((state) => ({
      executionState: {
        ...state.executionState,
        totalDuration: duration,
        totalTokens: tokens,
        totalIterations: iterations,
      },
    })),
  setErrorMessage: (message) =>
    set((state) => ({
      executionState: {
        ...state.executionState,
        errorMessage: message,
      },
    })),
  resetExecution: () => set({ executionState: initialExecutionState }),

  // WebSocket State
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  reconnectionAttempts: 0,
  setReconnectionAttempts: (attempts) => set({ reconnectionAttempts: attempts }),

  // HITL State
  pendingHITL: null,
  setPendingHITL: (hitlId) => set({ pendingHITL: hitlId }),

  // UI State
  selectedAgentId: null,
  setSelectedAgentId: (agentId) => set({ selectedAgentId: agentId }),
  expandedThinking: new Set(),
  toggleThinkingExpanded: (agentId) =>
    set((state) => {
      const expanded = new Set(state.expandedThinking)
      if (expanded.has(agentId)) {
        expanded.delete(agentId)
      } else {
        expanded.add(agentId)
      }
      return { expandedThinking: expanded }
    }),

  // Messaging
  sendMessage: () => {},
  setSendMessage: (fn) => set({ sendMessage: fn }),
}))
