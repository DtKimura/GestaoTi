const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Computador = sequelize.define('Computador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hostname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  localizacao_atual: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  setor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario_respId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  termo: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO', 'MANUTENÇÃO', 'DESCONTINUADO'),
    allowNull: false,
    defaultValue: 'ATIVO',
  },
  manu_prev: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'OPERACIONAL',
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  perfil_aplic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'computadores',
  timestamps: false,
});

// Define relationships
Computador.belongsTo(User, {
  foreignKey: 'usuario_respId',
  as: 'usuario_resp',
});

User.hasMany(Computador, {
  foreignKey: 'usuario_respId',
});

module.exports = Computador;
