const AirTag = require('../models/AirTag');
const User = require('../models/User');

// Get all AirTags
const getAllAirTags = async (req, res) => {
  try {
    const airtags = await AirTag.findAll({
      include: [{
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      }],
    });
    res.status(200).json({
      success: true,
      data: airtags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get AirTag by ID
const getAirTagById = async (req, res) => {
  try {
    const airtag = await AirTag.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      }],
    });
    if (!airtag) {
      return res.status(404).json({
        success: false,
        message: 'AirTag not found',
      });
    }
    res.status(200).json({
      success: true,
      data: airtag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new AirTag
const createAirTag = async (req, res) => {
  try {
    const { responsavelId, placa, modelo, renavan, airtag_ok } = req.body;

    if (!responsavelId || !placa || !modelo || renavan === undefined) {
      return res.status(400).json({
        success: false,
        message: 'responsavelId, placa, modelo, and renavan are required',
      });
    }

    // Verify if user (responsável) exists
    const user = await User.findByPk(responsavelId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User (responsável) not found',
      });
    }

    const airtag = await AirTag.create({
      responsavelId,
      placa,
      modelo,
      renavan,
      airtag_ok: airtag_ok !== undefined ? airtag_ok : true,
    });

    const airtag_with_user = await AirTag.findByPk(airtag.id, {
      include: [{
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'AirTag created successfully',
      data: airtag_with_user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update AirTag
const updateAirTag = async (req, res) => {
  try {
    const airtag = await AirTag.findByPk(req.params.id);
    if (!airtag) {
      return res.status(404).json({
        success: false,
        message: 'AirTag not found',
      });
    }

    const { responsavelId, placa, modelo, renavan, airtag_ok } = req.body;

    // Verify if new responsável exists (if provided)
    if (responsavelId) {
      const user = await User.findByPk(responsavelId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User (responsável) not found',
        });
      }
      airtag.responsavelId = responsavelId;
    }

    if (placa) airtag.placa = placa;
    if (modelo) airtag.modelo = modelo;
    if (renavan) airtag.renavan = renavan;
    if (airtag_ok !== undefined) airtag.airtag_ok = airtag_ok;

    await airtag.save();

    const updated_airtag = await AirTag.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'responsavel',
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(200).json({
      success: true,
      message: 'AirTag updated successfully',
      data: updated_airtag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete AirTag
const deleteAirTag = async (req, res) => {
  try {
    const airtag = await AirTag.findByPk(req.params.id);
    if (!airtag) {
      return res.status(404).json({
        success: false,
        message: 'AirTag not found',
      });
    }

    await airtag.destroy();
    res.status(200).json({
      success: true,
      message: 'AirTag deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllAirTags,
  getAirTagById,
  createAirTag,
  updateAirTag,
  deleteAirTag,
};
