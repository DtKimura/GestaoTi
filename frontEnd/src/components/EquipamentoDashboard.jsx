import { useState } from 'react'
import Modal from './Modal'
import EquipamentoDetalhes from './EquipamentoDetalhes'
import EquipamentoEditForm from './EquipamentoEditForm'
import EquipamentoStatusEditForm from './EquipamentoStatusEditForm'
import '../styles/EquipamentoDashboard.css'

function EquipamentoDashboard({ equipamento, usuarios, onEquipamentoUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  if (!equipamento) {
    return (
      <div className="equipamento-dashboard">
        <div className="no-selection">
          <p>Selecione um equipamento na lista para ver os detalhes</p>
        </div>
      </div>
    )
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
    <div className="equipamento-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h2>{equipamento.marca} {equipamento.modelo}</h2>
          <div className={`status-badge status-${equipamento.status?.toLowerCase()}`}>
            {equipamento.status}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="info-section">
          <h3>Informações Gerais</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>ID</label>
              <p>{equipamento.id}</p>
            </div>
            <div className="info-item">
              <label>Tipo</label>
              <p>{equipamento.tipo}</p>
            </div>
            <div className="info-item">
              <label>Marca</label>
              <p>{equipamento.marca}</p>
            </div>
            <div className="info-item">
              <label>Modelo</label>
              <p>{equipamento.modelo}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Responsável</h3>
          {equipamento.usuario_resp ? (
            <div className="info-grid">
              <div className="info-item">
                <label>Nome</label>
                <p>{equipamento.usuario_resp.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{equipamento.usuario_resp.email}</p>
              </div>
            </div>
          ) : (
            <p className="no-data">Sem responsável atribuído</p>
          )}
        </div>

        <div className="info-section">
          <h3>Datas</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Data de Criação</label>
              <p>{formatDate(equipamento.createdAt)}</p>
            </div>
            <div className="info-item">
              <label>Data de Atualização</label>
              <p>{formatDate(equipamento.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-info" onClick={() => setIsModalOpen(true)}>ℹ Mais Informações</button>
          <button className="btn btn-edit" onClick={() => setIsStatusModalOpen(true)}>🔄 Status/Responsável</button>
          <button className="btn btn-edit" onClick={() => setIsEditModalOpen(true)}>✎ Editar</button>
          <button className="btn btn-delete">🗑 Deletar</button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Detalhes - ${equipamento.marca} ${equipamento.modelo}`}
        >
          <EquipamentoDetalhes equipamento={equipamento} />
        </Modal>

        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="Alterar Status e Responsável"
        >
          <EquipamentoStatusEditForm
            equipamento={equipamento}
            usuarios={usuarios || []}
            onSuccess={() => {
              setIsStatusModalOpen(false)
              onEquipamentoUpdate?.()
            }}
            onError={(erro) => alert('Erro: ' + erro)}
          />
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Editar - ${equipamento.marca} ${equipamento.modelo}`}
        >
          <EquipamentoEditForm 
            equipamento={equipamento}
            onSuccess={() => {
              setIsEditModalOpen(false)
              onEquipamentoUpdate?.()
            }}
            onError={(erro) => alert('Erro: ' + erro)}
            onClose={() => setIsEditModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  )
}

export default EquipamentoDashboard
