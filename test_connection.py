import asyncio
import websockets
import json

async def test():
    uri = "ws://localhost:8000/ws/test123"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({
            "task": "write hello world",
            "backend": "groq",
            "model": "llama-3.3-70b"
        }))
        async for msg in ws:
            data = json.loads(msg)
            if data['type'] == 'agent_output_chunk':
                print(data['chunk'], end='', flush=True)
            elif data['type'] == 'agent_start':
                print(f"\n[START] {data.get('agent')}")
            elif data['type'] == 'agent_end':
                print(f"\n[END] {data.get('agent')} ({data.get('status')})")
            else:
                print(f"\nEvent: {data['type']}")
            if data['type'] == 'complete':
                break

if __name__ == "__main__":
    asyncio.run(test())
