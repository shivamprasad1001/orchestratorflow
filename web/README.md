# OrchestratorFlow - Multi-Agent Code Generation Dashboard

> A real-time, interactive dashboard for visualizing and controlling multi-agent AI systems that generate code. Built with Next.js, Socket.IO, Monaco Editor, and advanced visualization libraries.

![Architecture](./docs/architecture.png)

## 🚀 Features

### Core Capabilities
- **Real-time Communication**: WebSocket (Socket.IO) for instant updates between frontend and backend
- **Code Editor**: VS Code-powered Monaco Editor with full syntax highlighting
- **Knowledge Graph**: Interactive visualization of agent routing and interactions using vis.js
- **Metrics Dashboard**: Real-time metrics visualization with Chart.js
- **Human-in-the-Loop**: Modal dialogs for human intervention in agent execution
- **Markdown Support**: Full markdown rendering with Marked library
- **Offline Ready**: Dashboard functions even when backend is disconnected
- **REST Integration**: Axios-based HTTP client for API calls

### UI/UX
- 🌙 Dark/Light mode with persistent theme
- 📱 Responsive design (desktop, tablet, mobile)
- 🎨 Custom warm color palette (amber/cream theme)
- ⌨️ Keyboard shortcuts (Cmd/Ctrl+Enter to execute, K to clear, D for dark mode)
- 🔄 Auto-reconnection with exponential backoff
- 📊 Live execution metrics and agent tracking

## 📋 Requirements

- Node.js 18+
- pnpm, npm, or yarn

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### 3. Configure Backend (Optional)
By default, the dashboard tries to connect to a backend at `http://localhost:8000`. If your backend is at a different location, update `app/page.tsx`:

```typescript
useOrchestratorSocket({
  sessionId,
  backendUrl: 'http://your-backend-url:port',
  autoConnect: true,
})
```

## 📚 Documentation

- **[Setup Guide](./ORCHESTRATOR_SETUP.md)** - Comprehensive setup instructions
- **[Backend Example](./BACKEND_EXAMPLE.md)** - Python/Flask backend reference implementation
- **[API Reference](./ORCHESTRATOR_SETUP.md#api-reference)** - Socket.IO and REST endpoints

## 🏗️ Project Structure

```
.
├── app/
│   ├── page.tsx              # Root page with Socket.IO initialization
│   ├── layout.tsx            # Root layout with theme provider
│   └── globals.css           # Global styles & theme variables
├── components/
│   └── orchestrator/          # Main dashboard components
│       ├── OrchestratorDashboard.tsx
│       ├── TopBar.tsx         # Task config & execution controls
│       ├── CodeViewer.tsx     # Code editor with tabs
│       ├── MonacoEditor.tsx   # Monaco Editor wrapper
│       ├── AgentTimeline.tsx  # Real-time agent activity
│       ├── ExecutionDashboard.tsx
│       ├── MetricsChart.tsx   # Bar charts for metrics
│       ├── KnowledgeGraph.tsx # Agent routing network
│       ├── HITLModal.tsx      # Human intervention modal
│       └── ...
├── hooks/
│   └── useOrchestratorSocket.ts  # Socket.IO hook
├── lib/
│   ├── store.ts              # Zustand state management
│   ├── types.ts              # TypeScript interfaces
│   ├── constants.ts          # Config constants
│   ├── formatting.ts         # Utility functions
│   └── ws-utils.ts           # WebSocket utilities
└── public/                   # Static assets
```

## 🔌 Integration

### Socket.IO Events
The dashboard listens for these events from the backend:

| Event | Payload | Description |
|-------|---------|-------------|
| `execution_started` | `{session_id, task, ...}` | Execution began |
| `agent_created` | `{id, name, role}` | New agent spawned |
| `agent_thinking` | `{agent_id, thought}` | Agent processing |
| `code_generated` | `{code, language, tokens}` | Code generated |
| `hitl_requested` | `{hitl_id, question, ...}` | Need human feedback |
| `execution_completed` | `{code, duration, tokens}` | Execution finished |
| `execution_failed` | `{error}` | Execution failed |

### REST API
Start execution via POST to `/api/execute`:
```json
{
  "task": "Create a React component",
  "backend": "openai",
  "model": "gpt-4",
  "iterations": 3,
  "temperature": 0.7
}
```

## 🎯 Usage Guide

### 1. Configure Execution
- **Task**: Describe what code you want to generate
- **Backend**: Select AI provider (OpenAI, Claude, etc.)
- **Model**: Choose specific model version
- **Iterations**: Set refinement iterations (1-10)
- **Temperature**: Adjust creativity (0.0-1.0)

### 2. Start Execution
Click the **Execute** button to begin. Watch the real-time updates:

**Left Panel**: Agent activity timeline  
**Center Panel**: Generated code with syntax highlighting  
**Right Panel**: Metrics charts and agent routing graph  

### 3. Monitor Progress
- See which agents are active
- Watch code evolve in real-time
- Track token usage and execution time
- View agent interactions via knowledge graph

### 4. Respond to Prompts
When the backend requests human feedback (HITL):
- A modal appears with current code
- Provide corrections or feedback
- Click Submit to continue

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
:root {
  --background: #FFF8F0;      /* Light background */
  --foreground: #2D1B0C;      /* Text color */
  --primary: #FF8C42;         /* Primary color */
  --accent: #FF8C42;          /* Accent color */
  /* ... more variables ... */
}
```

### Add Backends/Models
Edit `lib/constants.ts`:
```typescript
export const BACKEND_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  // Add your backends...
]
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

Set environment variable in Vercel dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
```

### Docker
```bash
docker build -t orchestrator-dashboard .
docker run -p 3000:3000 orchestrator-dashboard
```

### Self-Hosted
```bash
pnpm build
pnpm start
```

## 🔧 Development

### Tech Stack
- **Framework**: Next.js 16 + React 19
- **Real-time**: Socket.IO Client 4.8
- **Editor**: Monaco Editor 0.55
- **Visualization**: Chart.js 4.5, vis.js 10
- **State**: Zustand
- **HTTP**: Axios 1.15
- **Markdown**: Marked 18
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

### Adding Components
1. Create in `components/orchestrator/`
2. Use theme tokens (text-foreground, bg-card, etc.)
3. Import and integrate into parent
4. Add TypeScript types

### Building Production
```bash
pnpm build
pnpm start
```

## 📊 State Management

All state is managed via Zustand (`lib/store.ts`):

```typescript
// Theme
useOrchestratorStore((state) => state.isDarkMode)

// Execution
useOrchestratorStore((state) => state.executionState)

// Agents
useOrchestratorStore((state) => state.agents)

// Events
useOrchestratorStore((state) => state.events)
```

## 🐛 Troubleshooting

### White Screen
- Check browser console (F12) for errors
- Ensure dependencies installed: `pnpm install`
- Restart dev server: `pnpm dev`

### Backend Not Connecting
- Dashboard works offline - events queue locally
- Check backend is running on configured URL
- View connection status in ReconnectingBanner
- Check browser Network tab for Socket.IO handshake

### Monaco Editor Not Loading
- Verify `monaco-editor` installed: `pnpm list monaco-editor`
- Check for JS errors in console
- Monaco requires specific webpack config (auto-configured in Next.js)

### Styling Issues
- Check CSS is compiled in `app/globals.css`
- Verify theme variables in DevTools
- Ensure Tailwind is processing class names

## 📖 Additional Resources

- [Socket.IO Docs](https://socket.io/docs/)
- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Chart.js Docs](https://www.chartjs.org/)
- [vis.js Docs](https://visjs.org/)
- [Next.js Docs](https://nextjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure code follows these patterns:
- Use theme tokens for styling (not hardcoded colors)
- Add TypeScript types for all props
- Use Zustand store for state management
- Follow component organization in `components/orchestrator/`

## 📞 Support

For questions or issues:
1. Check [ORCHESTRATOR_SETUP.md](./ORCHESTRATOR_SETUP.md)
2. Review [BACKEND_EXAMPLE.md](./BACKEND_EXAMPLE.md)
3. Check browser console for errors
4. Verify backend is running and reachable

---

**Built with ❤️ for multi-agent AI systems**
