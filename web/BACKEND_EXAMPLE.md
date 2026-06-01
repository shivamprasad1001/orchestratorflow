# Backend Integration Example

This document provides a reference implementation for a Python backend that works with OrchestratorFlow.

## Required Socket.IO Server Setup

The backend should be a Socket.IO server running on `http://localhost:8000` that emits events to the dashboard.

### Python Example (Flask + python-socketio)

```python
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
import asyncio
import uuid
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'orchestrator-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Store active sessions
active_sessions = {}

class ExecutionSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.agents = []
        self.events = []
        self.start_time = datetime.now()
        self.total_tokens = 0
        self.total_iterations = 0
        
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'agents': self.agents,
            'total_tokens': self.total_tokens,
            'total_iterations': self.total_iterations,
        }

# ============================================================
# REST API Endpoints
# ============================================================

@app.route('/api/execute', methods=['POST'])
def execute():
    """Start a new code generation execution"""
    data = request.json
    session_id = request.args.get('sessionId', str(uuid.uuid4()))
    
    task = data.get('task', '')
    backend = data.get('backend', 'openai')
    model = data.get('model', 'gpt-4')
    iterations = data.get('iterations', 3)
    temperature = data.get('temperature', 0.7)
    
    if not task:
        return jsonify({'error': 'Task description required'}), 400
    
    # Create execution session
    session = ExecutionSession(session_id)
    active_sessions[session_id] = session
    
    # Emit start event via Socket.IO
    socketio.emit('execution_started', {
        'session_id': session_id,
        'task': task,
        'backend': backend,
        'model': model,
        'iterations': iterations,
        'timestamp': datetime.now().isoformat(),
    }, room=session_id)
    
    # Simulate async execution (in real implementation, this would be async)
    # You would typically queue this to a task queue like Celery
    socketio.start_background_task(run_execution, session_id, data)
    
    return jsonify({
        'success': True,
        'session_id': session_id,
        'message': 'Execution started'
    }), 202

@app.route('/api/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get execution session status"""
    session = active_sessions.get(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    
    return jsonify(session.to_dict()), 200

# ============================================================
# Socket.IO Event Handlers
# ============================================================

@socketio.on('connect')
def handle_connect(auth):
    """Client connected"""
    session_id = request.args.get('sessionId')
    if session_id:
        join_room(session_id)
        print(f'[Socket.IO] Client connected: {session_id}')
        emit('connection_established', {
            'message': 'Connected to backend',
            'timestamp': datetime.now().isoformat(),
        })

@socketio.on('disconnect')
def handle_disconnect():
    """Client disconnected"""
    print('[Socket.IO] Client disconnected')

@socketio.on('hitl_response')
def handle_hitl_response(data):
    """Handle human-in-the-loop response"""
    session_id = request.sid
    response = data.get('response')
    hitl_id = data.get('hitl_id')
    
    print(f'[HITL] Received response for {hitl_id}: {response}')
    
    # Process the response and continue execution
    emit('hitl_resolved', {
        'hitl_id': hitl_id,
        'response': response,
        'timestamp': datetime.now().isoformat(),
    })

# ============================================================
# Example Execution Function
# ============================================================

def run_execution(session_id, config):
    """
    Example execution function (runs in background)
    In real implementation, this would use your AI orchestration logic
    """
    session = active_sessions.get(session_id)
    if not session:
        return
    
    task = config.get('task')
    iterations = config.get('iterations', 3)
    
    try:
        # Emit agent creation
        agent_id_1 = str(uuid.uuid4())
        socketio.emit('agent_created', {
            'id': agent_id_1,
            'name': 'Code Generator',
            'role': 'code_generation',
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)
        
        # Emit agent thinking
        socketio.emit('agent_thinking', {
            'agent_id': agent_id_1,
            'thought': f'Analyzing task: {task[:50]}...',
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)
        
        # Simulate thinking time
        socketio.sleep(1)
        
        # Generate code
        generated_code = f"""
# Generated code for: {task}
def main():
    # Your implementation here
    pass

if __name__ == '__main__':
    main()
"""
        
        socketio.emit('code_generated', {
            'code': generated_code,
            'language': 'python',
            'tokens': 150,
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)
        
        # Optionally request human feedback (HITL)
        if iterations > 1:
            socketio.emit('hitl_requested', {
                'hitl_id': str(uuid.uuid4()),
                'current_code': generated_code,
                'question': 'Does this implementation meet your requirements?',
                'options': ['approve', 'revise', 'reject'],
                'timestamp': datetime.now().isoformat(),
            }, room=session_id)
            
            # Wait for HITL response (with timeout)
            # In real implementation, use proper async/await
            socketio.sleep(5)
        
        # Emit metrics
        socketio.emit('metrics_update', {
            'tokens': 150,
            'duration': 2500,
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)
        
        # Emit completion
        socketio.emit('execution_completed', {
            'code': generated_code,
            'language': 'python',
            'duration': 2500,
            'tokens': 150,
            'iterations': 1,
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)
        
    except Exception as e:
        socketio.emit('execution_failed', {
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
        }, room=session_id)

# ============================================================
# Run Server
# ============================================================

if __name__ == '__main__':
    print('[Server] Starting OrchestratorFlow backend on http://localhost:8000')
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
```

