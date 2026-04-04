import { useState, useEffect } from 'react'
import './App.css'
import EquipamentosPage from './pages/EquipamentosPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [equipamentos, setEquipamentos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEquipamentos()
    fetchUsuarios()
  }, [])

  const fetchEquipamentos = async () => {
    setLoading(true)
    try {
      console.log('Buscando equipamentos de /api/equipamento...')
      const response = await fetch('/api/equipamento')
      const result = await response.json()
      // A API retorna { success: true, data: [...] }
      setEquipamentos(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error)
      setEquipamentos([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      setUsuarios(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setUsuarios([])
    }
  }

  

  return (
    <div className="container">
      <header className="header">
        <h1>Sistema de Gestão TI</h1>
        <nav className="nav">
          <a 
            href="#/"
            onClick={(e) => { e.preventDefault(); setCurrentPage('home') }}
            className={currentPage === 'home' ? 'active' : ''}
          >
            Início
          </a>
          <a 
            href="#/equipamentos"
            onClick={(e) => { e.preventDefault(); setCurrentPage('equipamentos') }}
            className={currentPage === 'equipamentos' ? 'active' : ''}
          >
            Equipamentos
          </a>
          <a 
            href="#/usuarios"
            onClick={(e) => { e.preventDefault(); setCurrentPage('usuarios') }}
            className={currentPage === 'usuarios' ? 'active' : ''}
          >
            Usuários
          </a>
          <a 
            href="#/manutencao"
            onClick={(e) => { e.preventDefault(); setCurrentPage('manutencao') }}
            className={currentPage === 'manutencao' ? 'active' : ''}
          >
            Manutenção
          </a>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'home' && (
          <>
            <section className="dashboard">
              <h2>Dashboard</h2>
              <div className="cards">
                <div className="card">
                  <h3>Equipamentos</h3>
                  <p className="card-number">{equipamentos.length}</p>
                </div>
                <div className="card">
                  <h3>Usuários</h3>
                  <p className="card-number">{usuarios.length}</p>
                </div>
                <div className="card">
                  <h3>Manutenções Pendentes</h3>
                  <p className="card-number">0</p>
                </div>
              </div>
            </section>

            <section className="welcome">
              <h2>Bem-vindo ao Sistema de Gestão TI</h2>
              <p>Use o menu de navegação para acessar as funcionalidades</p>
            </section>
          </>
        )}

        {currentPage === 'equipamentos' && <EquipamentosPage />}

        {currentPage === 'usuarios' && (
          <section className="page-content">
            <h2>Usuários</h2>
            <p>Página de usuários (em desenvolvimento)</p>
          </section>
        )}

        {currentPage === 'manutencao' && (
          <section className="page-content">
            <h2>Manutenção</h2>
            <p>Página de manutenção (em desenvolvimento)</p>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Sistema de Gestão TI. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}

export default App
