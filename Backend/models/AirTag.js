const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AirTag = sequelize.define('AirTag', {
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
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
  },
}, {
  tableName: 'airtags',
  timestamps: false,
});

// Define relationships
AirTag.belongsTo(User, {
  foreignKey: 'responsavelId',
  as: 'responsavel',
});

User.hasMany(AirTag, {
  foreignKey: 'responsavelId',
});

module.exports = AirTag;
