import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <nav className="navbar-top">
        {!isHome && (
          <Link to="/" className="navbar-back">&#8592;</Link>
        )}
        <Link to="/" className="navbar-brand">FREELANCEIQ</Link>
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