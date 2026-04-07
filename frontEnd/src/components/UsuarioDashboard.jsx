import { useState } from 'react'
import Modal from './Modal'
import '../styles/UsuarioDashboard.css'

function UsuarioDashboard({ usuario, onUsuarioDeleted, onUsuarioUpdated }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editFormData, setEditFormData] = useState(usuario || {})

  if (!usuario) {
    return (
      <div className="usuario-dashboard">
        <div className="no-selection">
          <p>Selecione um usuário na lista para ver os detalhes</p>
        </div>
      </div>
    )
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      const result = await response.json()

      if (result.success) {
        setIsEditModalOpen(false)
        onUsuarioUpdated()
        alert('Usuário atualizado com sucesso!')
      } else {
        alert('Erro ao atualizar usuário: ' + result.message)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      alert('Erro ao atualizar usuário')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${usuario.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setIsDeleteConfirmOpen(false)
        onUsuarioDeleted()
        alert('Usuário deletado com sucesso!')
      } else {
        alert('Erro ao deletar usuário: ' + result.message)
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      alert('Erro ao deletar usuário')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="usuario-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h2>{usuario.name}</h2>
          <div className="usuario-role">{usuario.role || 'Funcionário'}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="info-section">
          <h3>Informações Pessoais</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>ID</label>
              <p>{usuario.id}</p>
            </div>
            <div className="info-item">
              <label>Nome</label>
              <p>{usuario.name}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{usuario.email}</p>
            </div>
            <div className="info-item">
              <label>Telefone</label>
              <p>{usuario.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Informações Profissionais</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Setor</label>
              <p>{usuario.setor || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Cargo</label>
              <p>{usuario.cargo || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Função</label>
              <p>{usuario.role || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Datas</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Data de Criação</label>
              <p>{formatDate(usuario.createdAt)}</p>
            </div>
            <div className="info-item">
              <label>Data de Atualização</label>
              <p>{formatDate(usuario.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-edit" onClick={() => setIsEditModalOpen(true)}>✎ Editar</button>
          <button className="btn btn-delete" onClick={() => setIsDeleteConfirmOpen(true)}>🗑 Deletar</button>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuário"
      >
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editFormData.name || ''}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editFormData.email || ''}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editFormData.phone || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="setor">Setor:</label>
            <input
              type="text"
              id="setor"
              name="setor"
              value={editFormData.setor || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cargo">Cargo:</label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              value={editFormData.cargo || ''}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Função:</label>
            <select
              id="role"
              name="role"
              value={editFormData.role || 'user'}
              onChange={handleEditChange}
            >
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="delete-confirm">
          <p>Tem certeza que deseja deletar o usuário <strong>{usuario.name}</strong>?</p>
          <p className="warning-text">Esta ação é irreversível.</p>
          <div className="confirm-actions">
            <button className="btn btn-delete" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deletando...' : 'Sim, Deletar'}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UsuarioDashboard
