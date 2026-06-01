/**
 * Format duration in milliseconds to HH:MM:SS format
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Format token count with k suffix for thousands
 */
export function formatTokens(tokens: number): string {
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}k`
  }
  return tokens.toString()
}

/**
 * Format timestamp to readable format
 */
export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return timestamp
  }
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Format code for display (trim and detect language)
 */
export function formatCode(code: string): string {
  return code.trim()
}

/**
 * Detect programming language from code
 */
export function detectLanguage(code: string): string {
  const lines = code.split('\n').slice(0, 5)

  for (const line of lines) {
    if (line.includes('import React') || line.includes('from "react"')) {
      return 'jsx'
    }
    if (line.includes('import ') || line.includes('export ')) {
      return 'javascript'
    }
    if (line.includes('def ')) {
      return 'python'
    }
    if (line.includes('<') && line.includes('>')) {
      return 'html'
    }
  }

  if (code.includes('{') && code.includes('}')) {
    return 'javascript'
  }

  return 'text'
}

/**
 * Format agent name for display
 */
export function formatAgentName(name: string): string {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get color for agent status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800'
    case 'failed':
      return 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800'
    case 'timeout':
      return 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800'
    case 'running':
      return 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800'
    default:
      return 'bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800'
  }
}

/**
 * Get icon for agent status
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case 'success':
      return '✓'
    case 'failed':
      return '✕'
    case 'timeout':
      return '⏱'
    case 'running':
      return '⟳'
    default:
      return '○'
  }
}
