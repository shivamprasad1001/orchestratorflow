'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Download, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useOrchestratorStore } from '@/lib/store'
import { formatDuration, formatTokens } from '@/lib/formatting'

interface CompleteModalProps {
  success: boolean
  finalCode?: string
  errorMessage?: string
  metrics: {
    duration: number
    tokens: number
    iterations: number
  }
}

export function CompleteModal({
  success,
  finalCode,
  errorMessage,
  metrics,
}: CompleteModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const setExecutionStatus = useOrchestratorStore((state) => state.setExecutionStatus)

  useEffect(() => {
    if (success && finalCode) {
      console.log('[CompleteModal] Execution completed successfully')
    }
  }, [success, finalCode])

  const handleDownloadCode = () => {
    if (finalCode) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(finalCode))
      element.setAttribute('download', 'generated_code.js')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      toast.success('Code downloaded')
    }
  }

  const handleCopyCode = () => {
    if (finalCode) {
      navigator.clipboard.writeText(finalCode)
      toast.success('Code copied to clipboard')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // We set status to idle to close the modal, but DON'T reset execution
    // so the user can still see the graph, logs, and code.
    setExecutionStatus('idle')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) setExecutionStatus('idle')
    }}>
      <DialogContent className="sm:max-w-[600px] bg-[#0d1117] border-[#30363d] text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 text-white">
            {success ? (
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-500" />
            )}
            <div>
              <DialogTitle className="text-xl font-bold">{success ? 'Flow Completed!' : 'Flow Failed'}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {success
                  ? 'Your agentic orchestration has finished successfully.'
                  : 'An error occurred during the orchestration flow.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Duration</p>
              <p className="text-lg font-mono text-accent">{formatDuration(metrics.duration)}</p>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tokens</p>
              <p className="text-lg font-mono text-accent">{formatTokens(metrics.tokens)}</p>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Steps</p>
              <p className="text-lg font-mono text-accent">{metrics.iterations}</p>
            </div>
          </div>

          {/* Error Message */}
          {!success && errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
              <p className="text-sm text-red-200">{errorMessage}</p>
            </div>
          )}

          {/* Code Preview */}
          {success && finalCode && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Generated Output</p>
              <div className="bg-black/40 border border-[#30363d] rounded p-3 max-h-40 overflow-y-auto scrollbar-thin">
                <pre className="text-xs font-mono text-[#c9d1d9] whitespace-pre-wrap break-words">
                  {finalCode.slice(0, 500)}
                  {finalCode.length > 500 && '...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="bg-transparent border-[#30363d] hover:bg-[#30363d]">
            Keep Viewing
          </Button>
          {success && finalCode && (
            <>
              <Button variant="outline" onClick={handleCopyCode} className="bg-transparent border-[#30363d] hover:bg-[#30363d]">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleDownloadCode} className="bg-accent hover:bg-accent/90 text-white font-bold uppercase text-[10px] tracking-widest">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
