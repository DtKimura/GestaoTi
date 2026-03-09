const UsoMoviDisp = require('../models/UsoMoviDisp');
const User = require('../models/User');
const Celular = require('../models/Celular');
const Computador = require('../models/Computador');
const AirTag = require('../models/AirTag');

// Get all UsoMoviDisp records
const getAllUsoMoviDisp = async (req, res) => {
  try {
    const records = await UsoMoviDisp.findAll({
      include: [
        {
          model: User,
          as: 'responsavel',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'origem',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get UsoMoviDisp by ID
const getUsoMoviDispById = async (req, res) => {
  try {
    const record = await UsoMoviDisp.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'responsavel',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'origem',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'UsoMoviDisp record not found',
      });
    }

    // Get the equipamento based on type
    let equipamento = null;
    if (record.equipamentoType === 'Celular') {
      equipamento = await Celular.findByPk(record.equipamentoId);
    } else if (record.equipamentoType === 'Computador') {
      equipamento = await Computador.findByPk(record.equipamentoId);
    } else if (record.equipamentoType === 'AirTag') {
      equipamento = await AirTag.findByPk(record.equipamentoId);
    }

    const responseData = {
      ...record.toJSON(),
      equipamento,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new UsoMoviDisp record
const createUsoMoviDisp = async (req, res) => {
  try {
    const { responsavelId, equipamentoId, equipamentoType, origemId } = req.body;

    // Validate required fields
    if (!responsavelId || !equipamentoId || !equipamentoType || !origemId) {
      return res.status(400).json({
        success: false,
        message: 'responsavelId, equipamentoId, equipamentoType, and origemId are required',
      });
    }

    // Validate equipamentoType
    if (!['Celular', 'Computador', 'AirTag'].includes(equipamentoType)) {
      return res.status(400).json({
        success: false,
        message: 'equipamentoType must be one of: Celular, Computador, AirTag',
      });
    }

    // Verify if responsável (User) exists
    const responsavel = await User.findByPk(responsavelId);
    if (!responsavel) {
      return res.status(404).json({
        success: false,
        message: 'User (responsável) not found',
      });
    }

    // Verify if origem (User) exists
    const origem = await User.findByPk(origemId);
    if (!origem) {
      return res.status(404).json({
        success: false,
        message: 'User (origem) not found',
      });
    }

    // Verify if equipamento exists
    let equipamento = null;
    if (equipamentoType === 'Celular') {
      equipamento = await Celular.findByPk(equipamentoId);
    } else if (equipamentoType === 'Computador') {
      equipamento = await Computador.findByPk(equipamentoId);
    } else if (equipamentoType === 'AirTag') {
      equipamento = await AirTag.findByPk(equipamentoId);
    }

    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: `${equipamentoType} with id ${equipamentoId} not found`,
      });
    }

    // Create the record
    const record = await UsoMoviDisp.create({
      responsavelId,
      equipamentoId,
      equipamentoType,
      origemId,
    });

    // Fetch with associations
    const created_record = await UsoMoviDisp.findByPk(record.id, {
      include: [
        {
          model: User,
          as: 'responsavel',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'origem',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const responseData = {
      ...created_record.toJSON(),
      equipamento,
    };

    res.status(201).json({
      success: true,
      message: 'UsoMoviDisp record created successfully',
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update UsoMoviDisp record
const updateUsoMoviDisp = async (req, res) => {
  try {
    const record = await UsoMoviDisp.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'UsoMoviDisp record not found',
      });
    }

    const { responsavelId, equipamentoId, equipamentoType, origemId } = req.body;

    // Verify if new responsável exists (if provided)
    if (responsavelId) {
      const responsavel = await User.findByPk(responsavelId);
      if (!responsavel) {
        return res.status(404).json({
          success: false,
          message: 'User (responsável) not found',
        });
      }
      record.responsavelId = responsavelId;
    }

    // Verify if new origem exists (if provided)
    if (origemId) {
      const origem = await User.findByPk(origemId);
      if (!origem) {
        return res.status(404).json({
          success: false,
          message: 'User (origem) not found',
        });
      }
      record.origemId = origemId;
    }

    // Verify if new equipamento exists (if provided)
    if (equipamentoId && equipamentoType) {
      if (!['Celular', 'Computador', 'AirTag'].includes(equipamentoType)) {
        return res.status(400).json({
          success: false,
          message: 'equipamentoType must be one of: Celular, Computador, AirTag',
        });
      }

      let equipamento = null;
      if (equipamentoType === 'Celular') {
        equipamento = await Celular.findByPk(equipamentoId);
      } else if (equipamentoType === 'Computador') {
        equipamento = await Computador.findByPk(equipamentoId);
      } else if (equipamentoType === 'AirTag') {
        equipamento = await AirTag.findByPk(equipamentoId);
      }

      if (!equipamento) {
        return res.status(404).json({
          success: false,
          message: `${equipamentoType} with id ${equipamentoId} not found`,
        });
      }

      record.equipamentoId = equipamentoId;
      record.equipamentoType = equipamentoType;
    }

    await record.save();

    // Fetch updated record with associations
    const updated_record = await UsoMoviDisp.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'responsavel',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'origem',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Get the equipamento
    let equipamento = null;
    if (updated_record.equipamentoType === 'Celular') {
      equipamento = await Celular.findByPk(updated_record.equipamentoId);
    } else if (updated_record.equipamentoType === 'Computador') {
      equipamento = await Computador.findByPk(updated_record.equipamentoId);
    } else if (updated_record.equipamentoType === 'AirTag') {
      equipamento = await AirTag.findByPk(updated_record.equipamentoId);
    }

    const responseData = {
      ...updated_record.toJSON(),
      equipamento,
    };

    res.status(200).json({
      success: true,
      message: 'UsoMoviDisp record updated successfully',
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete UsoMoviDisp record
const deleteUsoMoviDisp = async (req, res) => {
  try {
    const record = await UsoMoviDisp.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'UsoMoviDisp record not found',
      });
    }

    await record.destroy();

    res.status(200).json({
      success: true,
      message: 'UsoMoviDisp record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsoMoviDisp,
  getUsoMoviDispById,
  createUsoMoviDisp,
  updateUsoMoviDisp,
  deleteUsoMoviDisp,
};
