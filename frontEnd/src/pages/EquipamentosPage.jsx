import { useState, useEffect } from 'react'
import EquipamentosList from '../components/EquipamentosList'
import EquipamentoDashboard from '../components/EquipamentoDashboard'
import Modal from '../components/Modal'
import EquipamentoForm from '../components/EquipamentoForm'
import '../styles/EquipamentosPage.css'

function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [selectedEquipamento, setSelectedEquipamento] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  useEffect(() => {
    fetchEquipamentos()
    fetchUsuarios()
  }, [])

  const fetchEquipamentos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/equipamento')
      const result = await response.json()
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

  const handleFormSuccess = (novoEquipamento) => {
    setIsFormModalOpen(false)
    fetchEquipamentos()
    setSelectedEquipamento(null)
  }

  const handleFormError = (erro) => {
    console.error('Erro:', erro)
    alert('Erro ao adicionar equipamento: ' + erro)
  }

  return (
    <div className="equipamentos-page">
      <div className="equipamentos-container">
        <div className="list-section">
          <h2>Equipamentos</h2>
          <EquipamentosList
            equipamentos={equipamentos}
            selectedEquipamento={selectedEquipamento}
            onSelectEquipamento={setSelectedEquipamento}
            loading={loading}
          />
        </div>
        <div className="dashboard-section">
          <button 
            className="btn-add-equipamento"
            onClick={() => setIsFormModalOpen(true)}
            title="Adicionar novo equipamento"
          >
            ➕ Adicionar Equipamento
          </button>
          <EquipamentoDashboard 
            equipamento={selectedEquipamento}
            usuarios={usuarios}
            onEquipamentoUpdate={fetchEquipamentos}
          />
        </div>
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Adicionar Novo Equipamento"
      >
        <EquipamentoForm 
          usuarios={usuarios}
          onSuccess={handleFormSuccess}
          onError={handleFormError}
        />
      </Modal>
    </div>
  )
}

export default EquipamentosPage
