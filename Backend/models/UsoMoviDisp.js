const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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
  },
  equipamentoType: {
    type: DataTypes.ENUM('Celular', 'Computador', 'AirTag'),
    allowNull: false,
  },
  origemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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

UsoMoviDisp.belongsTo(User, {
  foreignKey: 'origemId',
  as: 'origem',
});

User.hasMany(UsoMoviDisp, {
  foreignKey: 'responsavelId',
});

User.hasMany(UsoMoviDisp, {
  foreignKey: 'origemId',
});

module.exports = UsoMoviDisp;
