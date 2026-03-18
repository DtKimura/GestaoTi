const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Equipamento = require('./Equipamento');

const Computador = sequelize.define('Computador', {
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
  termo: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO', 'MANUTENÇÃO', 'DESCONTINUADO'),
    allowNull: false,
    defaultValue: 'ATIVO',
  },
  perfil_aplic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'computadores',
  timestamps: false,
});

// Define relationships
Computador.belongsTo(Equipamento, {
  foreignKey: 'equipamentoId',
  as: 'equipamento',
});

Equipamento.hasMany(Computador, {
  foreignKey: 'equipamentoId',
});

module.exports = Computador;
