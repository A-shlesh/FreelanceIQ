import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ClientsPage from './pages/ClientsPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App