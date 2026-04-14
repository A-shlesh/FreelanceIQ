import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <nav className="navbar-top">
        <Link to="/" className="navbar-brand">FreelanceIQ</Link>
      </nav>
      {isHome && (
        <nav className="navbar-links-bar">
          <Link to="/clients">Clients</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/timelogs">Time Logs</Link>
          <Link to="/invoices">Invoices</Link>
        </nav>
      )}
    </>
  )
}

export default Navbar