# Job_Training
A real-time training job monitoring system built with FastAPI (Python) and React (TypeScript). This application simulates a 60-second BFSI model training process with live progress updates via WebSocket.


## Project Structure

```
project/
├── backend/              # FastAPI application
│   ├── main.py          # Main FastAPI app with REST and WebSocket endpoints
│   ├── models.py        # Pydantic models
│   └── requirements.txt # Python dependencies
├── frontend/            # React + TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── TrainingDashboard.tsx
│   │   │   └── TrainingDashboard.css
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── types.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md            # This file
```

## Features

### Backend (FastAPI)
- **REST API Endpoint**: `POST /api/v1/training/start` - Creates and queues a new training job
- **WebSocket Endpoint**: `/ws/training/{job_id}` - Streams live training updates every 2 seconds
- **Pydantic Models**: Type-safe data validation for TrainingJob
- **CORS Support**: Configured for local development

### Frontend (React + TypeScript)
- **Real-time Dashboard**: Displays live training progress, loss metrics, and logs
- **WebSocket Integration**: Automatically connects and receives updates
- **Responsive UI**: Clean, modern interface with smooth animations
- **Type Safety**: Full TypeScript implementation

## Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8+** (for backend)
- **Node.js 16+** and **npm** (for frontend)

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

## Running the Application

You need to run both the backend and frontend simultaneously in separate terminal windows.

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the backend directory:
```bash
cd backend
```

2. Activate the virtual environment (if created):
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Run the FastAPI server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at: **http://localhost:8000**

You can verify it's running by visiting: http://localhost:8000 (you should see `{"message": "Calaxis Training API"}`)

### Step 2: Start the Frontend Development Server

1. Open a **new terminal** and navigate to the frontend directory:
```bash
cd frontend
```

2. Run the development server:
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

### Step 3: Use the Application

1. Open your browser and navigate to **http://localhost:5173**
2. Click the **"Start BFSI Training Job (Module 5)"** button
3. Watch the real-time dashboard update with:
   - Live progress bar
   - Current loss values
   - Training status
   - Log messages

The training process will run for 60 seconds with updates every 2 seconds.

## API Documentation

### REST Endpoints

#### Start Training Job
```
POST /api/v1/training/start
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "QUEUED",
  "progress": 0.0,
  "loss": 0.0,
  "log_message": "Training job queued and ready to start"
}
```

### WebSocket Endpoints

#### Training Job Updates
```
WS /ws/training/{job_id}
```

**Message Format:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RUNNING",
  "progress": 0.5,
  "loss": 1.25,
  "log_message": "Epoch 15/30 - Training on financial documents..."
}
```

**Status Values:**
- `QUEUED` - Job is created and waiting to start
- `RUNNING` - Job is actively training
- `COMPLETED` - Job has finished successfully

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite default port)
- `http://localhost:3000` (Create React App default port)

If you need to add additional origins, modify the CORS middleware in `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for running FastAPI
- **WebSockets** - Real-time bidirectional communication

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Native WebSocket API** - Real-time updates

## Development Commands

### Backend
```bash
# Run with auto-reload
python main.py

# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

**Module not found errors:**
```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port 5173 already in use:**
- Stop the existing process or modify the port in `vite.config.ts`

**WebSocket connection fails:**
- Ensure the backend is running at http://localhost:8000
- Check CORS settings in `backend/main.py`
- Verify no firewall is blocking WebSocket connections

**npm install fails:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Demo

The application demonstrates:
1. **REST API Integration** - Starting a training job via POST request
2. **WebSocket Communication** - Real-time progress updates
3. **State Management** - Efficient handling of live data updates
4. **TypeScript Type Safety** - End-to-end type definitions
5. **Clean UI/UX** - Professional, responsive dashboard design

## Notes

- The training simulation runs for exactly 60 seconds.
- Loss values decrease over time to simulate model improvement
- Progress updates are smooth and continuous
- The WebSocket connection closes automatically when training completes



**Name:** Sneha
**Date:** 2025

