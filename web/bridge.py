from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel

app = FastAPI()

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str
    backend: str
    model: str
    iterations: int = 5
    temperature: float = 0.7

@app.post("/api/execute")
async def execute_task(request: TaskRequest):
    # This endpoint is called by the frontend to initiate a session.
    # In our current architecture, the WebSocket connection itself carries the config.
    # We return success to let the frontend know it can proceed with the socket.
    return {"status": "success", "message": "Ready for websocket connection"}

# Import WebSocket routes
from web.server import router
app.include_router(router)

# Serve built frontend if exists
frontend_dist = Path("web/frontend/dist")
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

@app.get("/health")
async def health():
    return {"status": "ok"}
