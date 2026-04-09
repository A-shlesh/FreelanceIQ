import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function ProjectsPage() {

  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.get('/projects')
      .then(response => {
        setProjects(response.data)
      })
  }, [])

  return (
    <div className="page">
      <h1>Projects</h1>
      <div className="card-grid">
        {projects.map(project => (
          <div className={project.atRisk ? "card card-risk" : "card"} key={project.id}>
            <h3>{project.title}</h3>
            <span className={`badge badge-${project.status ? project.status.toLowerCase() : 'unknown'}`}>
              {project.status}
            </span>
            <p>💰 Hourly Rate: ₹{project.hourlyRate}</p>
            <p>📅 Deadline: {project.deadline}</p>
            <p>🧩 Complexity: {project.complexity}</p>
            <p>⏱️ Hours Logged: {project.totalHoursLogged}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage