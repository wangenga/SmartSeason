const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STAGES = ['planted', 'growing', 'ready', 'harvested'];

/**
 * STATUS LOGIC
 * ─────────────────────────────────────────────────────────────────
 * completed  → stage is 'harvested'
 * at_risk    → ANY of:
 *               • No field update in ≥ 7 days (stale monitoring)
 *               • Stage is 'planted' and ≥ 30 days have passed  (germination concern)
 *               • Stage is 'growing' and ≥ 90 days since planting (growth stall)
 * active     → everything else
 * ─────────────────────────────────────────────────────────────────
 */
const computeStatus = (field) => {
  if (field.stage === 'harvested') return 'completed';

  const now          = Date.now();
  const lastUpdate   = field.lastUpdatedAt ? new Date(field.lastUpdatedAt).getTime() : new Date(field.createdAt).getTime();
  const plantingMs   = new Date(field.plantingDate).getTime();
  const daysSinceUpdate   = Math.floor((now - lastUpdate)  / 86_400_000);
  const daysSincePlanting = Math.floor((now - plantingMs)  / 86_400_000);

  if (daysSinceUpdate   >= 7)                                      return 'at_risk';
  if (field.stage === 'planted' && daysSincePlanting >= 30)        return 'at_risk';
  if (field.stage === 'growing' && daysSincePlanting >= 90)        return 'at_risk';

  return 'active';
};

const Field = sequelize.define('Field', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  cropType: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  plantingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  stage: {
    type: DataTypes.ENUM(...STAGES),
    defaultValue: 'planted',
  },
  assignedAgentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  areaHectares: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lastUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Field.prototype.getStatus = function () {
  return computeStatus(this);
};

Field.prototype.toJSONWithStatus = function () {
  return { ...this.toJSON(), status: this.getStatus() };
};

module.exports = { Field, STAGES, computeStatus };