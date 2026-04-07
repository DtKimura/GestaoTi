import { useState, useEffect } from 'react'
import '../styles/EquipamentoStatusEditForm.css'

function EquipamentoStatusEditForm({ equipamento, usuarios, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    status: equipamento?.status || 'DISPONÍVEL',
    usuario_respId: equipamento?.usuario_respId || ''
  })

  const allStatuses = ['DISPONÍVEL', 'USO', 'MANUTENÇÃO', 'DESCONTINUADO']

  // Determinar quais status estão disponíveis baseado no responsável
  const availableStatuses = formData.usuario_respId
    ? ['USO'] // Com responsável: apenas USO
    : ['DISPONÍVEL', 'MANUTENÇÃO', 'DESCONTINUADO'] // Sem responsável: sem USO

  // Ajustar status automaticamente quando mudar responsável
  useEffect(() => {
    if (formData.usuario_respId && formData.status !== 'USO') {
      // Se selecionou responsável, forçar status para USO
      setFormData(prev => ({
        ...prev,
        status: 'USO'
      }))
    } else if (!formData.usuario_respId && formData.status === 'USO') {
      // Se removeu responsável e estava em USO, voltar para DISPONÍVEL
      setFormData(prev => ({
        ...prev,
        status: 'DISPONÍVEL'
      }))
    }
  }, [formData.usuario_respId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar regra de negócio
      if (formData.usuario_respId && formData.status !== 'USO') {
        throw new Error('Equipamento com responsável deve ter status "USO"')
      }

      if (!formData.usuario_respId && formData.status === 'USO') {
        throw new Error('Equipamento sem responsável não pode ter status "USO"')
      }

      const payload = {
        status: formData.status,
        usuario_respId: formData.usuario_respId ? parseInt(formData.usuario_respId) : null
      }

      const response = await fetch(`/api/equipamento/${equipamento.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        onSuccess && onSuccess(result.data)
      } else {
        throw new Error(result.message || 'Erro ao atualizar equipamento')
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      onError && onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="equipamento-status-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="usuario_respId">Responsável</label>
        <select
          id="usuario_respId"
          name="usuario_respId"
          value={formData.usuario_respId || ''}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Nenhum responsável</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.name} ({usuario.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">
          Status
          {formData.usuario_respId && (
            <span className="label-hint"> (Automático: USO)</span>
          )}
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={!!formData.usuario_respId}
          className="form-input"
          title={formData.usuario_respId ? 'Com responsável, status é automaticamente USO' : ''}
        >
          {availableStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        {formData.usuario_respId && (
          <small className="form-help">Status é fixado em "USO" quando há responsável atribuído</small>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}

export default EquipamentoStatusEditForm
