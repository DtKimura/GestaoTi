import { useState, useEffect } from 'react'
import '../styles/EquipamentoDetalhes.css'

function EquipamentoDetalhes({ equipamento }) {
  const [detalhes, setDetalhes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (equipamento) {
      fetchDetalhes()
    }
  }, [equipamento])

  const fetchDetalhes = async () => {
    setLoading(true)
    setErro(null)
    try {
      const tipo = equipamento.tipo.toLowerCase()
      let endpoint = ''

      // Mapear o tipo para a rota correta
      if (tipo === 'computador') {
        endpoint = `/api/computadores/${equipamento.id}`
      } else if (tipo === 'celular') {
        endpoint = `/api/celulares/${equipamento.id}`
      } else if (tipo === 'airtag') {
        endpoint = `/api/airtags/${equipamento.id}`
      } else {
        setErro('Tipo de equipamento não reconhecido')
        setLoading(false)
        return
      }

      const response = await fetch(endpoint)
      const result = await response.json()

      if (result.success && result.data) {
        setDetalhes(result.data)
      } else {
        setErro('Não foi possível carregar os detalhes')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      setErro('Erro ao carregar os dados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="detalhes-loading">Carregando detalhes...</div>
  }

  if (erro) {
    return <div className="detalhes-erro">{erro}</div>
  }

  if (!detalhes) {
    return <div className="detalhes-vazio">Nenhum detalhe disponível</div>
  }

  return (
    <div className="equipamento-detalhes">
      <div className="detalhes-info">
        <h3>Especificações Técnicas</h3>
        <div className="detalhes-grid">
          {Object.entries(detalhes).map(([chave, valor]) => {
            // Pular campos que já foram exibidos no dashboard
            if (['id', 'tipo', 'marca', 'modelo', 'status', 'usuario_respId', 'usuario_resp', 'createdAt', 'updatedAt'].includes(chave)) {
              return null
            }

            // Formatar a chave para exibição
            const chaveFmt = chave
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())

            // Verificar se é um objeto e exibir de forma legível
            let conteudo = valor
            if (typeof valor === 'object' && valor !== null) {
              conteudo = JSON.stringify(valor, null, 2)
            } else if (valor === null || valor === undefined) {
              conteudo = 'N/A'
            }

            return (
              <div key={chave} className="detalhe-item">
                <label>{chaveFmt}</label>
                <p>{String(conteudo)}</p>
              </div>
            )
          })}
        </div>

        {Object.keys(detalhes).filter(k => !['id', 'tipo', 'marca', 'modelo', 'status', 'usuario_respId', 'usuario_resp', 'createdAt', 'updatedAt'].includes(k)).length === 0 && (
          <p className="sem-especificacoes">Sem especificações adicionais cadastradas</p>
        )}
      </div>

      <div className="detalhes-json">
        <h3>Dados Completos (JSON)</h3>
        <pre>{JSON.stringify(detalhes, null, 2)}</pre>
      </div>
    </div>
  )
}

export default EquipamentoDetalhes
