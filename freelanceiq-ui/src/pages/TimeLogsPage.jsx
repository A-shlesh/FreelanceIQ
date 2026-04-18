import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function TimeLogsPage() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [timeLogs, setTimeLogs] = useState([])
  const [formData, setFormData] = useState({ hoursWorked: '', workDescription: '', dateLogged: '' })

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
  }, [])

  useEffect(() => {
    if (selectedProjectId) fetchTimeLogs()
  }, [selectedProjectId])

  function fetchTimeLogs() {
    api.get(`/timelogs/project/${selectedProjectId}`)
      .then(res => setTimeLogs(res.data))
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
  e.preventDefault()
  if (!formData.hoursWorked || !formData.workDescription || !formData.dateLogged) {
    alert('All fields are required.')
    return
  }
  api.post(`/timelogs?projectId=${selectedProjectId}`, formData)
    .then(() => {
      fetchTimeLogs()
      setFormData({ hoursWorked: '', workDescription: '', dateLogged: '' })
    })
}

  function handleDelete(id) {
    api.delete(`/timelogs/${id}`)
      .then(() => fetchTimeLogs())
  }

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0)

  return (
    <div className="page">
      <h1>Time Logs</h1>

      <div className="form" style={{ marginBottom: '20px' }}>
        <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)}>
          <option value="" disabled>Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {selectedProjectId && (
        <>
          <p style={{ color: '#a78bfa', marginBottom: '16px' }}>
            Total Hours: <strong>{totalHours}</strong>
          </p>
          <form onSubmit={handleSubmit} className="form">
          <input name="hoursWorked" type="number" placeholder="Hours Worked"
            min="0.5" step="0.5"
            value={formData.hoursWorked} onChange={handleChange} />
          <input name="workDescription" placeholder="Description"
            value={formData.workDescription} onChange={handleChange} />
          <input name="dateLogged" type="date"
            max={new Date().toISOString().split('T')[0]}
            value={formData.dateLogged} onChange={handleChange} />
          <button type="submit">Add Log</button>
          </form>
          <div className="card-grid">
            {timeLogs.map(log => (
              <div className="card" key={log.id}>
                <h3>{log.hoursWorked} hrs</h3>
                <p>{log.workDescription}</p>
                <p>{log.dateLogged}</p>
                <button className="btn-delete" onClick={() => handleDelete(log.id)}>🗑️ Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TimeLogsPage