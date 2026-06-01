import { useEffect, useRef, useCallback } from 'react'
import { useOrchestratorStore } from '@/lib/store'
import { AnyWebSocketEvent } from '@/lib/types'

interface UseOrchestratorWSOptions {
  sessionId: string
  backendUrl?: string
  onEvent?: (event: AnyWebSocketEvent) => void
  autoConnect?: boolean
}

const DEFAULT_BACKEND_URL = 'ws://localhost:8000'

export function useOrchestratorWS({
  sessionId,
  backendUrl = DEFAULT_BACKEND_URL,
  onEvent,
  autoConnect = true,
}: UseOrchestratorWSOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)

  const {
    setIsConnected,
    setReconnectionAttempts,
    addEvent,
    updateAgent,
    setCurrentCode,
    setExecutionStatus,
    setErrorMessage,
    setPendingHITL,
  } = useOrchestratorStore()

  const getReconnectDelay = useCallback((attempts: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 8s
    const delay = Math.min(1000 * Math.pow(2, attempts), 8000)
    return delay
  }, [])

  const parseEvent = useCallback((data: string): AnyWebSocketEvent | null => {
    try {
      const parsed = JSON.parse(data)
      return parsed as AnyWebSocketEvent
    } catch (error) {
      console.error('[useOrchestratorWS] Failed to parse event:', error)
      return null
    }
  }, [])

  const handleEvent = useCallback(
    (event: AnyWebSocketEvent) => {
      // Add to store
      addEvent(event)

      // Handle specific event types
      switch (event.type) {
        case 'agent_start': {
          updateAgent(event.agentId, {
            id: event.agentId,
            name: event.agentName,
            state: 'running',
            startTime: event.timestamp,
            iteration: event.iteration,
          })
          setExecutionStatus('running')
          break
        }

        case 'agent_thinking': {
          updateAgent(event.agentId, {
            thinking: event.thinking,
            state: 'thinking',
          })
          break
        }

        case 'agent_output_chunk': {
          updateAgent(event.agentId, {
            output: (useOrchestratorStore.getState().executionState.agents.get(event.agentId)?.output || '') + event.chunk,
          })
          break
        }

        case 'agent_end': {
          updateAgent(event.agentId, {
            state: 'done',
            status: event.status,
            endTime: event.timestamp,
            duration: event.duration,
            tokensUsed: event.tokensUsed,
          })
          break
        }

        case 'code_generated': {
          setCurrentCode(event.code, {
            filename: event.metadata.filename,
            description: event.metadata.description,
            language: event.language,
          })
          break
        }

        case 'hitl_request': {
          setPendingHITL(event.hitlId)
          break
        }

        case 'complete': {
          setExecutionStatus(event.success ? 'completed' : 'error')
          break
        }

        case 'error': {
          setExecutionStatus('error')
          setErrorMessage(event.message)
          break
        }

        case 'session_started':
        case 'routing':
        case 'status':
          // Just store the events
          break
      }

      // Call external callback if provided
      onEvent?.(event)
    },
    [addEvent, updateAgent, setCurrentCode, setPendingHITL, setExecutionStatus, setErrorMessage, onEvent]
  )

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = `${backendUrl.replace(/^http/, 'ws')}/ws/${sessionId}`

    console.log('[useOrchestratorWS] Connecting to:', wsUrl)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log('[useOrchestratorWS] Connected')
      setIsConnected(true)
      reconnectAttemptsRef.current = 0
      setReconnectionAttempts(0)
    }

    ws.onmessage = (event) => {
      const parsedEvent = parseEvent(event.data)
      if (parsedEvent) {
        handleEvent(parsedEvent)
      }
    }

    ws.onerror = (error) => {
      console.error('[useOrchestratorWS] WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('[useOrchestratorWS] Disconnected')
      setIsConnected(false)
      wsRef.current = null

      // Attempt reconnection with exponential backoff
      reconnectAttemptsRef.current += 1
      setReconnectionAttempts(reconnectAttemptsRef.current)

      const delay = getReconnectDelay(reconnectAttemptsRef.current - 1)
      console.log(`[useOrchestratorWS] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)

      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, delay)
    }

    wsRef.current = ws
  }, [sessionId, backendUrl, setIsConnected, setReconnectionAttempts, parseEvent, handleEvent, getReconnectDelay])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const send = useCallback(
    (message: Record<string, unknown>) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message))
      } else {
        console.warn('[useOrchestratorWS] WebSocket not open, cannot send message')
      }
    },
    []
  )

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    send,
    connect,
    disconnect,
  }
}
