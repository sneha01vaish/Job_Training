from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from models import TrainingJob
import uuid
import asyncio
import json
import random

app = FastAPI()

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and CRA default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active jobs
jobs = {}

@app.get("/")
async def root():
    return {"message": "Calaxis Training API"}

@app.post("/api/v1/training/start")
async def start_training():
    """
    Create a new training job and return it with QUEUED status
    """
    job_id = str(uuid.uuid4())

    training_job = TrainingJob(
        job_id=job_id,
        status="QUEUED",
        progress=0.0,
        loss=0.0,
        log_message="Training job queued and ready to start"
    )

    jobs[job_id] = training_job

    return training_job.model_dump()

@app.websocket("/ws/training/{job_id}")
async def training_websocket(websocket: WebSocket, job_id: str):
    """
    WebSocket endpoint that simulates a 60-second training process
    Sends updates every 2 seconds
    """
    await websocket.accept()

    try:
        # Check if job exists
        if job_id not in jobs:
            await websocket.send_json({
                "error": "Job not found",
                "job_id": job_id
            })
            await websocket.close()
            return

        # Get the job
        job = jobs[job_id]

        # Update status to RUNNING
        job.status = "RUNNING"
        job.log_message = "Training started - initializing model..."
        await websocket.send_json(job.model_dump())

        # Simulate 60-second training (30 updates, every 2 seconds)
        total_steps = 30

        for step in range(1, total_steps + 1):
            await asyncio.sleep(2)

            # Update progress
            job.progress = step / total_steps

            # Simulate decreasing loss with some randomness
            job.loss = max(0.01, 2.5 * (1 - job.progress) + random.uniform(-0.1, 0.1))

            # Update log message based on progress
            if job.progress < 0.25:
                job.log_message = f"Epoch {step}/30 - Loading BFSI training data..."
            elif job.progress < 0.5:
                job.log_message = f"Epoch {step}/30 - Training on financial documents..."
            elif job.progress < 0.75:
                job.log_message = f"Epoch {step}/30 - Fine-tuning Module 5 parameters..."
            else:
                job.log_message = f"Epoch {step}/30 - Validating model performance..."

            # Check if completed
            if job.progress >= 1.0:
                job.status = "COMPLETED"
                job.progress = 1.0
                job.log_message = "Training completed successfully! Model ready for deployment."

            # Send update
            await websocket.send_json(job.model_dump())

    except WebSocketDisconnect:
        print(f"Client disconnected from job {job_id}")
    except Exception as e:
        print(f"Error in WebSocket: {e}")
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
