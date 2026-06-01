'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrchestratorStore } from '@/lib/store'
import { BACKEND_OPTIONS, MODEL_OPTIONS } from '@/lib/constants'
import { Play, Settings } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { toast } from 'sonner'

export function TopBar() {
  const taskConfig = useOrchestratorStore((state) => state.taskConfig)
  const setTaskConfig = useOrchestratorStore((state) => state.setTaskConfig)
  const isConnected = useOrchestratorStore((state) => state.isConnected)
  const updateExecutionState = useOrchestratorStore((state) => state.updateExecutionState)
  const [isRunning, setIsRunning] = useState(false)

  const handleTaskChange = (task: string) => {
    setTaskConfig({ task })
  }

  const handleBackendChange = (backend: string) => {
    setTaskConfig({ backend })
  }

  const handleModelChange = (model: string) => {
    setTaskConfig({ model })
  }

  const handleIterationsChange = (value: number[]) => {
    setTaskConfig({ iterations: value[0] })
  }

  const handleTemperatureChange = (value: number[]) => {
    setTaskConfig({ temperature: parseFloat((value[0] / 100).toFixed(2)) })
  }

  const handleStartExecution = async () => {
    if (!taskConfig.task.trim()) {
      toast.error('Please enter a task description')
      return
    }

    setIsRunning(true)
    updateExecutionState({ status: 'running', startTime: Date.now() })

    try {
      // Send execution request via REST API
      const response = await axios.post('http://localhost:8000/api/execute', {
        task: taskConfig.task,
        backend: taskConfig.backend,
        model: taskConfig.model,
        iterations: taskConfig.iterations,
        temperature: taskConfig.temperature,
      })

      console.log('[v0] Execution started:', response.data)
      toast.success('Execution started')
    } catch (error) {
      console.error('[v0] Execution error:', error)
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : 'Failed to start execution'
      toast.error(errorMessage)
      setIsRunning(false)
      updateExecutionState({ status: 'error', errorMessage })
    }
  }

  return (
    <div className="border-b border-border bg-card px-4 py-4 space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">OrchestratorFlow</h1>
          <p className="text-sm text-muted-foreground">Multi-agent code generation dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartExecution}
            disabled={isRunning}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Execute'}
          </Button>

          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>

          <ThemeToggle />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Task</label>
        <Input
          value={taskConfig.task}
          onChange={(e) => handleTaskChange(e.target.value)}
          placeholder="Describe your code generation task..."
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Backend</label>
          <Select value={taskConfig.backend} onValueChange={handleBackendChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BACKEND_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Model</label>
          <Select value={taskConfig.model} onValueChange={handleModelChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Iterations: {taskConfig.iterations}
          </label>
          <Slider
            value={[taskConfig.iterations]}
            onValueChange={handleIterationsChange}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Temperature: {taskConfig.temperature.toFixed(2)}
          </label>
          <Slider
            value={[Math.round(taskConfig.temperature * 100)]}
            onValueChange={handleTemperatureChange}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
