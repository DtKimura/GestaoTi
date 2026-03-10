const Equipamento = require('../models/Equipamento');
const User = require('../models/User');

// Get all equipamentos
const getAllEquipamentos = async (req, res) => {
  try {
    const equipamentos = await Equipamento.findAll({
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: equipamentos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get equipamento by ID
const getEquipamentoById = async (req, res) => {
  try {
    const equipamento = await Equipamento.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: 'Equipamento not found',
      });
    }
    res.status(200).json({
      success: true,
      data: equipamento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get equipamentos by type
const getEquipamentosByType = async (req, res) => {
  try {
    const { tipo } = req.params;
    const validTypes = ['Celular', 'Computador', 'AirTag', 'Infraestrutura'];

    if (!validTypes.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tipo. Must be one of: Celular, Computador, AirTag, Infraestrutura',
      });
    }

    const equipamentos = await Equipamento.findAll({
      where: { tipo },
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: equipamentos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new equipamento
const createEquipamento = async (req, res) => {
  try {
    const { tipo, marca, modelo, usuario_respId } = req.body;

    // Validate required fields
    if (!tipo || !marca || !modelo) {
      return res.status(400).json({
        success: false,
        message: 'tipo, marca, and modelo are required',
      });
    }

    // Validate tipo
    const validTypes = ['Celular', 'Computador', 'AirTag', 'Infraestrutura'];
    if (!validTypes.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tipo. Must be one of: Celular, Computador, AirTag, Infraestrutura',
      });
    }

    // Verify user if provided
    if (usuario_respId) {
      const user = await User.findByPk(usuario_respId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    const equipamento = await Equipamento.create({
      tipo,
      marca,
      modelo,
      usuario_respId,
    });

    res.status(201).json({
      success: true,
      message: 'Equipamento created successfully',
      data: equipamento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update equipamento
const updateEquipamento = async (req, res) => {
  try {
    const equipamento = await Equipamento.findByPk(req.params.id);
    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: 'Equipamento not found',
      });
    }

    const { tipo, marca, modelo, usuario_respId } = req.body;

    // Validate tipo if provided
    if (tipo) {
      const validTypes = ['Celular', 'Computador', 'AirTag', 'Infraestrutura'];
      if (!validTypes.includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tipo. Must be one of: Celular, Computador, AirTag, Infraestrutura',
        });
      }
    }

    // Verify user if provided
    if (usuario_respId) {
      const user = await User.findByPk(usuario_respId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    if (tipo) equipamento.tipo = tipo;
    if (marca) equipamento.marca = marca;
    if (modelo) equipamento.modelo = modelo;
    if (usuario_respId !== undefined) equipamento.usuario_respId = usuario_respId;

    await equipamento.save();

    res.status(200).json({
      success: true,
      message: 'Equipamento updated successfully',
      data: equipamento,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete equipamento
const deleteEquipamento = async (req, res) => {
  try {
    const equipamento = await Equipamento.findByPk(req.params.id);
    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: 'Equipamento not found',
      });
    }

    await equipamento.destroy();
    res.status(200).json({
      success: true,
      message: 'Equipamento deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllEquipamentos,
  getEquipamentoById,
  getEquipamentosByType,
  createEquipamento,
  updateEquipamento,
  deleteEquipamento,
};
