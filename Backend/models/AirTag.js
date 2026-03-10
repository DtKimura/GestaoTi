const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipamento = require('./Equipamento');

const AirTag = sequelize.define('AirTag', {
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
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  renavan: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO', 'PENDENTE'),
    allowNull: false,
    defaultValue: 'ATIVO',
  },
  airtag_ok: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'airtags',
  timestamps: false,
});

// Define relationships
AirTag.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

Equipamento.hasMany(AirTag, {
  foreignKey: 'equipamentoId',
});

module.exports = AirTag;
