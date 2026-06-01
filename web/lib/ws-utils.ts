/**
 * Build WebSocket URL from backend base URL and session ID
 */
export function buildWSUrl(backendUrl: string, sessionId: string): string {
  const baseUrl = backendUrl.replace(/^http/, 'ws').replace(/\/$/, '')
  return `${baseUrl}/ws/${sessionId}`
}

/**
 * Format WebSocket message payload
 */
export function formatWSMessage(type: string, data: Record<string, unknown>) {
  return {
    type,
    timestamp: new Date().toISOString(),
    ...data,
  }
}

/**
 * Parse WebSocket message and validate structure
 */
export function parseWSMessage(data: string) {
  try {
    const message = JSON.parse(data)
    if (!message.type) {
      throw new Error('Message must have a type field')
    }
    return message
  } catch (error) {
    console.error('[ws-utils] Failed to parse message:', error)
    return null
  }
}

/**
 * Calculate reconnection delay with exponential backoff
 */
export function calculateReconnectionDelay(attemptNumber: number): number {
  // 1s, 2s, 4s, 8s, max 8s
  const delay = Math.min(1000 * Math.pow(2, attemptNumber), 8000)
  // Add small jitter to prevent thundering herd
  const jitter = Math.random() * 100
  return delay + jitter
}

/**
 * Check if WebSocket should be open
 */
export function isWebSocketOpen(ws: WebSocket | null): boolean {
  return ws !== null && ws.readyState === WebSocket.OPEN
}
