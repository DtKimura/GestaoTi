import { useState, useEffect } from 'react'
import '../styles/EquipamentoEditForm.css'

function EquipamentoEditForm({ equipamento, onSuccess, onError, onClose }) {
  const [loading, setLoading] = useState(false)
  const [loadingDetalhes, setLoadingDetalhes] = useState(true)
  const [success, setSuccess] = useState(false)
  const [detalhes, setDetalhes] = useState(null)
  const [formData, setFormData] = useState({
    equipamento: {
      tipo: equipamento?.tipo || '',
      marca: equipamento?.marca || '',
      modelo: equipamento?.modelo || ''
    },
    detalhes: {}
  })

  const tipos = ['Celular', 'Computador', 'AirTag', 'Infraestrutura']

  // Campos específicos de cada tipo de equipamento (excluindo FK e status)
  const camposDetalhes = {
    Computador: [
      { name: 'hostname', label: 'Hostname', type: 'text', required: true },
      { name: 'localizacao_atual', label: 'Localização Atual', type: 'text', required: true },
      { name: 'setor', label: 'Setor', type: 'text', required: true },
      { name: 'termo', label: 'Termo', type: 'select', options: ['ATIVO', 'INATIVO', 'MANUTENÇÃO', 'DESCONTINUADO'] },
      { name: 'perfil_aplic', label: 'Perfil Aplicação', type: 'text' }
    ],
    Celular: [
      { name: 'estoque', label: 'Estoque', type: 'text' },
      { name: 'observacoes', label: 'Observações', type: 'textarea' },
      { name: 'termo', label: 'Termo', type: 'select', options: ['ATIVO', 'INATIVO', 'DESCONTINUADO', 'REPARANDO'] },
      { name: 'processador', label: 'Processador', type: 'text' },
      { name: 'memoria', label: 'Memória', type: 'text' },
      { name: 'armazenamento', label: 'Armazenamento', type: 'text' },
      { name: 'so', label: 'Sistema Operacional', type: 'text' },
      { name: 'mac', label: 'MAC Address', type: 'text' },
      { name: 'imei_1', label: 'IMEI 1', type: 'text' },
      { name: 'imei_2', label: 'IMEI 2', type: 'text' },
      { name: 'numero', label: 'Número', type: 'text' },
      { name: 'email_google', label: 'Email Google', type: 'email' },
      { name: 'senha_google', label: 'Senha Google', type: 'password' },
      { name: 'perfil', label: 'Perfil', type: 'text' },
      { name: 'num_manutencao', label: 'Número Manutenção', type: 'number' }
    ],
    AirTag: [
      { name: 'placa', label: 'Placa', type: 'text', required: true },
      { name: 'renavan', label: 'Renavan', type: 'select', options: ['ATIVO', 'INATIVO', 'PENDENTE'] },
      { name: 'airtag_ok', label: 'AirTag OK', type: 'checkbox' }
    ],
    Infraestrutura: [
      { name: 'mac', label: 'MAC Address', type: 'text', required: true }
    ]
  }

  useEffect(() => {
    if (equipamento) {
      fetchDetalhes()
    }
  }, [equipamento])

  const fetchDetalhes = async () => {
    setLoadingDetalhes(true)
    try {
      const tipo = equipamento.tipo.toLowerCase()
      let endpoint = ''

      if (tipo === 'computador') {
        endpoint = `/api/computadores/${equipamento.id}`
      } else if (tipo === 'celular') {
        endpoint = `/api/celulares/${equipamento.id}`
      } else if (tipo === 'airtag') {
        endpoint = `/api/airtags/${equipamento.id}`
      } else if (tipo === 'infraestrutura') {
        endpoint = `/api/infraestrutura/${equipamento.id}`
      }

      const response = await fetch(endpoint)
      const result = await response.json()

      if (result.success && result.data) {
        setDetalhes(result.data)
        // Preencher formulário com dados existentes
        const detalhesForm = {}
        camposDetalhes[equipamento.tipo]?.forEach(campo => {
          detalhesForm[campo.name] = result.data[campo.name] || ''
        })
        setFormData(prev => ({
          ...prev,
          detalhes: detalhesForm
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      onError?.('Erro ao carregar o equipamento')
    } finally {
      setLoadingDetalhes(false)
    }
  }

  const handleEquipamentoChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      equipamento: {
        ...prev.equipamento,
        [name]: value
      }
    }))
  }

  const handleDetalhesChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      detalhes: {
        ...prev.detalhes,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      // Atualizar equipamento base
      const equipResponse = await fetch(`/api/equipamento/${equipamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.equipamento)
      })

      const equipResult = await equipResponse.json()
      if (!equipResult.success) {
        throw new Error(equipResult.message || 'Erro ao atualizar equipamento')
      }

      // Atualizar detalhes específicos
      const tipo = equipamento.tipo.toLowerCase()
      let detalheEndpoint = ''

      if (tipo === 'computador') {
        detalheEndpoint = `/api/computadores/${equipamento.id}`
      } else if (tipo === 'celular') {
        detalheEndpoint = `/api/celulares/${equipamento.id}`
      } else if (tipo === 'airtag') {
        detalheEndpoint = `/api/airtags/${equipamento.id}`
      } else if (tipo === 'infraestrutura') {
        detalheEndpoint = `/api/infraestrutura/${equipamento.id}`
      }

      const detalheResponse = await fetch(detalheEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.detalhes)
      })

      const detalheResult = await detalheResponse.json()
      if (!detalheResult.success) {
        throw new Error(detalheResult.message || 'Erro ao atualizar detalhes')
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose?.()
      }, 1500)
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingDetalhes) {
    return <div className="form-loading">Carregando dados...</div>
  }

  const detalhesCampos = camposDetalhes[equipamento.tipo] || []

  return (
    <form className="equipamento-edit-form" onSubmit={handleSubmit}>
      {success && (
        <div className="form-success">
          ✓ Equipamento atualizado com sucesso!
        </div>
      )}

      <div className="form-section">
        <h3>Informações Gerais</h3>
        
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Equipamento</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.equipamento.tipo}
            onChange={handleEquipamentoChange}
            className="form-input"
            disabled
          >
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          <small>Não pode ser alterado</small>
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            type="text"
            name="marca"
            value={formData.equipamento.marca}
            onChange={handleEquipamentoChange}
            placeholder="ex: Samsung"
            className="form-input"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo</label>
          <input
            id="modelo"
            type="text"
            name="modelo"
            value={formData.equipamento.modelo}
            onChange={handleEquipamentoChange}
            placeholder="ex: Galaxy S21"
            className="form-input"
            maxLength={100}
          />
        </div>
      </div>

      {detalhesCampos.length > 0 && (
        <div className="form-section">
          <h3>Especificações Técnicas</h3>
          
          {detalhesCampos.map(campo => (
            <div key={campo.name} className="form-group">
              <label htmlFor={campo.name}>
                {campo.label}
                {campo.required && <span className="required">*</span>}
              </label>
              
              {campo.type === 'textarea' && (
                <textarea
                  id={campo.name}
                  name={campo.name}
                  value={formData.detalhes[campo.name] || ''}
                  onChange={handleDetalhesChange}
                  className="form-input"
                  rows="3"
                />
              )}
              
              {campo.type === 'select' && (
                <select
                  id={campo.name}
                  name={campo.name}
                  value={formData.detalhes[campo.name] || ''}
                  onChange={handleDetalhesChange}
                  className="form-input"
                >
                  <option value="">Selecione...</option>
                  {campo.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              
              {campo.type === 'checkbox' && (
                <label className="checkbox-label">
                  <input
                    id={campo.name}
                    type="checkbox"
                    name={campo.name}
                    checked={formData.detalhes[campo.name] || false}
                    onChange={handleDetalhesChange}
                    className="checkbox-input"
                  />
                  <span>{campo.label}</span>
                </label>
              )}
              
              {!['textarea', 'select', 'checkbox'].includes(campo.type) && (
                <input
                  id={campo.name}
                  type={campo.type}
                  name={campo.name}
                  value={formData.detalhes[campo.name] || ''}
                  onChange={handleDetalhesChange}
                  placeholder={`ex: ${campo.label}`}
                  className="form-input"
                  required={campo.required}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button 
          type="button"
          className="btn btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="btn btn-save"
          disabled={loading}
        >
          {loading ? 'Salvando...' : '💾 Salvar Alterações'}
        </button>
      </div>

      <p className="form-hint">* Campos obrigatórios</p>
    </form>
  )
}

export default EquipamentoEditForm
