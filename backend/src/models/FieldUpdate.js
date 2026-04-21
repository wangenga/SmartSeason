const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { STAGES } = require('./Field');

const FieldUpdate = sequelize.define('FieldUpdate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fieldId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM(...STAGES),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = FieldUpdate;