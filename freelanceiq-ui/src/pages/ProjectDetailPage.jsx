import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [timeLogs, setTimeLogs] = useState([])
  const [invoice, setInvoice] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    fetchAll()
  }, [])

  function fetchAll() {
    api.get(`/projects/${id}`).then(res => {
      setProject(res.data)
      setEditForm({
        title: res.data.title,
        description: res.data.description,
        techStack: res.data.techStack,
        complexity: res.data.complexity,
        hourlyRate: res.data.hourlyRate,
        deadline: res.data.deadline,
      })
    })
    api.get(`/timelogs/project/${id}`).then(res => setTimeLogs(res.data))
    api.get('/invoices').then(res => {
      const found = res.data.find(inv => String(inv.projectId) === String(id))
      setInvoice(found || null)
    })
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  function handleEditSubmit(e) {
    e.preventDefault()
    api.put(`/projects/${id}`, editForm).then(() => {
      fetchAll()
      setShowEdit(false)
    })
  }

  if (!project) return <div className="page">Loading...</div>

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hoursWorked, 0)

  return (
    <div className="page">
      <button className="btn-edit" onClick={() => navigate('/projects')}
        style={{ marginBottom: '20px' }}>← Back to Projects</button>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#a78bfa' }}>{project.title}</h2>
        <p>Client: {project.clientName}</p>
        <span className={`badge badge-${project.status ? project.status.toLowerCase() : 'unknown'}`}>
          {project.status}
        </span>
        <p>Description: {project.description}</p>
        <p>Tech Stack: {project.techStack}</p>
        <p>Complexity: {project.complexity}</p>
        <p>Hourly Rate: ₹{project.hourlyRate}</p>
        <p>Deadline: {project.deadline}</p>
        <p>Hours Logged: {project.totalHoursLogged}</p>
        <p>At Risk: {project.atRisk ? 'Yes' : 'No'}</p>
        <button className="btn-edit" onClick={() => setShowEdit(!showEdit)}
          style={{ marginTop: '10px' }}>
          {showEdit ? 'Cancel Edit' : 'Edit'}
        </button>
      </div>

      {showEdit && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#a78bfa', marginBottom: '16px' }}>Edit Project</h3>
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
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#a78bfa', marginBottom: '12px' }}>Time Logs</h3>
        {timeLogs.length === 0 ? (
          <p>No time logs yet.</p>
        ) : (
          <>
            <p style={{ marginBottom: '10px' }}>Total Hours: <strong>{totalHours}</strong></p>
            {timeLogs.map(log => (
              <div key={log.id} style={{ borderBottom: '1px solid #2d2d4e', paddingBottom: '8px', marginBottom: '8px' }}>
                <p>{log.hoursWorked} hrs — {log.workDescription}</p>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>{log.dateLogged}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {invoice && (
        <div className="card">
          <h3 style={{ color: '#a78bfa', marginBottom: '12px' }}>Invoice</h3>
          <p>Total Amount: ₹{invoice.totalAmount}</p>
          <p>Status: <span className={`badge badge-${invoice.status.toLowerCase()}`}>{invoice.status}</span></p>
          <p>Issued: {invoice.issuedAt}</p>
          {invoice.paidAt && <p>Paid: {invoice.paidAt}</p>}
        </div>
      )}
    </div>
  )
}

export default ProjectDetailPage