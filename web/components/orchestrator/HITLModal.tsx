'use client'

import { useState } from 'react'
import { useOrchestratorStore } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface HITLModalProps {
  hitlId: string
}

export function HITLModal({ hitlId }: HITLModalProps) {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setPendingHITL = useOrchestratorStore((state) => state.setPendingHITL)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Send HITL response to backend
    // await send({ type: 'hitl_response', hitlId, answer })
    setIsSubmitting(false)
    setPendingHITL(null)
    setAnswer('')
  }

  const handleCancel = () => {
    setPendingHITL(null)
    setAnswer('')
  }

  return (
    <Dialog open={!!hitlId} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Human-in-the-Loop Intervention</DialogTitle>
          <DialogDescription>
            The AI agent needs your input to proceed. Please provide your response below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-2">Agent Question</p>
            <p className="text-sm text-muted-foreground bg-muted rounded p-2">
              An agent is requesting human input to continue execution.
            </p>
          </div>

          <div>
            <label htmlFor="answer" className="text-sm font-medium block mb-2">
              Your Response
            </label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your response here..."
              className="min-h-32"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className="bg-accent hover:bg-accent/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
