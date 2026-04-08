import { useState, useEffect } from 'react'
import api from './api/axiosConfig'

function App() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    api.get('/clients')
      .then(response => {
        setClients(response.data)
      })
  }, [])

  return (
    <div>
      <h1>FreelanceIQ Clients</h1>
      {clients.map(client => (
        <div key={client.id}>
          <h3>{client.name}</h3>
          <p>{client.email}</p>
          <p>{client.company}</p>
        </div>
      ))}
    </div>
  )
}

export default App