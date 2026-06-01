'use client'

import { useState, useEffect } from 'react'
import { OrchestratorDashboard } from '@/components/orchestrator/OrchestratorDashboard'
import { useOrchestratorSocket } from '@/hooks/useOrchestratorSocket'

export default function Home() {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('orchestrator_session_id')
      if (stored) return stored
      const generated = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem('orchestrator_session_id', generated)
      return generated
    }
    return `session_${Date.now()}`
  })

  const [isClient, setIsClient] = useState(false)

  // Initialize Socket.IO connection (dashboard shows even if not connected)
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const port = urlParams.get('backendPort') || '8000'
      const host = window.location.hostname || 'localhost'
      setBackendUrl(`http://${host}:${port}`)
    }
  }, [])

  useOrchestratorSocket({
    sessionId,
    backendUrl,
    autoConnect: true,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="w-full h-screen bg-background text-foreground">
      <OrchestratorDashboard sessionId={sessionId} />
    </div>
  )
}
