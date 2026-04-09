import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function ClientsPage() {
  const [clients, setClients] = useState([])

const [formData, setFormData] = useState({
  name: '', email: '', company: '', phone: ''
})

  useEffect(() => {
    api.get('/clients')
      .then(response => {
        setClients(response.data)
      })
  }, [])

  function handleChange(e) {
  setFormData({ ...formData, [e.target.name]: e.target.value })
}

function handleSubmit(e) {
  e.preventDefault()
  api.post('/clients', formData)
    .then(() => {
      api.get('/clients').then(res => setClients(res.data))
      setFormData({ name: '', email: '', company: '', phone: '' })
    })
}

function handleDelete(id) {
  api.delete(`/clients/${id}`)
    .then(() => {
      api.get('/clients').then(res => setClients(res.data))
    })
}

  return (
    <div className="page">
      <h1>Clients</h1>

    <form onSubmit={handleSubmit} className="form">
  <input
    name="name"
    placeholder="Name"
    value={formData.name}
    onChange={handleChange}
  />
  <input
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
  />
  <input
    name="company"
    placeholder="Company"
    value={formData.company}
    onChange={handleChange}
  />
  <input
    name="phone"
    placeholder="Phone"
    value={formData.phone}
    onChange={handleChange}
  />
  <button type="submit">Add Client</button>
</form>
      <div className="card-grid">
        {clients.map(client => (
          <div className="card" key={client.id}>
            <h3>{client.name}</h3>
            <p>📧 {client.email}</p>
            <p>🏢 {client.company}</p>
            <p>📞 {client.phone}</p>
            <button 
    className="btn-delete" 
    onClick={() => handleDelete(client.id)}
  >
    🗑️ Delete
  </button>
          </div>
        ))}
      </div>
    </div>
  )
  
}

export default ClientsPage
