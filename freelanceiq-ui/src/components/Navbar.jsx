import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🚀 FreelanceIQ
      </div>
      <div className="navbar-links">
        <Link to="/clients">Clients</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/timelogs">Time Logs</Link>
        <Link to="/invoices">Invoices</Link>
      </div>
    </nav>
  )
}

export default Navbar