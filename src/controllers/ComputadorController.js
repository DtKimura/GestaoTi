const Computador = require('../models/Computador');
const User = require('../models/User');

// Get all computadores
const getAllComputadores = async (req, res) => {
  try {
    const computadores = await Computador.findAll({
      include: [{
        model: User,
        as: 'usuario_resp',
        attributes: ['id', 'name', 'email'],
      }],
    });
    res.status(200).json({
      success: true,
      data: computadores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get computador by ID
const getComputadorById = async (req, res) => {
  try {
    const computador = await Computador.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'usuario_resp',
        attributes: ['id', 'name', 'email'],
      }],
    });
    if (!computador) {
      return res.status(404).json({
        success: false,
        message: 'Computador not found',
      });
    }
    res.status(200).json({
      success: true,
      data: computador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new computador
const createComputador = async (req, res) => {
  try {
    const { hostname, localizacao_atual, setor, usuario_respId, termo, manu_prev, status, tipo, perfil_aplic } = req.body;

    if (!hostname || !localizacao_atual || !setor || !usuario_respId || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'hostname, localizacao_atual, setor, usuario_respId, and tipo are required',
      });
    }

    // Verify if user (usuario_resp) exists
    const user = await User.findByPk(usuario_respId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User (usuario_resp) not found',
      });
    }

    const computador = await Computador.create({
      hostname,
      localizacao_atual,
      setor,
      usuario_respId,
      termo: termo || 'ATIVO',
      manu_prev,
      status: status || 'OPERACIONAL',
      tipo,
      perfil_aplic,
    });

    const computador_with_user = await Computador.findByPk(computador.id, {
      include: [{
        model: User,
        as: 'usuario_resp',
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Computador created successfully',
      data: computador_with_user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update computador
const updateComputador = async (req, res) => {
  try {
    const computador = await Computador.findByPk(req.params.id);
    if (!computador) {
      return res.status(404).json({
        success: false,
        message: 'Computador not found',
      });
    }

    const { hostname, localizacao_atual, setor, usuario_respId, termo, manu_prev, status, tipo, perfil_aplic } = req.body;

    // Verify if new usuario_resp exists (if provided)
    if (usuario_respId) {
      const user = await User.findByPk(usuario_respId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User (usuario_resp) not found',
        });
      }
      computador.usuario_respId = usuario_respId;
    }

    if (hostname) computador.hostname = hostname;
    if (localizacao_atual) computador.localizacao_atual = localizacao_atual;
    if (setor) computador.setor = setor;
    if (termo) computador.termo = termo;
    if (manu_prev) computador.manu_prev = manu_prev;
    if (status) computador.status = status;
    if (tipo) computador.tipo = tipo;
    if (perfil_aplic) computador.perfil_aplic = perfil_aplic;

    await computador.save();

    const updated_computador = await Computador.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'usuario_resp',
        attributes: ['id', 'name', 'email'],
      }],
    });

    res.status(200).json({
      success: true,
      message: 'Computador updated successfully',
      data: updated_computador,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete computador
const deleteComputador = async (req, res) => {
  try {
    const computador = await Computador.findByPk(req.params.id);
    if (!computador) {
      return res.status(404).json({
        success: false,
        message: 'Computador not found',
      });
    }

    await computador.destroy();
    res.status(200).json({
      success: true,
      message: 'Computador deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllComputadores,
  getComputadorById,
  createComputador,
  updateComputador,
  deleteComputador,
};
