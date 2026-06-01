'use client'

import { useState } from 'react'
import { useOrchestratorStore } from '@/lib/store'
import dynamic from 'next/dynamic'
import { 
  FileCode, 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  File, 
  Download,
  Terminal,
  Box,
  Code
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MonacoEditor = dynamic(() => import('./MonacoEditor').then((m) => m.MonacoEditor), {
  ssr: false,
})

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

export function CodeViewer() {
  const executionState = useOrchestratorStore((state) => state.executionState)
  const [selectedFile, setSelectedFile] = useState('main.py')

  // Mock folder structure
  const explorerData: FileNode[] = [
    {
      name: 'output',
      type: 'folder',
      children: [
        {
          name: 'tests',
          type: 'folder',
          children: [
            { name: 'test_cli.py', type: 'file' },
            { name: 'test_greeting.py', type: 'file' },
            { name: 'test_service.py', type: 'file' },
          ]
        },
        {
          name: 'todo_cli',
          type: 'folder',
          children: [
            { name: 'cli.py', type: 'file' },
            { name: 'models.py', type: 'file' },
            { name: 'service.py', type: 'file' },
          ]
        },
        { name: 'README.md', type: 'file' },
        { name: 'pyproject.toml', type: 'file' },
      ]
    }
  ]

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden border border-[#30363d] rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] h-10">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2 py-0.5 bg-[#30363d]/50 rounded text-[10px] text-muted-foreground font-mono">
            <FileCode className="w-3 h-3" />
            {selectedFile}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-[10px] font-bold transition-colors">
            <Download className="w-3 h-3" />
            <span>DOWNLOAD</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Explorer Sidebar */}
        <div className="w-48 bg-[#0d1117] border-r border-[#30363d] flex flex-col hidden sm:flex">
          <div className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center justify-between border-b border-[#30363d]/50">
            <span>Explorer</span>
            <Box className="w-3 h-3" />
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-1 text-xs scrollbar-thin">
            <ExplorerTree nodes={explorerData} />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative bg-[#0d1117]">
          <MonacoEditor
            value={executionState.currentCode || ''}
            language="python"
            theme="dark"
            readOnly={executionState.status === 'running'}
          />
        </div>
      </div>
    </div>
  )
}

function ExplorerTree({ nodes, depth = 0 }: { nodes: FileNode[], depth?: number }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ output: true, tests: true, todo_cli: true })

  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <div key={node.name}>
          <div 
            className="flex items-center py-1 px-2 hover:bg-[#1f242c] rounded cursor-pointer group transition-colors select-none"
            style={{ paddingLeft: `${depth * 10 + 4}px` }}
            onClick={() => node.type === 'folder' && setExpanded(p => ({...p, [node.name]: !p[node.name]}))}
          >
            {node.type === 'folder' ? (
              <>
                {expanded[node.name] ? (
                  <ChevronDown className="w-3 h-3 mr-1 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 mr-1 text-muted-foreground" />
                )}
                <Folder className={`w-3.5 h-3.5 mr-2 ${expanded[node.name] ? 'text-accent/80' : 'text-muted-foreground'}`} />
              </>
            ) : (
              <File className="w-3.5 h-3.5 mr-2 ml-4 text-[#8b949e]" />
            )}
            <span className={`truncate ${node.type === 'folder' ? 'text-[#c9d1d9] font-semibold' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'}`}>
              {node.name}
            </span>
          </div>
          {node.type === 'folder' && expanded[node.name] && node.children && (
            <ExplorerTree nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  )
}
