const Celular = require('../models/Celular');
const User = require('../models/User');

// Get all celulares
const getAllCelulares = async (req, res) => {
  try {
    const celulares = await Celular.findAll({
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'resp_tec',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'usuario_ant',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(200).json({
      success: true,
      data: celulares,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get celular by ID
const getCelularById = async (req, res) => {
  try {
    const celular = await Celular.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'resp_tec',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'usuario_ant',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!celular) {
      return res.status(404).json({
        success: false,
        message: 'Celular not found',
      });
    }
    res.status(200).json({
      success: true,
      data: celular,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new celular
const createCelular = async (req, res) => {
  try {
    const {
      usuario_respId,
      status,
      estoque,
      observacoes,
      termo,
      marca,
      modelo,
      processador,
      memoria,
      armazenamento,
      so,
      mac,
      imei_1,
      imei_2,
      numero,
      email_google,
      senha_google,
      perfil,
      num_manutencao,
      resp_tecId,
      usuario_antId,
      data_devolucao,
    } = req.body;

    if (!usuario_respId || !marca || !modelo) {
      return res.status(400).json({
        success: false,
        message: 'usuario_respId, marca, and modelo are required',
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

    // Verify if resp_tec exists (if provided)
    if (resp_tecId) {
      const respTec = await User.findByPk(resp_tecId);
      if (!respTec) {
        return res.status(404).json({
          success: false,
          message: 'User (resp_tec) not found',
        });
      }
    }

    // Verify if usuario_ant exists (if provided)
    if (usuario_antId) {
      const usuarioAnt = await User.findByPk(usuario_antId);
      if (!usuarioAnt) {
        return res.status(404).json({
          success: false,
          message: 'User (usuario_ant) not found',
        });
      }
    }

    const celular = await Celular.create({
      usuario_respId,
      status: status || 'ATIVO',
      estoque,
      observacoes,
      termo: termo || 'ATIVO',
      marca,
      modelo,
      processador,
      memoria,
      armazenamento,
      so,
      mac,
      imei_1,
      imei_2,
      numero,
      email_google,
      senha_google,
      perfil,
      num_manutencao: num_manutencao || 0,
      resp_tecId,
      usuario_antId,
      data_devolucao,
    });

    const celular_with_users = await Celular.findByPk(celular.id, {
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'resp_tec',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'usuario_ant',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Celular created successfully',
      data: celular_with_users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update celular
const updateCelular = async (req, res) => {
  try {
    const celular = await Celular.findByPk(req.params.id);
    if (!celular) {
      return res.status(404).json({
        success: false,
        message: 'Celular not found',
      });
    }

    const {
      usuario_respId,
      status,
      estoque,
      observacoes,
      termo,
      marca,
      modelo,
      processador,
      memoria,
      armazenamento,
      so,
      mac,
      imei_1,
      imei_2,
      numero,
      email_google,
      senha_google,
      perfil,
      num_manutencao,
      resp_tecId,
      usuario_antId,
      data_devolucao,
    } = req.body;

    // Verify foreign keys if provided
    if (usuario_respId) {
      const user = await User.findByPk(usuario_respId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User (usuario_resp) not found',
        });
      }
      celular.usuario_respId = usuario_respId;
    }

    if (resp_tecId) {
      const respTec = await User.findByPk(resp_tecId);
      if (!respTec) {
        return res.status(404).json({
          success: false,
          message: 'User (resp_tec) not found',
        });
      }
      celular.resp_tecId = resp_tecId;
    }

    if (usuario_antId) {
      const usuarioAnt = await User.findByPk(usuario_antId);
      if (!usuarioAnt) {
        return res.status(404).json({
          success: false,
          message: 'User (usuario_ant) not found',
        });
      }
      celular.usuario_antId = usuario_antId;
    }

    // Update all fields if provided
    if (status) celular.status = status;
    if (estoque) celular.estoque = estoque;
    if (observacoes) celular.observacoes = observacoes;
    if (termo) celular.termo = termo;
    if (marca) celular.marca = marca;
    if (modelo) celular.modelo = modelo;
    if (processador) celular.processador = processador;
    if (memoria) celular.memoria = memoria;
    if (armazenamento) celular.armazenamento = armazenamento;
    if (so) celular.so = so;
    if (mac) celular.mac = mac;
    if (imei_1) celular.imei_1 = imei_1;
    if (imei_2) celular.imei_2 = imei_2;
    if (numero) celular.numero = numero;
    if (email_google) celular.email_google = email_google;
    if (senha_google) celular.senha_google = senha_google;
    if (perfil) celular.perfil = perfil;
    if (num_manutencao !== undefined) celular.num_manutencao = num_manutencao;
    if (data_devolucao) celular.data_devolucao = data_devolucao;

    await celular.save();

    const updated_celular = await Celular.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'usuario_resp',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'resp_tec',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'usuario_ant',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Celular updated successfully',
      data: updated_celular,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete celular
const deleteCelular = async (req, res) => {
  try {
    const celular = await Celular.findByPk(req.params.id);
    if (!celular) {
      return res.status(404).json({
        success: false,
        message: 'Celular not found',
      });
    }

    await celular.destroy();
    res.status(200).json({
      success: true,
      message: 'Celular deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCelulares,
  getCelularById,
  createCelular,
  updateCelular,
  deleteCelular,
};
