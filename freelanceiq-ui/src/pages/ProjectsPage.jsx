import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function ProjectsPage() {

  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [aiResponses, setAiResponses] = useState({})
  const [aiLoading, setAiLoading] = useState({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    complexity: '',
    hourlyRate: '',
    deadline: ''
  })

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data))
    api.get('/clients').then(res => setClients(res.data))
  }, [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    api.post(`/projects?clientId=${selectedClientId}`, formData)
      .then(() => {
        api.get('/projects').then(res => setProjects(res.data))
        setFormData({
          title: '',
          description: '',
          techStack: '',
          complexity: '',
          hourlyRate: '',
          deadline: ''
        })
        setSelectedClientId('')
      })
  }

  function handleDelete(id) {
    api.delete(`/projects/${id}`)
      .then(() => {
        api.get('/projects').then(res => setProjects(res.data))
      })
  }

  function handleSuggestPrice(project) {
    setAiLoading({ ...aiLoading, [project.id]: true })
    api.post('/ai/suggest-price', {
      title: project.title,
      techStack: project.techStack,
      complexity: project.complexity,
      deadline: project.deadline,
      hourlyRate: String(project.hourlyRate)
    })
    .then(res => {
      setAiResponses({ ...aiResponses, [project.id]: res.data })
      setAiLoading({ ...aiLoading, [project.id]: false })
    })
  }

  return (
    <div className="page">
      <h1>Projects</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="techStack"
          placeholder="Tech Stack"
          value={formData.techStack}
          onChange={handleChange}
        />
        <select
          name="complexity"
          value={formData.complexity}
          onChange={handleChange}
        >
          <option value="" disabled>Complexity</option>
          <option value="SIMPLE">SIMPLE</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="COMPLEX">COMPLEX</option>
        </select>
        <input
          name="hourlyRate"
          placeholder="Hourly Rate"
          type="number"
          value={formData.hourlyRate}
          onChange={handleChange}
        />
        <input
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
        />
        <select
          value={selectedClientId}
          onChange={e => setSelectedClientId(e.target.value)}
        >
          <option value="" disabled>Select Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Project</button>
      </form>

      <div className="card-grid">
        {projects.map(project => (
          <div className={project.atRisk ? "card card-risk" : "card"} key={project.id}>
            <h3>{project.title}</h3>
            <span className={`badge badge-${project.status ? project.status.toLowerCase() : 'unknown'}`}>
              {project.status}
            </span>
            <p>Hourly Rate: ₹{project.hourlyRate}</p>
            <p>Deadline: {project.deadline}</p>
            <p>Complexity: {project.complexity}</p>
            <p>Hours Logged: {project.totalHoursLogged}</p>
            <button
              className="btn-delete"
              onClick={() => handleDelete(project.id)}
            >
              Delete
            </button>
            <button
              className="btn-ai"
              onClick={() => handleSuggestPrice(project)}
            >
              {aiLoading[project.id] ? 'Thinking...' : 'AI Suggest Price'}
            </button>
            {aiResponses[project.id] && (
              <div className="ai-response">
                <p>{aiResponses[project.id]}</p>
                <div className="ai-response-actions">
                  <button
                    className="btn-ai-refresh"
                    onClick={() => handleSuggestPrice(project)}
                  >
                    Refresh
                  </button>
                  <button
                    className="btn-ai-close"
                    onClick={() => setAiResponses({ ...aiResponses, [project.id]: null })}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage