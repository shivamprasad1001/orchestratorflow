'use client'

import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'

// Configure Monaco Environment to use CDN for workers
if (typeof window !== 'undefined') {
  const MONACO_VERSION = '0.55.1';
  const CDN_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/esm/vs`;
  
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      if (label === 'json') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${CDN_BASE}/language/json/json.worker.js');`)}`;
      if (label === 'css' || label === 'scss' || label === 'less') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${CDN_BASE}/language/css/css.worker.js');`)}`;
      if (label === 'html' || label === 'handlebars' || label === 'razor') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${CDN_BASE}/language/html/html.worker.js');`)}`;
      if (label === 'typescript' || label === 'javascript') return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${CDN_BASE}/language/typescript/ts.worker.js');`)}`;
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`importScripts('${CDN_BASE}/editor/editor.worker.js');`)}`;
    }
  };
}

interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  theme?: 'light' | 'dark'
}

export function MonacoEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  theme = 'light',
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language,
      readOnly,
      theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
      automaticLayout: true,
      minimap: { enabled: !readOnly },
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      insertSpaces: true,
    })

    // Handle changes
    if (!readOnly) {
      editorRef.current.onDidChangeModelContent(() => {
        const newValue = editorRef.current?.getValue() || ''
        onChange?.(newValue)
      })
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [language, readOnly, theme])

  // Update value when prop changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value)
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-card rounded-lg overflow-hidden border border-border"
      style={{ minHeight: '400px' }}
    />
  )
}
