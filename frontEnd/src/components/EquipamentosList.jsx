import { useState, useEffect } from 'react'
import '../styles/EquipamentosList.css'

function EquipamentosList({ equipamentos, selectedEquipamento, onSelectEquipamento, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredEquipamentos, setFilteredEquipamentos] = useState([])

  // Extrair tipos e status únicos
  const tipos = [...new Set(equipamentos.map(eq => eq.tipo))].sort()
  const statuses = [...new Set(equipamentos.map(eq => eq.status))].sort()

  useEffect(() => {
    // Filtrar equipamentos baseado na pesquisa e filtros
    const filtered = equipamentos.filter(eq => {
      const matchSearch = 
        eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.modelo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchTipo = filterTipo === '' || eq.tipo === filterTipo
      const matchStatus = filterStatus === '' || eq.status === filterStatus

      return matchSearch && matchTipo && matchStatus
    })
    setFilteredEquipamentos(filtered)
  }, [searchTerm, filterTipo, filterStatus, equipamentos])

  const handleResetFilters = () => {
    setSearchTerm('')
    setFilterTipo('')
    setFilterStatus('')
  }

  return (
    <div className="equipamentos-list-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquisar por tipo, marca ou modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="filter-tipo">Tipo:</label>
          <select
            id="filter-tipo"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-status">Status:</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <button className="btn-reset" onClick={handleResetFilters} title="Limpar Filtros">
          ✕ Limpar
        </button>
      </div>

      <p className="results-count">
        {filteredEquipamentos.length} de {equipamentos.length} equipamento(s)
      </p>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <ul className="equipamentos-list">
          {filteredEquipamentos.length === 0 ? (
            <li className="no-results">Nenhum equipamento encontrado</li>
          ) : (
            filteredEquipamentos.map((eq) => (
              <li
                key={eq.id}
                className={`equipamento-item ${selectedEquipamento?.id === eq.id ? 'active' : ''}`}
                onClick={() => onSelectEquipamento(eq)}
              >
                <div className="eq-tipo-badge">{eq.tipo}</div>
                <div className="eq-info">
                  <h4>{eq.marca} {eq.modelo}</h4>
                  <p className="eq-status">Status: <span className={`status-${eq.status?.toLowerCase()}`}>{eq.status}</span></p>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default EquipamentosList
