const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Equipamento = require('./Equipamento');

const Manutencao = sequelize.define('Manutencao', {
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
  situacao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resumo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resp_tec: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  data_fim: {
    type: DataTypes.DATE,
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
  tableName: 'manutencoes',
  timestamps: false,
});

// Define relationships
Manutencao.belongsTo(User, {
  foreignKey: 'resp_tec',
  as: 'responsavelTecnico',
});

Manutencao.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

User.hasMany(Manutencao, {
  foreignKey: 'resp_tec',
});

Equipamento.hasMany(Manutencao, {
  foreignKey: 'equipamentoId',
});

module.exports = Manutencao;
