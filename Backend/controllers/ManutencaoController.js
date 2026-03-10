const Manutencao = require('../models/Manutencao');
const User = require('../models/User');
const Equipamento = require('../models/Equipamento');

// Get all manutencoes
const getAllManutencoes = async (req, res) => {
  try {
    const manutencoes = await Manutencao.findAll({
      include: [
        {
          model: User,
          as: 'responsavelTecnico',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: manutencoes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get manutencao by ID
const getManutencaoById = async (req, res) => {
  try {
    const manutencao = await Manutencao.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'responsavelTecnico',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
        },
      ],
    });
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutencao not found',
      });
    }
    res.status(200).json({
      success: true,
      data: manutencao,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new manutencao
const createManutencao = async (req, res) => {
  try {
    const { equipamentoId, situacao, resumo, resp_tec, data_fim } = req.body;

    // Validate required fields
    if (!equipamentoId || !situacao || !resp_tec) {
      return res.status(400).json({
        success: false,
        message: 'equipamentoId, situacao, and resp_tec are required',
      });
    }

    // Verify equipamento exists
    const equipamento = await Equipamento.findByPk(equipamentoId);
    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: 'Equipamento not found',
      });
    }

    // Verify technician exists
    const tecnico = await User.findByPk(resp_tec);
    if (!tecnico) {
      return res.status(404).json({
        success: false,
        message: 'Responsável técnico not found',
      });
    }

    const manutencao = await Manutencao.create({
      equipamentoId,
      situacao,
      resumo,
      resp_tec,
      data_fim,
    });

    res.status(201).json({
      success: true,
      message: 'Manutencao created successfully',
      data: manutencao,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update manutencao
const updateManutencao = async (req, res) => {
  try {
    const manutencao = await Manutencao.findByPk(req.params.id);
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutencao not found',
      });
    }

    const { equipamentoId, situacao, resumo, resp_tec, data_fim } = req.body;

    // Verify equipamento if provided
    if (equipamentoId) {
      const equipamento = await Equipamento.findByPk(equipamentoId);
      if (!equipamento) {
        return res.status(404).json({
          success: false,
          message: 'Equipamento not found',
        });
      }
    }

    // Verify technician if provided
    if (resp_tec) {
      const tecnico = await User.findByPk(resp_tec);
      if (!tecnico) {
        return res.status(404).json({
          success: false,
          message: 'Responsável técnico not found',
        });
      }
    }

    if (equipamentoId) manutencao.equipamentoId = equipamentoId;
    if (situacao) manutencao.situacao = situacao;
    if (resumo) manutencao.resumo = resumo;
    if (resp_tec) manutencao.resp_tec = resp_tec;
    if (data_fim !== undefined) manutencao.data_fim = data_fim;

    await manutencao.save();

    res.status(200).json({
      success: true,
      message: 'Manutencao updated successfully',
      data: manutencao,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete manutencao
const deleteManutencao = async (req, res) => {
  try {
    const manutencao = await Manutencao.findByPk(req.params.id);
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutencao not found',
      });
    }

    await manutencao.destroy();
    res.status(200).json({
      success: true,
      message: 'Manutencao deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllManutencoes,
  getManutencaoById,
  createManutencao,
  updateManutencao,
  deleteManutencao,
};
