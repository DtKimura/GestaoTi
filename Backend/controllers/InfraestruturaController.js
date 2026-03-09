const Infraestrutura = require('../models/Infraestrutura');

// Get all Infraestrutura
const getAllInfraestrutura = async (req, res) => {
  try {
    const infraestrutura = await Infraestrutura.findAll();
    res.status(200).json({
      success: true,
      data: infraestrutura,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Infraestrutura by ID
const getInfraestruturaById = async (req, res) => {
  try {
    const infraestrutura = await Infraestrutura.findByPk(req.params.id);
    if (!infraestrutura) {
      return res.status(404).json({
        success: false,
        message: 'Infraestrutura not found',
      });
    }
    res.status(200).json({
      success: true,
      data: infraestrutura,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new Infraestrutura
const createInfraestrutura = async (req, res) => {
  try {
    const { tipo, marca, modelo, mac } = req.body;

    if (!tipo || !marca || !modelo || !mac) {
      return res.status(400).json({
        success: false,
        message: 'tipo, marca, modelo, and mac are required',
      });
    }

    const infraestrutura = await Infraestrutura.create({
      tipo,
      marca,
      modelo,
      mac,
    });

    res.status(201).json({
      success: true,
      message: 'Infraestrutura created successfully',
      data: infraestrutura,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Infraestrutura
const updateInfraestrutura = async (req, res) => {
  try {
    const infraestrutura = await Infraestrutura.findByPk(req.params.id);
    if (!infraestrutura) {
      return res.status(404).json({
        success: false,
        message: 'Infraestrutura not found',
      });
    }

    const { tipo, marca, modelo, mac } = req.body;

    if (tipo) infraestrutura.tipo = tipo;
    if (marca) infraestrutura.marca = marca;
    if (modelo) infraestrutura.modelo = modelo;
    if (mac) infraestrutura.mac = mac;

    await infraestrutura.save();

    const updated_infraestrutura = await Infraestrutura.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Infraestrutura updated successfully',
      data: updated_infraestrutura,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Infraestrutura
const deleteInfraestrutura = async (req, res) => {
  try {
    const infraestrutura = await Infraestrutura.findByPk(req.params.id);
    if (!infraestrutura) {
      return res.status(404).json({
        success: false,
        message: 'Infraestrutura not found',
      });
    }

    await infraestrutura.destroy();

    res.status(200).json({
      success: true,
      message: 'Infraestrutura deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllInfraestrutura,
  getInfraestruturaById,
  createInfraestrutura,
  updateInfraestrutura,
  deleteInfraestrutura,
};
