import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function ProjectsPage() {

  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [aiResponses, setAiResponses] = useState({})
  const [aiLoading, setAiLoading] = useState({})
  const [editProject, setEditProject] = useState(null)
  const [editForm, setEditForm]       = useState({})
  const [reminder, setReminder]       = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    complexity: '',
    hourlyRate: '',
    deadline: ''
  })

  function updateReminder(projectList) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reminders = projectList
    .filter(p => p.deadline && p.status !== 'COMPLETED' && p.status !== 'OVERDUE')
    .map(p => {
      const [year, month, day] = p.deadline.split('-').map(Number)
      const deadline = new Date(year, month - 1, day)
      deadline.setHours(0, 0, 0, 0)
      const diffDays = Math.round((deadline - today) / (1000 * 60 * 60 * 24))
      console.log(p.title, 'deadline:', p.deadline, 'diffDays:', diffDays)

      let message = null
      if (diffDays < 0) message = 'Deadline exceeded'
      else if (diffDays === 0) message = 'Deadline is today'
      else if (diffDays === 1) message = 'Deadline is tomorrow'

      return message ? { ...p, reminderMessage: message } : null
    })
    .filter(Boolean)

  console.log('setting reminders:', reminders)
  setReminder(reminders)
}

  useEffect(() => {
  api.get('/projects').then(res => {
    setProjects(res.data)
    updateReminder(res.data)
  })
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
  
function handleEditClick(project) {
  setEditProject(project)
  setEditForm({
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    complexity: project.complexity,
    hourlyRate: project.hourlyRate,
    deadline: project.deadline,
  })
}

function handleEditChange(e) {
  setEditForm({ ...editForm, [e.target.name]: e.target.value })
}

function handleEditSubmit(e) {
  e.preventDefault()
  api.put(`/projects/${editProject.id}`, editForm)
    .then(() => {
      api.get('/projects').then(res => {
        setProjects(res.data)
        updateReminder(res.data)
      })
      setEditProject(null)
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

    {reminder.length > 0 && (
  <div className="reminder-popup">
    <h3>Deadline Reminder</h3>
    {reminder.map(p => (
      <p key={p.id}>• {p.title} — {p.reminderMessage}</p>
    ))}
    <button className="btn-ai-close" onClick={() => setReminder([])}>✕ Dismiss</button>
  </div>
)}

    <h1>Projects</h1>
    <form onSubmit={handleSubmit} className="form">
      <input name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <input name="techStack" placeholder="Tech Stack" value={formData.techStack} onChange={handleChange} />
      <select name="complexity" value={formData.complexity} onChange={handleChange}>
        <option value="" disabled>Complexity</option>
        <option value="SIMPLE">SIMPLE</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="COMPLEX">COMPLEX</option>
      </select>
      <input name="hourlyRate" placeholder="Hourly Rate" type="number" value={formData.hourlyRate} onChange={handleChange} />
      <input name="deadline" type="date"
        min={new Date().toISOString().split('T')[0]}
        value={formData.deadline} onChange={handleChange} />
      <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
        <option value="" disabled>Select Client</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>
      <button type="submit">Add Project</button>
    </form>

    <div className="card-grid">
      {projects.map(project => (
        <div className={project.atRisk ? "card card-risk" : "card"} key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{ cursor: 'pointer' }}>
          <h3>{project.title}</h3>
          <p>Client: {project.clientName}</p>
          <span className={`badge badge-${project.status ? project.status.toLowerCase() : 'unknown'}`}>
            {project.status}
          </span>
          <p>Hourly Rate: ₹{project.hourlyRate}</p>
          <p>Deadline: {project.deadline}</p>
          <p>Complexity: {project.complexity}</p>
          <p>Hours Logged: {project.totalHoursLogged}</p>
          <button className="btn-delete" onClick={() => handleDelete(project.id)}>Delete</button>
          <button className="btn-edit" onClick={() => handleEditClick(project)}>✏️ Edit</button>
          {project.status !== 'COMPLETED' && (
            <>
              <button className="btn-ai" onClick={() => handleSuggestPrice(project)}>
                {aiLoading[project.id] ? 'Thinking...' : 'Suggest Price'}
              </button>
              {aiResponses[project.id] && (
                <div className="ai-response">
                  <p>{aiResponses[project.id]}</p>
                  <div className="ai-response-actions">
                    <button className="btn-ai-refresh" onClick={() => handleSuggestPrice(project)}>🔄 Refresh</button>
                    <button className="btn-ai-close" onClick={() => setAiResponses({ ...aiResponses, [project.id]: null })}>✕ Close</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>

    {editProject && (
      <div className="modal-overlay" onClick={() => setEditProject(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <h2>Edit Project</h2>
          <form onSubmit={handleEditSubmit} className="form">
            <input name="title" placeholder="Title"
              value={editForm.title} onChange={handleEditChange} />
            <input name="description" placeholder="Description"
              value={editForm.description} onChange={handleEditChange} />
            <input name="techStack" placeholder="Tech Stack"
              value={editForm.techStack} onChange={handleEditChange} />
            <select name="complexity" value={editForm.complexity} onChange={handleEditChange}>
              <option value="SIMPLE">SIMPLE</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="COMPLEX">COMPLEX</option>
            </select>
            <input name="hourlyRate" type="number" placeholder="Hourly Rate"
              value={editForm.hourlyRate} onChange={handleEditChange} />
            <input name="deadline" type="date"
              min={new Date().toISOString().split('T')[0]}
              value={editForm.deadline} onChange={handleEditChange} />
            <button type="submit">💾 Save</button>
            <button type="button" onClick={() => setEditProject(null)}>Cancel</button>
          </form>
        </div>
      </div>
    )}

  </div>
)}

export default ProjectsPage