## Socket.IO Events Reference

### Server → Client (Frontend receives)

| Event | Data | Description |
|-------|------|-------------|
| `execution_started` | `{session_id, task, backend, model, iterations, timestamp}` | Execution began |
| `agent_created` | `{id, name, role, timestamp}` | New agent spawned |
| `agent_thinking` | `{agent_id, thought, timestamp}` | Agent processing |
| `agent_routing` | `{from, to, reason, timestamp}` | Agent routing to next agent |
| `code_generated` | `{code, language, tokens, timestamp}` | Code generation complete |
| `code_streaming` | `{chunk, timestamp}` | Streaming code chunk |
| `hitl_requested` | `{hitl_id, current_code, question, options, timestamp}` | Need human feedback |
| `hitl_resolved` | `{hitl_id, response, timestamp}` | Human provided feedback |
| `metrics_update` | `{tokens, duration, timestamp}` | Metrics updated |
| `execution_completed` | `{code, language, duration, tokens, iterations, timestamp}` | Execution succeeded |
| `execution_failed` | `{error, timestamp}` | Execution failed |

### Client → Server (Frontend sends)

| Event | Data | Description |
|-------|------|-------------|
| `connect` | `{sessionId}` (query param) | Client connected |
| `disconnect` | - | Client disconnected |
| `hitl_response` | `{hitl_id, response}` | Human feedback response |

## REST API Reference

### POST /api/execute
Start a new execution.

**Request:**
```json
{
  "task": "Create a React component for a todo list",
  "backend": "openai",
  "model": "gpt-4",
  "iterations": 3,
  "temperature": 0.7
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "session_id": "session_xxx",
  "message": "Execution started"
}
```

### GET /api/session/<session_id>
Get session status.

**Response:**
```json
{
  "session_id": "session_xxx",
  "agents": [...],
  "total_tokens": 1500,
  "total_iterations": 2
}
```

## Integration Checklist

- [ ] Backend running on `http://localhost:8000`
- [ ] Socket.IO server configured with CORS
- [ ] All required events emitted in correct sequence
- [ ] Session management (unique session IDs)
- [ ] Error handling (emit `execution_failed` on errors)
- [ ] HITL modal working (emit `hitl_requested`, handle `hitl_response`)
- [ ] Metrics tracking (emit `metrics_update` regularly)
- [ ] Code streaming support (optional: emit `code_streaming` chunks)
- [ ] Agent routing events (emit `agent_routing` when agents hand off)
- [ ] Graceful disconnection handling

## Testing with Frontend

1. **Start Backend:**
   ```bash
   python backend.py
   ```

2. **Start Frontend:**
   ```bash
   cd /vercel/share/v0-project
   pnpm dev
   ```

3. **Open Dashboard:**
   ```
   http://localhost:3000
   ```

4. **Test Execution:**
   - Enter task: "Create a hello world function"
   - Click Execute
   - Watch Socket.IO events stream in real-time

## Notes

- Frontend works even if backend is unavailable
- Session IDs persist across reconnections
- All timestamps should be ISO 8601 format
- Token counts are suggestions (track what makes sense for your backend)
- Implement proper async/await in production (not using socketio.sleep)
