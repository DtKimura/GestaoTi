const UsoMoviDisp = require('../models/UsoMoviDisp');
const User = require('../models/User');
const Equipamento = require('../models/Equipamento');

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
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
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
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
        },
      ],
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'UsoMoviDisp record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
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
    const { responsavelId, equipamentoId, finish_date } = req.body;

    // Validate required fields
    if (!responsavelId || !equipamentoId) {
      return res.status(400).json({
        success: false,
        message: 'responsavelId and equipamentoId are required',
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

    // Verify if equipamento exists
    const equipamento = await Equipamento.findByPk(equipamentoId);
    if (!equipamento) {
      return res.status(404).json({
        success: false,
        message: 'Equipamento not found',
      });
    }

    // Create the record
    const record = await UsoMoviDisp.create({
      responsavelId,
      equipamentoId,
      finish_date,
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
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'UsoMoviDisp record created successfully',
      data: created_record,
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

    const { responsavelId, equipamentoId, finish_date } = req.body;

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

    // Verify if new equipamento exists (if provided)
    if (equipamentoId) {
      const equipamento = await Equipamento.findByPk(equipamentoId);
      if (!equipamento) {
        return res.status(404).json({
          success: false,
          message: 'Equipamento not found',
        });
      }
      record.equipamentoId = equipamentoId;
    }

    if (finish_date !== undefined) {
      record.finish_date = finish_date;
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
          model: Equipamento,
          as: 'equipamento',
          attributes: ['id', 'tipo', 'marca', 'modelo'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'UsoMoviDisp record updated successfully',
      data: updated_record,
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
