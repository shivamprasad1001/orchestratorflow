'use client'

import { useEffect, useRef, useState } from 'react'
import { useOrchestratorStore } from '@/lib/store'
import { buildWSUrl, calculateReconnectionDelay } from '@/lib/ws-utils'
import { toast } from 'sonner'

interface SocketOptions {
  sessionId: string
  backendUrl: string
  autoConnect?: boolean
}

export function useOrchestratorSocket(options: SocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const store = useOrchestratorStore()
  const [reconnectCount, setReconnectCount] = useState(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    // Close existing socket if any
    if (wsRef.current) {
      wsRef.current.close()
    }

    const wsUrl = buildWSUrl(options.backendUrl, options.sessionId)
    console.log(`[Socket] Connecting to: ${wsUrl} (Attempt ${reconnectCount + 1})`)
    
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[Socket] Connected successfully')
      store.setIsConnected(true)
      store.setReconnectionAttempts(0)
      setReconnectCount(0)
      
      // Register send function in store
      store.setSendMessage((msg: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
      })
      
      // Send initial config to sync state if needed
      if (store.taskConfig.task) {
        ws.send(JSON.stringify({
          task: store.taskConfig.task,
          backend: store.taskConfig.backend,
          model: store.taskConfig.model,
          iterations: store.taskConfig.iterations,
          temperature: store.taskConfig.temperature
        }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[Socket] Received:', data.type)

        switch (data.type) {
          case 'agent_start':
            store.updateAgent(data.agent, { state: 'thinking', name: data.agent })
            store.addEvent({
              type: 'agent_start',
              agent: data.agent,
              timestamp: new Date().toISOString()
            } as any)
            break

          case 'agent_output_chunk':
            // Logic for streaming output if implemented
            break

          case 'agent_end':
            store.updateAgent(data.agent, { state: 'done' })
            store.addEvent({
              type: 'agent_end',
              agent: data.agent,
              status: data.status,
              elapsed: data.elapsed,
              timestamp: new Date().toISOString()
            } as any)
            break

          case 'code_generated':
            store.setCurrentCode(data.code)
            store.addEvent({
              type: 'code_generated',
              code: data.code,
              timestamp: new Date().toISOString()
            } as any)
            break

          case 'hitl_request':
            store.setPendingHITL(data.message)
            break

          case 'complete':
            store.setExecutionStatus('completed')
            if (data.payload) {
              const p = data.payload
              store.setExecutionMetrics(p.duration || 0, p.tokens || 0, p.iteration || 0)
            }
            toast.success('Task completed successfully')
            break

          case 'error':
            store.setExecutionStatus('error')
            store.setErrorMessage(data.message)
            toast.error(`Execution error: ${data.message}`)
            break
        }
      } catch (err) {
        console.error('[Socket] Parse error:', err)
      }
    }

    ws.onclose = (event) => {
      console.log(`[Socket] Closed: ${event.code} ${event.reason}`)
      store.setIsConnected(false)
      
      // If it wasn't a clean close, try to reconnect
      if (options.autoConnect && event.code !== 1000) {
        const delay = calculateReconnectionDelay(reconnectCount)
        store.setReconnectionAttempts(reconnectCount + 1)
        
        console.log(`[Socket] Reconnecting in ${Math.round(delay/1000)}s...`)
        
        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectCount(prev => prev + 1)
          connect()
        }, delay)
      }
    }

    ws.onerror = (err) => {
      console.error('[Socket] WebSocket Error:', err)
      // Note: onclose will handle the reconnection logic
    }
  }

  useEffect(() => {
    if (options.autoConnect) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
      }
    }
  }, [options.sessionId, options.backendUrl, options.autoConnect])

  return {
    send: (msg: any) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(msg))
      } else {
        console.warn('[Socket] Cannot send message, socket not open')
      }
    }
  }
}
