// LLM Provider options (matching the backend server expectations)
export const LLM_BACKEND_OPTIONS = [
  { label: 'Ollama (Local VPS)', value: 'ollama' },
  { label: 'Groq (Cloud)', value: 'groq' },
  { label: 'Gemini (Cloud)', value: 'gemini' },
]

// Model options for each provider
export const MODEL_OPTIONS = {
  ollama: [
    { label: 'CodeLlama 13B', value: 'codellama:13b' },
    { label: 'Mistral 7B Instruct', value: 'mistral:7b-instruct' },
    { label: 'Phi-3 Latest', value: 'phi3:latest' },
  ],
  groq: [
    { label: 'Llama 3.3 70B Versatile', value: 'llama-3.3-70b-versatile' },
    { label: 'Llama 3.1 70B Versatile', value: 'llama-3.1-70b-versatile' },
    { label: 'Llama 3.1 8B Instant', value: 'llama-3.1-8b-instant' },
    { label: 'Llama 3.2 90B Vision', value: 'llama-3.2-90b-vision-preview' },
    { label: 'Llama 3.2 11B Vision', value: 'llama-3.2-11b-vision-preview' },
    { label: 'Mixtral 8x7B', value: 'mixtral-8x7b-32768' },
  ],
  gemini: [
    { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
    { label: 'Gemini 2.0 Flash Lite', value: 'gemini-2.0-flash-lite-preview-02-05' },
    { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
    { label: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
  ],
}

// API Backend options (for the dashboard connection itself)
export const API_BACKEND_URLS = [
  { label: 'Local Dev (8000)', value: 'http://localhost:8000' },
]

// Default task configuration
export const DEFAULT_TASK_CONFIG = {
  task: '',
  backend: 'ollama', // Default to local Ollama
  model: 'codellama:13b', // Primary model as requested
  iterations: 3,
  temperature: 0.2, // Lower temperature for coding
}

// Agent types (commonly seen in multi-agent systems)
export const AGENT_TYPES = {
  planner: { label: 'Planner', color: '#FF8C42', icon: '📋' },
  coder: { label: 'Coder', color: '#00BCD4', icon: '👨‍💻' },
  reviewer: { label: 'Reviewer', color: '#4CAF50', icon: '👀' },
  tester: { label: 'Tester', color: '#FFC107', icon: '✓' },
  optimizer: { label: 'Optimizer', color: '#9C27B0', icon: '⚡' },
}

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  startExecution: { keys: ['Cmd/Ctrl', 'Enter'], description: 'Start execution' },
  clearLog: { keys: ['Cmd/Ctrl', 'K'], description: 'Clear log' },
  toggleDarkMode: { keys: ['Cmd/Ctrl', 'D'], description: 'Toggle dark mode' },
}

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
}
