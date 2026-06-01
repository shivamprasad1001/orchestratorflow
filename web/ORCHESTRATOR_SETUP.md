# OrchestratorFlow Dashboard - Setup Guide

## Overview
OrchestratorFlow is a real-time multi-agent code generation dashboard built with Next.js, Socket.IO, and Monaco Editor. It visualizes agent interactions, execution metrics, and code generation in real-time.

## Key Features

✅ **Real-time Communication**: Socket.IO for bi-directional WebSocket communication  
✅ **Monaco Editor**: VS Code-powered code editor with syntax highlighting  
✅ **Knowledge Graph Visualization**: Interactive agent routing network using vis.js  
✅ **Execution Metrics**: Real-time metrics visualization with Chart.js  
✅ **HITL Support**: Human-in-the-loop intervention modals  
✅ **Works Offline**: Dashboard displays even when backend is disconnected  
✅ **Warm Theme**: Beautiful, custom color palette (amber/cream tones)  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  

## Technology Stack

- **Frontend Framework**: Next.js 16 with React 19
- **Real-time Communication**: Socket.IO Client 4.8
- **Code Editor**: Monaco Editor 0.55
- **Visualization**: 
  - Chart.js 4.5 for metrics visualization
  - vis.js 10 for knowledge graph rendering
- **HTTP Client**: Axios 1.15
- **Markdown Parser**: Marked 18
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4 with custom theme variables
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Steps

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## Architecture

### Directory Structure
```
components/
├── orchestrator/
│   ├── OrchestratorDashboard.tsx      # Main container
│   ├── TopBar.tsx                      # Task config & execution controls
│   ├── MonacoEditor.tsx                # Code editor integration
│   ├── CodeViewer.tsx                  # Code display with syntax highlighting
│   ├── AgentTimeline.tsx               # Real-time agent activity feed
│   ├── ExecutionDashboard.tsx          # Metrics & visualization tabs
│   ├── MetricsChart.tsx                # Bar charts for agent metrics
│   ├── KnowledgeGraph.tsx              # Interactive agent routing network
│   ├── HITLModal.tsx                   # Human intervention modal
│   ├── CompleteModal.tsx               # Execution summary modal
│   ├── ReconnectingBanner.tsx          # Connection status indicator
│   └── ThemeToggle.tsx                 # Dark/light mode toggle

lib/
├── store.ts                            # Zustand state store
├── types.ts                            # TypeScript interfaces
├── constants.ts                        # Configuration constants
├── formatting.ts                       # Utility functions
└── ws-utils.ts                         # WebSocket helpers

hooks/
├── useOrchestratorSocket.ts           # Socket.IO hook with auto-reconnect
└── useOrchestratorWS.ts               # Original WebSocket hook (deprecated)
```

### State Management (Zustand Store)

The app uses a centralized Zustand store with the following slices:

```typescript
// Theme
- isDarkMode: boolean
- setTheme(dark: boolean): void

// Connection
- isConnected: boolean
- setConnected(connected: boolean): void

// Execution State
- executionState: ExecutionState
- updateExecutionState(partial): void

// Agents
- agents: Agent[]
- addAgent(agent): void
- updateAgent(id, partial): void

// Events
- events: ExecutionEvent[]
- addEvent(event): void

// Task Config
- taskConfig: TaskConfig
- setTaskConfig(partial): void

// HITL
- pendingHITL: string | null
- setPendingHITL(id): void
- submitHITLResponse(id, response): void
```

## Backend Integration

### Socket.IO Events

The dashboard listens for these Socket.IO events from the backend:

**Connection Events:**
- `connect` - Backend connection established
- `disconnect` - Backend disconnected
- `connect_error` - Connection failed

**Execution Events:**
- `execution_started` - Execution began
- `execution_completed` - Execution finished successfully
- `execution_failed` - Execution encountered error

**Agent Events:**
- `agent_created` - New agent spawned
- `agent_thinking` - Agent processing
- `agent_routing` - Agent routing to next agent
- `agent_idle` - Agent waiting

**Code Events:**
- `code_generated` - Code generation completed
- `code_streaming` - Streaming code chunks

**HITL Events:**
- `hitl_requested` - Human intervention needed
- `hitl_resolved` - Human provided feedback

**Metrics Events:**
- `metrics_update` - Token counts, duration updated

### REST API Endpoints (via Axios)

