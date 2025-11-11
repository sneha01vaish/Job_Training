import { useState, useEffect, useRef } from 'react'
import { TrainingJob } from '../types'
import './TrainingDashboard.css'

interface TrainingDashboardProps {
  jobId: string
  onReset: () => void
}

const TrainingDashboard = ({ jobId, onReset }: TrainingDashboardProps) => {
  const [jobData, setJobData] = useState<TrainingJob | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/training/${jobId}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnectionStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const data: TrainingJob = JSON.parse(event.data)
        setJobData(data)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('disconnected')
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      setConnectionStatus('disconnected')
    }

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [jobId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'QUEUED':
        return '#FFA500'
      case 'RUNNING':
        return '#2196F3'
      case 'COMPLETED':
        return '#4CAF50'
      default:
        return '#999'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'QUEUED':
        return '⏸'
      case 'RUNNING':
        return '▶'
      case 'COMPLETED':
        return '✓'
      default:
        return '•'
    }
  }

  if (!jobData) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Connecting to training job...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Training Job Dashboard</h2>
        <div className="connection-indicator" data-status={connectionStatus}>
          <span className="connection-dot"></span>
          {connectionStatus === 'connected' ? 'Live' : 'Disconnected'}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="info-section">
          <div className="info-item">
            <label>Job ID</label>
            <div className="job-id">{jobData.job_id}</div>
          </div>

          <div className="info-item">
            <label>Status</label>
            <div className="status-badge" style={{ backgroundColor: getStatusColor(jobData.status) }}>
              <span className="status-icon">{getStatusIcon(jobData.status)}</span>
              {jobData.status}
            </div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <label>Training Progress</label>
            <span className="progress-percentage">{(jobData.progress * 100).toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${jobData.progress * 100}%` }}
            >
              {jobData.progress > 0.1 && (
                <span className="progress-bar-text">{(jobData.progress * 100).toFixed(0)}%</span>
              )}
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <div className="metric-card">
            <label>Current Loss</label>
            <div className="metric-value">{jobData.loss.toFixed(4)}</div>
          </div>
        </div>

        <div className="logs-section">
          <label>Training Logs</label>
          <div className="log-container">
            <div className="log-entry">
              <span className="log-timestamp">{new Date().toLocaleTimeString()}</span>
              <span className="log-message">{jobData.log_message}</span>
            </div>
          </div>
        </div>

        {jobData.status === 'COMPLETED' && (
          <div className="completion-section">
            <div className="success-message">
              <span className="success-icon">🎉</span>
              <h3>Training Completed Successfully!</h3>
              <p>Your BFSI Module 5 model is ready for deployment.</p>
            </div>
            <button className="reset-button" onClick={onReset}>
              Start New Training Job
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrainingDashboard
