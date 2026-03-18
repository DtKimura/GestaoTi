const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Equipamento = sequelize.define('Equipamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo: {
    type: DataTypes.ENUM('Celular', 'Computador', 'AirTag', 'Infraestrutura'),
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('USO', 'DISPONÍVEL', 'MANUTENÇÃO', 'DESCONTINUADO'),
    allowNull: false,
    defaultValue: 'DISPONÍVEL',
  },
  usuario_respId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'equipamentos',
  timestamps: false,
});

// Define relationships
Equipamento.belongsTo(User, {
  foreignKey: 'usuario_respId',
  as: 'usuario_resp',
});

User.hasMany(Equipamento, {
  foreignKey: 'usuario_respId',
});

module.exports = Equipamento;