**Start Execution:**
```
POST /api/execute
Body: {
  task: string
  backend: string
  model: string
  iterations: number
  temperature: number
}
```

### Connection Setup

The Socket.IO connection is initialized in the root page component:

```typescript
// app/page.tsx
useOrchestratorSocket({
  sessionId: 'session_xxx',
  backendUrl: 'http://localhost:8000',  // Change for production
  autoConnect: true,
})
```

**Important**: The dashboard works even if the backend is unavailable. It will:
- Show the full UI with placeholder data
- Automatically reconnect when backend becomes available
- Display connection status in the ReconnectingBanner
- Queue actions until connection is restored

## Configuration

### Backend URL
Update in `app/page.tsx`:
```typescript
backendUrl: 'http://localhost:8000'  // Change this for your backend
```

### Theme Colors
Edit `app/globals.css` to customize the warm theme:
```css
:root {
  --background: #FFF8F0;     /* Light cream */
  --primary: #FF8C42;        /* Amber/orange */
  --accent: #FF8C42;         /* Accent color */
  /* ... other variables ... */
}
```

### Constants
Edit `lib/constants.ts` to add more backends, models, or example tasks:
```typescript
export const BACKEND_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'claude', label: 'Claude' },
  // Add more...
]
```

## Usage Guide

### 1. Enter Task Description
Type your code generation task in the "Task" input field at the top.

### 2. Configure Execution
- **Backend**: Select the AI backend (OpenAI, Claude, etc.)
- **Model**: Choose the specific model version
- **Iterations**: Set max refinement iterations (1-10)
- **Temperature**: Adjust creativity (0.0 = deterministic, 1.0 = creative)

### 3. Start Execution
Click the "Execute" button to start code generation. The button is disabled if:
- A task is already running
- No task description is entered

### 4. Monitor Progress
Watch the real-time updates in three columns:

**Left Column - Agent Timeline:**
- Live agent activity feed
- Thinking indicators
- Status transitions

**Center Column - Code Viewer:**
- Generated code with syntax highlighting
- Code evolution history
- Download/copy/share buttons

**Right Column - Metrics & Graph:**
- Switch between "Metrics" (bar charts) and "Graph" (routing network)
- See token usage, duration, iterations per agent
- View how agents routed to each other

### 5. Human-in-the-Loop (HITL)
When the backend requests human feedback:
- A modal appears with the current code
- Provide corrections or feedback
- Submit to continue execution

## Performance Optimization

### Code Splitting
Components are lazy-loaded for better initial load time.

### Memoization
Use React.memo for AgentCard and CodeViewer to prevent unnecessary re-renders.

### Virtualization
The event list in ExecutionDashboard could use react-window for many events.

## Troubleshooting

### Dashboard shows white screen
- Check browser console for errors (F12)
- Ensure all dependencies are installed: `pnpm install`
- Restart dev server: `pnpm dev`

### Backend not connecting
- Verify backend is running on `http://localhost:8000`
- Check browser Network tab for Socket.IO handshake
- Dashboard still works offline - wait for backend to come online
- ReconnectingBanner shows connection status

### Monaco Editor not loading
- Ensure `monaco-editor` is installed: `pnpm add monaco-editor`
- Check for import errors in browser console
- Monaco requires specific loader configuration (auto-configured in Next.js)

### Styling issues
- Verify Tailwind CSS is compiled: check `app/globals.css`
- Ensure theme variables are defined in `:root`
- Check for CSS conflicts in browser DevTools

## Development

### Adding a New Component
1. Create file in `components/orchestrator/`
2. Use the existing warm color tokens
3. Import and integrate into parent component
4. Add to TypeScript for type safety

### Extending the Store
Edit `lib/store.ts` and add new state slices:
```typescript
const useOrchestratorStore = create((set) => ({
  newField: null,
  setNewField: (value) => set({ newField: value }),
}))
```

### Adding Socket.IO Events
Edit `hooks/useOrchestratorSocket.ts`:
```typescript
socket.on('new_event', (data) => {
  console.log('New event received:', data)
  // Update store
  addEvent({ type: 'new_event', data })
})
```

## Deployment

### Vercel
```bash
# Deploy to Vercel
vercel deploy

# Configure environment variables in Vercel dashboard
# Set NEXT_PUBLIC_BACKEND_URL for production backend
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

## License
MIT

## Support
For issues or questions, check the component source code comments or open an issue on GitHub.
