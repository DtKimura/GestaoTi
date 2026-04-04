import { useState, useEffect } from 'react'
import '../styles/EquipamentoForm.css'

function EquipamentoForm({ usuarios, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    status: 'DISPONÍVEL',
    usuario_respId: ''
  })

  const tipos = ['Celular', 'Computador', 'AirTag', 'Infraestrutura']
  const statuses = ['DISPONÍVEL', 'USO', 'MANUTENÇÃO', 'DESCONTINUADO']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      // Validar campos obrigatórios
      if (!formData.tipo || !formData.marca || !formData.modelo) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos')
      }

      const payload = {
        tipo: formData.tipo,
        marca: formData.marca,
        modelo: formData.modelo,
        status: formData.status,
        usuario_respId: formData.usuario_respId ? parseInt(formData.usuario_respId) : null
      }

      const response = await fetch('/api/equipamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setFormData({
          tipo: '',
          marca: '',
          modelo: '',
          status: 'DISPONÍVEL',
          usuario_respId: ''
        })
        onSuccess && onSuccess(result.data)
      } else {
        throw new Error(result.message || 'Erro ao criar equipamento')
      }
    } catch (error) {
      console.error('Erro ao criar equipamento:', error)
      onError && onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="equipamento-form" onSubmit={handleSubmit}>
      {success && (
        <div className="form-success">
          ✓ Equipamento adicionado com sucesso!
        </div>
      )}

      <div className="form-group">
        <label htmlFor="tipo">Tipo de Equipamento *</label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">Selecione um tipo</option>
          {tipos.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="marca">Marca *</label>
        <input
          id="marca"
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          placeholder="ex: Samsung, Apple..."
          required
          className="form-input"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="modelo">Modelo *</label>
        <input
          id="modelo"
          type="text"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          placeholder="ex: Galaxy S21, MacBook Pro..."
          required
          className="form-input"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-input"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="usuario_respId">Responsável</label>
        <select
          id="usuario_respId"
          name="usuario_respId"
          value={formData.usuario_respId}
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

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-submit"
          disabled={loading}
        >
          {loading ? 'Adicionando...' : '+ Adicionar Equipamento'}
        </button>
      </div>

      <p className="form-hint">* Campos obrigatórios</p>
    </form>
  )
}

export default EquipamentoForm
