import { useState, useEffect } from 'react'
import UsuariosList from '../components/UsuariosList'
import UsuarioDashboard from '../components/UsuarioDashboard'
import '../styles/UsuariosPage.css'

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      setUsuarios(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  const handleUsuarioDeleted = () => {
    fetchUsuarios()
    setSelectedUsuario(null)
  }

  const handleUsuarioUpdated = () => {
    fetchUsuarios()
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-container">
        <div className="list-section">
          <h2>Usuários / Funcionários</h2>
          <UsuariosList
            usuarios={usuarios}
            selectedUsuario={selectedUsuario}
            onSelectUsuario={setSelectedUsuario}
            loading={loading}
          />
        </div>
        <div className="dashboard-section">
          <UsuarioDashboard 
            usuario={selectedUsuario}
            onUsuarioDeleted={handleUsuarioDeleted}
            onUsuarioUpdated={handleUsuarioUpdated}
          />
        </div>
      </div>
    </div>
  )
}

export default UsuariosPage
