'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { useOrchestratorStore } from '@/lib/store'

ChartJS.register(...registerables)

interface MetricsChartProps {
  type?: 'tokens' | 'duration' | 'iterations'
}

export function MetricsChart({ type = 'tokens' }: MetricsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<ChartJS | null>(null)
  const executionState = useOrchestratorStore((state) => state.executionState)
  const agentsMap = executionState.agents
  const agents = Array.from(agentsMap.values())

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const agentNames = agents.map((a) => a.name)
    let data: number[] = []
    let label = ''
    let backgroundColor = 'rgba(255, 140, 66, 0.6)'

    if (type === 'tokens') {
      data = agents.map((a) => a.tokens || 0)
      label = 'Tokens Used'
    } else if (type === 'duration') {
      data = agents.map((a) => a.duration || 0)
      label = 'Duration (ms)'
      backgroundColor = 'rgba(255, 179, 102, 0.6)'
    } else if (type === 'iterations') {
      data = agents.map((a) => a.iterations || 0)
      label = 'Iterations'
      backgroundColor = 'rgba(232, 212, 192, 0.6)'
    }

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: agentNames.length > 0 ? agentNames : ['No agents yet'],
        datasets: [
          {
            label,
            data: data.length > 0 ? data : [0],
            backgroundColor,
            borderColor: 'rgba(255, 140, 66, 1)',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgb(45, 27, 12)',
              font: { size: 12 },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgb(107, 83, 68)' },
            grid: { color: 'rgba(232, 212, 192, 0.3)' },
          },
          y: {
            ticks: { color: 'rgb(107, 83, 68)' },
            grid: { color: 'rgba(232, 212, 192, 0.3)' },
          },
        },
      },
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [agentsMap, type])

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-semibold text-foreground px-4 py-2 border-b border-border">
        {type === 'tokens' ? 'Token Usage' : type === 'duration' ? 'Execution Time' : 'Iterations'}
      </h3>
      <div className="flex-1 relative p-4">
        <canvas
          ref={chartRef}
          className="max-h-[200px]"
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  )
}
