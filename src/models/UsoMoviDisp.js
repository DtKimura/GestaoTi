const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Equipamento = require('./Equipamento');

const UsoMoviDisp = sequelize.define('UsoMoviDisp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  responsavelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  finish_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
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
  tableName: 'uso_movi_disps',
  timestamps: false,
});

// Define relationships
UsoMoviDisp.belongsTo(User, {
  foreignKey: 'responsavelId',
  as: 'responsavel',
});

UsoMoviDisp.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

User.hasMany(UsoMoviDisp, {
  foreignKey: 'responsavelId',
});

Equipamento.hasMany(UsoMoviDisp, {
  foreignKey: 'equipamentoId',
});

module.exports = UsoMoviDisp;
