const UsoMoviDispService = require('../services/UsoMoviDispService');

// Get all UsoMoviDisp records
const getAllUsoMoviDisp = async (req, res) => {
  try {
    const records = await UsoMoviDispService.getAllUsoMoviDisp();
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
    const record = await UsoMoviDispService.getUsoMoviDispById(req.params.id);
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
    const createdRecord = await UsoMoviDispService.createUsoMoviDisp(
      responsavelId,
      equipamentoId,
      finish_date
    );

    res.status(201).json({
      success: true,
      message: 'UsoMoviDisp record created successfully',
      data: createdRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update UsoMoviDisp record
const updateUsoMoviDisp = async (req, res) => {
  try {
    const { responsavelId, equipamentoId, finish_date } = req.body;
    const updatedRecord = await UsoMoviDispService.updateUsoMoviDisp(req.params.id, {
      responsavelId,
      equipamentoId,
      finish_date,
    });

    res.status(200).json({
      success: true,
      message: 'UsoMoviDisp record updated successfully',
      data: updatedRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete UsoMoviDisp record
const deleteUsoMoviDisp = async (req, res) => {
  try {
    const result = await UsoMoviDispService.deleteUsoMoviDisp(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
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
