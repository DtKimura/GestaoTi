import { useState, useEffect } from 'react'
import '../styles/UsuariosList.css'

function UsuariosList({ usuarios, selectedUsuario, onSelectUsuario, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSetor, setFilterSetor] = useState('')
  const [filteredUsuarios, setFilteredUsuarios] = useState([])

  // Extrair setores únicos
  const setores = [...new Set(usuarios.map(user => user.setor).filter(Boolean))].sort()

  useEffect(() => {
    // Filtrar usuários baseado na pesquisa e filtro de setor
    const filtered = usuarios.filter(user => {
      const matchSearch = 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm))

      const matchSetor = filterSetor === '' || (user.setor === filterSetor)

      return matchSearch && matchSetor
    })
    setFilteredUsuarios(filtered)
  }, [searchTerm, filterSetor, usuarios])

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterSetor('')
  }

  return (
    <div className="usuarios-list-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquisar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="filter-setor">Setor:</label>
          <select
            id="filter-setor"
            value={filterSetor}
            onChange={(e) => setFilterSetor(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {setores.map(setor => (
              <option key={setor} value={setor}>{setor}</option>
            ))}
          </select>
        </div>

        <button className="btn-reset" onClick={handleResetFilters} title="Limpar Filtros">
          ✕ Limpar
        </button>
      </div>

      <p className="results-count">
        {filteredUsuarios.length} de {usuarios.length} usuário(s)
      </p>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <ul className="usuarios-list">
          {filteredUsuarios.length === 0 ? (
            <li className="no-results">Nenhum usuário encontrado</li>
          ) : (
            filteredUsuarios.map((user) => (
              <li
                key={user.id}
                className={`usuario-item ${selectedUsuario?.id === user.id ? 'active' : ''}`}
                onClick={() => onSelectUsuario(user)}
              >
                <div className="usuario-item-content">
                  <div className="usuario-name">{user.name}</div>
                  <div className="usuario-email">{user.email}</div>
                  {user.setor && <div className="usuario-setor">{user.setor}</div>}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default UsuariosList
