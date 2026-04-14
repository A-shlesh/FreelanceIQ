import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function DashboardPage() {
  const [clients, setClients]         = useState([])
  const [projects, setProjects]       = useState([])
  const [atRisk, setAtRisk]           = useState([])
  const [unpaid, setUnpaid]           = useState([])
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [showAllAtRisk, setShowAllAtRisk]     = useState(false)

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data))
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/projects/at-risk').then(res => setAtRisk(res.data))
    api.get('/invoices/status?status=UNPAID').then(res => setUnpaid(res.data))
  }, [])

  const activeProjects  = projects.filter(p => p.status === 'ACTIVE').length
  const visibleProjects = showAllProjects ? projects : projects.slice(0, 4)
  const visibleAtRisk   = showAllAtRisk   ? atRisk   : atRisk.slice(0, 3)

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dash-card">
          <p className="dash-label">Total Clients</p>
          <h2 className="dash-number">{clients.length}</h2>
        </div>
        <div className="dash-card">
          <p className="dash-label">Active Projects</p>
          <h2 className="dash-number">{activeProjects}</h2>
        </div>
        <div className="dash-card">
          <p className="dash-label">Unpaid Invoices</p>
          <h2 className="dash-number">{unpaid.length}</h2>
        </div>
        <div className="dash-card dash-card-risk">
          <p className="dash-label">At Risk</p>
          <h2 className="dash-number">{atRisk.length}</h2>
        </div>
      </div>

      {atRisk.length > 0 && (
        <div className="dash-section">
          <h2 className="dash-section-title">At Risk Projects</h2>
          <div className="card-grid">
            {visibleAtRisk.map(project => (
              <div className="card card-risk" key={project.id}>
                <h3>{project.title}</h3>
                <p>{project.clientName}</p>
                <p>Deadline: {project.deadline}</p>
                <p>Hours Logged: {project.totalHoursLogged}</p>
              </div>
            ))}
          </div>
          {atRisk.length > 3 && (
            <button className="btn-show-more"
              onClick={() => setShowAllAtRisk(!showAllAtRisk)}>
              {showAllAtRisk ? '▲ Show Less' : '▼ Show More'}
            </button>
          )}
        </div>
      )}

      <div className="dash-section">
        <h2 className="dash-section-title">Recent Projects</h2>
        <div className="card-grid">
          {visibleProjects.map(project => (
            <div className="card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.clientName}</p>
              <span className={`badge badge-${project.status ? project.status.toLowerCase() : 'unknown'}`}>
                {project.status}
              </span>
              <p>Deadline: {project.deadline}</p>
              <p>₹{project.hourlyRate}/hr</p>
            </div>
          ))}
        </div>
        {projects.length > 4 && (
          <button className="btn-show-more"
            onClick={() => setShowAllProjects(!showAllProjects)}>
            {showAllProjects ? '▲ Show Less' : '▼ Show More'}
          </button>
        )}
      </div>

    </div>
  )
}

export default DashboardPage