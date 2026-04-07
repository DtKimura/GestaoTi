const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Equipamento = require('./Equipamento');

const Celular = sequelize.define('Celular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  equipamentoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Equipamento,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ATIVO',
  },
  estoque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  termo: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO', 'DESCONTINUADO', 'REPARANDO'),
    allowNull: false,
    defaultValue: 'ATIVO',
  },
  processador: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  memoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  armazenamento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  so: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mac: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: 'unique_mac_device',
  },
  imei_1: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: 'unique_imei1_device',
  },
  imei_2: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: 'unique_imei2_device',
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_google: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senha_google: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  perfil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  num_manutencao: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  resp_tecId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  usuario_antId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  data_devolucao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'celulares',
  timestamps: false,
});

// Define relationships
Celular.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

Equipamento.hasMany(Celular, {
  foreignKey: 'equipamentoId',
});

Celular.belongsTo(User, {
  foreignKey: 'resp_tecId',
  as: 'resp_tec',
});

Celular.belongsTo(User, {
  foreignKey: 'usuario_antId',
  as: 'usuario_ant',
});

User.hasMany(Celular, {
  foreignKey: 'resp_tecId',
  as: 'celularesResponsavel',
});

User.hasMany(Celular, {
  foreignKey: 'usuario_antId',
  as: 'celularesAnterior',
});

module.exports = Celular;
