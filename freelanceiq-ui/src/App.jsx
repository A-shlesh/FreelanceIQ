import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClientsPage from './pages/ClientsPage'
import ProjectsPage from './pages/ProjectsPage'
import TimeLogsPage from './pages/TimeLogsPage'
import InvoicesPage from './pages/InvoicesPage'
import CometBackground from './components/CometBackground'

function App() {
  return (
    <BrowserRouter>
    <CometBackground />
      <Navbar />
      <Routes>
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/timelogs" element={<TimeLogsPage />} />
        <Route path="/invoices"  element={<InvoicesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App