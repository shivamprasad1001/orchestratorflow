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
import { LLM_BACKEND_OPTIONS, MODEL_OPTIONS } from '@/lib/constants'
import { Play, Settings, Cpu, Layers, Thermometer, Terminal, Box, History, Sparkles } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { toast } from 'sonner'

export function SideBar() {
  const taskConfig = useOrchestratorStore((state) => state.taskConfig)
  const setTaskConfig = useOrchestratorStore((state) => state.setTaskConfig)
  const isConnected = useOrchestratorStore((state) => state.isConnected)
  const setExecutionStatus = useOrchestratorStore((state) => state.setExecutionStatus)
  const setErrorMessage = useOrchestratorStore((state) => state.setErrorMessage)
  const resetExecution = useOrchestratorStore((state) => state.resetExecution)
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
    resetExecution()
    setExecutionStatus('running')

    try {
      const response = await axios.post('http://localhost:8000/api/execute', {
        task: taskConfig.task,
        backend: taskConfig.backend,
        model: taskConfig.model,
        iterations: taskConfig.iterations,
        temperature: taskConfig.temperature,
      })
      
      // Trigger execution via WebSocket
      useOrchestratorStore.getState().sendMessage({
        task: taskConfig.task,
        backend: taskConfig.backend,
        model: taskConfig.model,
        iterations: taskConfig.iterations,
        temperature: taskConfig.temperature,
      })

      toast.success('Execution started')
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : 'Failed to start execution'
      toast.error(errorMessage)
      setIsRunning(false)
      setExecutionStatus('error')
      setErrorMessage(errorMessage)
    }
  }

  return (
    <div className="w-64 h-screen bg-[#0d1117] border-r border-[#30363d] flex flex-col p-4 space-y-6 overflow-y-auto scrollbar-none shadow-2xl z-50">
      {/* Brand & Status */}
      <div className="flex flex-col gap-3 px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent" />
            ORCHESTRATOR
          </h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
            <span className={`text-[9px] font-black tracking-tighter uppercase ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-70">
          Agentic Flow v1.0
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Task Config */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Box className="w-3.5 h-3.5" />
              Project Task
            </label>
            <button 
              onClick={() => handleTaskChange('Create a FastAPI backend with a SQLite database for a book management system. Include CRUD endpoints.')}
              className="text-[9px] font-bold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors uppercase tracking-tighter"
            >
              <Sparkles className="w-3 h-3" />
              Example
            </button>
          </div>
          <textarea
            value={taskConfig.task}
            onChange={(e) => handleTaskChange(e.target.value)}
            placeholder="Build a CLI todo app with persistence..."
            className="w-full h-32 bg-black/40 border border-[#30363d] rounded-md p-3 text-xs text-[#c9d1d9] focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Engine
            </label>
            <Select value={taskConfig.backend} onValueChange={handleBackendChange}>
              <SelectTrigger className="h-9 bg-[#161b22] border-[#30363d] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-[#30363d]">
                {LLM_BACKEND_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              Model
            </label>
            <Select value={taskConfig.model} onValueChange={handleModelChange}>
              <SelectTrigger className="h-9 bg-[#161b22] border-[#30363d] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-[#30363d]">
                {(MODEL_OPTIONS[taskConfig.backend as keyof typeof MODEL_OPTIONS] || []).map((option: any) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <History className="w-3.5 h-3.5" />
                Iterations
              </label>
              <span className="text-[10px] font-mono text-accent">{taskConfig.iterations}</span>
            </div>
            <Slider
              value={[taskConfig.iterations]}
              onValueChange={handleIterationsChange}
              min={1}
              max={10}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <Thermometer className="w-3.5 h-3.5" />
                Creativity
              </label>
              <span className="text-[10px] font-mono text-accent">{taskConfig.temperature.toFixed(2)}</span>
            </div>
            <Slider
              value={[Math.round(taskConfig.temperature * 100)]}
              onValueChange={handleTemperatureChange}
              min={0}
              max={100}
              step={1}
              className="py-2"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-3 pt-6 border-t border-[#30363d]/50">
        <Button
          onClick={handleStartExecution}
          disabled={isRunning}
          className="w-full bg-accent hover:bg-accent/80 text-white font-bold uppercase tracking-widest text-[11px] h-11 shadow-[0_0_20px_rgba(255,140,66,0.1)] group transition-all"
        >
          {isRunning ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              RUNNING
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
              EXECUTE FLOW
            </div>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-9 bg-[#161b22] border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] text-[10px] font-bold uppercase">
            <Settings className="w-3.5 h-3.5 mr-2" />
            Config
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
