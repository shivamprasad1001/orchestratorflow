// WebSocket Event Types
export type WebSocketEventType =
  | 'session_started'
  | 'agent_start'
  | 'agent_thinking'
  | 'agent_output_chunk'
  | 'agent_end'
  | 'routing'
  | 'status'
  | 'hitl_request'
  | 'code_generated'
  | 'complete'
  | 'error'

// Base event structure
export interface WebSocketEvent {
  type: WebSocketEventType
  timestamp: string
  sessionId: string
}

// Agent States
export type AgentState = 'idle' | 'running' | 'thinking' | 'waiting' | 'done'

// Session Started Event
export interface SessionStartedEvent extends WebSocketEvent {
  type: 'session_started'
  sessionId: string
  task: string
}

// Agent Start Event
export interface AgentStartEvent extends WebSocketEvent {
  type: 'agent_start'
  agentId: string
  agentName: string
  iteration: number
}

// Agent Thinking Event
export interface AgentThinkingEvent extends WebSocketEvent {
  type: 'agent_thinking'
  agentId: string
  thinking: string
}

// Agent Output Chunk Event (streaming)
export interface AgentOutputChunkEvent extends WebSocketEvent {
  type: 'agent_output_chunk'
  agentId: string
  chunk: string
  isFinal: boolean
}

// Agent End Event
export interface AgentEndEvent extends WebSocketEvent {
  type: 'agent_end'
  agentId: string
  agentName: string
  status: 'success' | 'failed' | 'timeout'
  duration: number
  tokensUsed: number
}

// Routing Event
export interface RoutingEvent extends WebSocketEvent {
  type: 'routing'
  fromAgent: string
  toAgent: string
  reason?: string
}

// Status Event
export interface StatusEvent extends WebSocketEvent {
  type: 'status'
  message: string
  level: 'info' | 'warning' | 'error'
}

// HITL Request Event
export interface HITLRequestEvent extends WebSocketEvent {
  type: 'hitl_request'
  hitlId: string
  agent: string
  question: string
  options?: string[]
}

// Code Generated Event
export interface CodeGeneratedEvent extends WebSocketEvent {
  type: 'code_generated'
  code: string
  language: string
  metadata: {
    filename?: string
    description?: string
    iterations?: number
  }
}

// Complete Event
export interface CompleteEvent extends WebSocketEvent {
  type: 'complete'
  success: boolean
  finalCode?: string
  totalDuration: number
  totalTokens: number
  totalIterations: number
}

// Error Event
export interface ErrorEvent extends WebSocketEvent {
  type: 'error'
  message: string
  code?: string
  details?: Record<string, unknown>
}

// Union of all events
export type AnyWebSocketEvent =
  | SessionStartedEvent
  | AgentStartEvent
  | AgentThinkingEvent
  | AgentOutputChunkEvent
  | AgentEndEvent
  | RoutingEvent
  | StatusEvent
  | HITLRequestEvent
  | CodeGeneratedEvent
  | CompleteEvent
  | ErrorEvent

// Agent Info
export interface AgentInfo {
  id: string
  name: string
  state: AgentState
  iteration?: number
  thinking?: string
  output?: string
  startTime?: string
  endTime?: string
  duration?: number
  tokensUsed?: number
  status?: 'success' | 'failed' | 'timeout'
}

// Execution State
export interface ExecutionState {
  status: 'idle' | 'running' | 'completed' | 'error'
  agents: Map<string, AgentInfo>
  events: AnyWebSocketEvent[]
  currentCode?: string
  codeMetadata?: {
    filename?: string
    description?: string
    language: string
  }
  totalDuration: number
  totalTokens: number
  totalIterations: number
  errorMessage?: string
}

// Theme State
export type Theme = 'light' | 'dark'

// Task Configuration
export interface TaskConfig {
  task: string
  backend: string
  model: string
  iterations: number
  temperature: number
}

// HITL Response
export interface HITLResponse {
  hitlId: string
  answer: string
  timestamp: string
}

// Routing Info
export interface RoutingInfo {
  fromAgent: string
  toAgent: string
  timestamp: string
  reason?: string
}
