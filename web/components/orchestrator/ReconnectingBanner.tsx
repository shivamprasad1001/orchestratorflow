'use client'

import { useOrchestratorStore } from '@/lib/store'
import { AlertCircle } from 'lucide-react'

export function ReconnectingBanner() {
  const reconnectionAttempts = useOrchestratorStore((state) => state.reconnectionAttempts)

  return (
    <div className="absolute top-0 left-0 z-[100] bg-yellow-500/10 backdrop-blur-md border-b border-yellow-500/30 px-4 py-2 flex items-center justify-center gap-3 text-sm shadow-lg animate-in fade-in slide-in-from-top duration-300">
      <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
      <span className="text-yellow-200 font-medium">
        Connection lost. Reconnecting{reconnectionAttempts > 0 && ` (Attempt ${reconnectionAttempts})`}...
      </span>
    </div>
  )
}
