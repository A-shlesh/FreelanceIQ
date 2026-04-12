import { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/invoices').then(res => setInvoices(res.data))
  }, [])

  const filtered = invoices.filter(inv =>
    filter === 'ALL' ? true : inv.status === filter
  )

  function handleMarkPaid(id) {
    api.patch(`/invoices/${id}/pay`)
      .then(() => api.get('/invoices').then(res => setInvoices(res.data)))
  }

  return (
    <div className="page">
      <h1>Invoices</h1>

      <div className="filter-bar">
        {['ALL', 'UNPAID', 'PAID', 'OVERDUE'].map(f => (
          <button
            key={f}
            className={filter === f ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {filtered.map(inv => (
          <div className="card" key={inv.id}>
            <h3>Invoice #{inv.id}</h3>
            <span className={`badge badge-${inv.status.toLowerCase()}`}>
              {inv.status}
            </span>
            <p>Total: ${inv.totalAmount.toFixed(2)}</p>
            <p>Issued: {inv.issuedAt ? inv.issuedAt.split('T')[0] : '—'}</p>
            <p>Paid: {inv.paidAt ? inv.paidAt.split('T')[0] : 'Not yet'}</p>
            {inv.status !== 'PAID' && (
              <button className="btn-ai" onClick={() => handleMarkPaid(inv.id)}>
                Mark as Paid
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvoicesPage