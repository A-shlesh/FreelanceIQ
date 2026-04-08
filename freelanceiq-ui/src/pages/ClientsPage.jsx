import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function ClientsPage() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    api.get('/clients')
      .then(response => {
        setClients(response.data)
      })
  }, [])

  return (
    <div className="page">
      <h1>Clients</h1>
      <div className="card-grid">
        {clients.map(client => (
          <div className="card" key={client.id}>
            <h3>{client.name}</h3>
            <p>📧 {client.email}</p>
            <p>🏢 {client.company}</p>
            <p>📞 {client.phone}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsPage