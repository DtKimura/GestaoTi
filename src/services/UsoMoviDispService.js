const UsoMoviDisp = require('../models/UsoMoviDisp');
const Equipamento = require('../models/Equipamento');
const User = require('../models/User');

/**
 * Cria um novo registro de UsoMoviDisp e atualiza o status do equipamento para "USO"
 * @param {number} responsavelId - ID do responsável (usuário)
 * @param {number} equipamentoId - ID do equipamento
 * @param {Date} finish_date - Data de término (opcional)
 * @returns {Object} Registro criado com associações
 */
const createUsoMoviDisp = async (responsavelId, equipamentoId, finish_date = null) => {
  // Validar campos obrigatórios
  if (!responsavelId || !equipamentoId) {
    throw new Error('responsavelId and equipamentoId are required');
  }

  // Verificar se o responsável (User) existe
  const responsavel = await User.findByPk(responsavelId);
  if (!responsavel) {
    throw new Error('User (responsável) not found');
  }

  // Verificar se o equipamento existe
  const equipamento = await Equipamento.findByPk(equipamentoId);
  if (!equipamento) {
    throw new Error('Equipamento not found');
  }

  // Criar o registro de UsoMoviDisp
  const record = await UsoMoviDisp.create({
    responsavelId,
    equipamentoId,
    finish_date,
  });

  // Atualizar o status do equipamento para "USO"
  await equipamento.update({ status: 'USO', usuario_respId: record.responsavelId });

  // Buscar o registro criado com associações
  const createdRecord = await UsoMoviDisp.findByPk(record.id, {
    include: [
      {
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Equipamento,
        as: 'equipamento',
        attributes: ['id', 'tipo', 'marca', 'modelo', 'status'],
      },
    ],
  });

  return createdRecord;
};

/**
 * Atualiza um registro de UsoMoviDisp
 * @param {number} id - ID do registro
 * @param {Object} data - Dados a atualizar (responsavelId, equipamentoId, finish_date)
 * @returns {Object} Registro atualizado com associações
 */
const updateUsoMoviDisp = async (id, data) => {
  const { responsavelId, equipamentoId, finish_date } = data;

  // Buscar o registro
  const record = await UsoMoviDisp.findByPk(id);
  if (!record) {
    throw new Error('UsoMoviDisp record not found');
  }

  let equipamentoAtualizado = false;
  let equipamentoAntigoId = record.equipamentoId;

  // Verificar se novo responsável existe (se fornecido)
  if (responsavelId) {
    const responsavel = await User.findByPk(responsavelId);
    if (!responsavel) {
      throw new Error('User (responsável) not found');
    }
    record.responsavelId = responsavelId;
  }

  // Verificar se novo equipamento existe (se fornecido)
  if (equipamentoId && equipamentoId !== record.equipamentoId) {
    const novoEquipamento = await Equipamento.findByPk(equipamentoId);
    if (!novoEquipamento) {
      throw new Error('Equipamento not found');
    }
    record.equipamentoId = equipamentoId;
    equipamentoAtualizado = true;
  }

  if (finish_date !== undefined) {
    record.finish_date = finish_date;
  }

  await record.save();

  // Se o equipamento foi trocado, atualizar status do novo
  if (equipamentoAtualizado) {
    const novoEquipamento = await Equipamento.findByPk(equipamentoId);
    await novoEquipamento.update({ status: 'USO' });
  }

  // Buscar registro atualizado com associações
  const updatedRecord = await UsoMoviDisp.findByPk(id, {
    include: [
      {
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Equipamento,
        as: 'equipamento',
        attributes: ['id', 'tipo', 'marca', 'modelo', 'status'],
      },
    ],
  });

  return updatedRecord;
};

/**
 * Busca todos os registros de UsoMoviDisp
 * @returns {Array} Lista de registros com associações
 */
const getAllUsoMoviDisp = async () => {
  const records = await UsoMoviDisp.findAll({
    include: [
      {
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Equipamento,
        as: 'equipamento',
        attributes: ['id', 'tipo', 'marca', 'modelo', 'status'],
      },
    ],
  });
  return records;
};

/**
 * Busca um registro de UsoMoviDisp por ID
 * @param {number} id - ID do registro
 * @returns {Object} Registro com associações
 */
const getUsoMoviDispById = async (id) => {
  const record = await UsoMoviDisp.findByPk(id, {
    include: [
      {
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Equipamento,
        as: 'equipamento',
        attributes: ['id', 'tipo', 'marca', 'modelo', 'status'],
      },
    ],
  });

  if (!record) {
    throw new Error('UsoMoviDisp record not found');
  }

  return record;
};

/**
 * Deleta um registro de UsoMoviDisp e atualiza o status do equipamento para "DISPONÍVEL"
 * @param {number} id - ID do registro
 * @returns {Object} Mensagem de sucesso
 */
const deleteUsoMoviDisp = async (id) => {
  const record = await UsoMoviDisp.findByPk(id);
  if (!record) {
    throw new Error('UsoMoviDisp record not found');
  }

  // Obter o ID do equipamento antes de deletar
  const equipamentoId = record.equipamentoId;

  // Deletar o registro
  await record.destroy();

  // Atualizar o equipamento para "DISPONÍVEL" e limpar o usuario_respId
  const equipamento = await Equipamento.findByPk(equipamentoId);
  if (equipamento) {
    await equipamento.update({
      status: 'DISPONÍVEL',
      usuario_respId: null,
    });
  }

  return { success: true, message: 'UsoMoviDisp record deleted successfully' };
};

module.exports = {
  createUsoMoviDisp,
  updateUsoMoviDisp,
  getAllUsoMoviDisp,
  getUsoMoviDispById,
  deleteUsoMoviDisp,
};
