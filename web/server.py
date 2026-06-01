from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws/{session_id}")
async def websocket_handler(websocket: WebSocket, session_id: str):
    await websocket.accept()
    logger.info(f"[Socket] Session {session_id} connected")
    
    hitl_queue = asyncio.Queue()
    orchestrator_task = None
    receiver_task = None
    
    try:
        # Wait for initial configuration and start command
        # This keeps the socket open without starting execution immediately if desired
        # But for now, we'll follow the current pattern where the first message is the config
        raw_data = await websocket.receive_text()
        config = json.loads(raw_data)
        
        # If task is empty, just wait for next message (or keep alive)
        if not config.get("task"):
            logger.info(f"[Socket] Session {session_id} connected but no task provided. Waiting...")
            # You could add a loop here to wait for a proper 'start' command
        
        async def receive_messages():
            try:
                while True:
                    msg_text = await websocket.receive_text()
                    msg = json.loads(msg_text)
                    if msg.get("type") == "hitl_response":
                        await hitl_queue.put(msg.get("response"))
                    elif msg.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
            except Exception as e:
                logger.error(f"[Socket] Receiver error: {e}")
        
        receiver_task = asyncio.create_task(receive_messages())
        
        async def send_event(event: dict):
            try:
                if event["type"] == "hitl_request":
                    await websocket.send_json(event)
                    # Wait for response from the queue populated by receive_messages
                    response = await hitl_queue.get()
                    event["response"] = response
                else:
                    await websocket.send_json(event)
            except Exception as e:
                logger.error(f"[Socket] Send error: {e}")
        
        # Only start if we have a task
        if config.get("task"):
            from orchestrator import OrchestratorFlow
            from config import Config
            
            orch_config = Config()
            
            # Apply frontend overrides
            if "backend" in config:
                orch_config.llm_provider = config["backend"]
            if "model" in config:
                if orch_config.llm_provider == "groq":
                    orch_config.groq_model = config["model"]
                elif orch_config.llm_provider == "gemini":
                    orch_config.gemini_model = config["model"]
                elif orch_config.llm_provider == "ollama":
                    orch_config.ollama_model = config["model"]
            
            orch = OrchestratorFlow(orch_config)
            
            logger.info(f"[Socket] Starting orchestrator for task: {config.get('task')}")
            orchestrator_task = asyncio.create_task(
                orch.run_async(
                    user_task=config.get("task"),
                    language=config.get("language", "python"),
                    event_callback=send_event
                )
            )
            
            # Wait for either the orchestrator to finish or the receiver to fail (socket close)
            done, pending = await asyncio.wait(
                [orchestrator_task, receiver_task],
                return_when=asyncio.FIRST_COMPLETED
            )
            
            if orchestrator_task in done:
                try:
                    result = orchestrator_task.result()
                    # Convert Pydantic model to dict for JSON serialization
                    payload = result.model_dump() if hasattr(result, 'model_dump') else result.dict()
                    await websocket.send_json({"type": "complete", "payload": payload})
                    logger.info(f"[Socket] Task completed for session {session_id}")
                except Exception as e:
                    logger.error(f"[Socket] Orchestrator error: {e}")
                    import traceback
                    traceback.print_exc()
                    await websocket.send_json({"type": "error", "message": str(e)})
            
        else:
            # If no task, just stay alive until socket closes
            await receiver_task

    except WebSocketDisconnect:
        logger.info(f"[Socket] Session {session_id} disconnected")
    except Exception as e:
        logger.error(f"[Socket] Global error in handler: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if orchestrator_task and not orchestrator_task.done():
            orchestrator_task.cancel()
        if receiver_task and not receiver_task.done():
            receiver_task.cancel()
        try:
            await websocket.close()
        except:
            pass
