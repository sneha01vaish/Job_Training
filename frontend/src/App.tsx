import { useState } from 'react'
import TrainingDashboard from './components/TrainingDashboard'
import './App.css'

function App() {
  const [jobId, setJobId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startTraining = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/training/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to start training job')
      }

      const data = await response.json()
      setJobId(data.job_id)
    } catch (error) {
      console.error('Error starting training:', error)
      alert('Failed to start training job. Please ensure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetTraining = () => {
    setJobId(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calaxis Training Platform</h1>
        <p>BFSI Model Training System</p>
      </header>

      <main className="app-main">
        {!jobId ? (
          <div className="start-container">
            <div className="info-card">
              <h2>BFSI Training Module 5</h2>
              <p>
                This training module will fine-tune the model on Banking, Financial Services,
                and Insurance domain data. The process typically takes 60 seconds.
              </p>
              <ul>
                <li>Real-time progress tracking</li>
                <li>Live loss metrics</li>
                <li>Detailed training logs</li>
              </ul>
            </div>
            <button
              className="start-button"
              onClick={startTraining}
              disabled={isLoading}
            >
              {isLoading ? 'Initializing...' : 'Start BFSI Training Job (Module 5)'}
            </button>
          </div>
        ) : (
          <TrainingDashboard jobId={jobId} onReset={resetTraining} />
        )}
      </main>
    </div>
  )
}

export default App
