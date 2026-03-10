const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipamento = require('./Equipamento');

const Infraestrutura = sequelize.define('Infraestrutura', {
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
  mac: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'infraestruturas',
  timestamps: false,
});

// Define relationships
Infraestrutura.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

Equipamento.hasMany(Infraestrutura, {
  foreignKey: 'equipamentoId',
});

module.exports = Infraestrutura;
