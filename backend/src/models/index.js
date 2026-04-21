const sequelize  = require('../config/database');
const User       = require('./User');
const { Field }  = require('./Field');
const FieldUpdate = require('./FieldUpdate');

// ── Associations ──────────────────────────────────────────────────
Field.belongsTo(User, { as: 'agent', foreignKey: 'assignedAgentId' });
User.hasMany(Field,   { as: 'fields', foreignKey: 'assignedAgentId' });

FieldUpdate.belongsTo(Field, { foreignKey: 'fieldId' });
Field.hasMany(FieldUpdate,   { as: 'updates', foreignKey: 'fieldId' });

FieldUpdate.belongsTo(User, { as: 'agent', foreignKey: 'agentId' });

module.exports = { sequelize, User, Field, FieldUpdate };