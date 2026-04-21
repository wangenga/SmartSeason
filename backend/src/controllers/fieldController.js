const { Field, FieldUpdate, User } = require('../models');

// ── helpers ───────────────────────────────────────────────────────
const agentAttrs  = ['id', 'name', 'email'];
const agentInclude = { model: User, as: 'agent', attributes: agentAttrs };

const serialize = (field) => field.toJSONWithStatus();

// ── GET /api/fields  (admin → all | agent → own) ──────────────────
exports.listFields = async (req, res) => {
  try {
    const where = req.user.role === 'agent' ? { assignedAgentId: req.user.id } : {};
    const fields = await Field.findAll({
      where,
      include: [agentInclude],
      order: [['createdAt', 'DESC']],
    });
    res.json(fields.map(serialize));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/fields/:id ───────────────────────────────────────────
exports.getField = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id, {
      include: [
        agentInclude,
        {
          model: FieldUpdate,
          as: 'updates',
          include: [{ model: User, as: 'agent', attributes: agentAttrs }],
          order: [['createdAt', 'DESC']],
          limit: 30,
        },
      ],
    });
    if (!field) return res.status(404).json({ message: 'Field not found' });
    if (req.user.role === 'agent' && field.assignedAgentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(serialize(field));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── POST /api/fields  (admin only) ───────────────────────────────
exports.createField = async (req, res) => {
  try {
    const { name, cropType, plantingDate, stage, assignedAgentId, location, areaHectares } = req.body;
    if (!name || !cropType || !plantingDate) {
      return res.status(400).json({ message: 'name, cropType and plantingDate are required' });
    }
    const field = await Field.create({
      name, cropType, plantingDate,
      stage: stage || 'planted',
      assignedAgentId: assignedAgentId || null,
      location, areaHectares,
      lastUpdatedAt: new Date(),
    });
    const populated = await Field.findByPk(field.id, { include: [agentInclude] });
    res.status(201).json(serialize(populated));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── PUT /api/fields/:id  (admin only) ────────────────────────────
exports.updateField = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    const { name, cropType, plantingDate, stage, assignedAgentId, location, areaHectares } = req.body;
    await field.update({ name, cropType, plantingDate, stage, assignedAgentId, location, areaHectares });

    const populated = await Field.findByPk(field.id, { include: [agentInclude] });
    res.json(serialize(populated));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── DELETE /api/fields/:id  (admin only) ─────────────────────────
exports.deleteField = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    await FieldUpdate.destroy({ where: { fieldId: field.id } });
    await field.destroy();
    res.json({ message: 'Field deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── POST /api/fields/:id/updates ─────────────────────────────────
exports.addUpdate = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });

    if (req.user.role === 'agent' && field.assignedAgentId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { stage, notes } = req.body;
    if (!stage) return res.status(400).json({ message: 'stage is required' });

    const update = await FieldUpdate.create({
      fieldId: field.id,
      agentId: req.user.id,
      stage,
      notes: notes || null,
    });

    await field.update({ stage, lastUpdatedAt: new Date() });

    const populated = await FieldUpdate.findByPk(update.id, {
      include: [{ model: User, as: 'agent', attributes: agentAttrs }],
    });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── GET /api/fields/dashboard ────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const where = req.user.role === 'agent' ? { assignedAgentId: req.user.id } : {};
    const fields = await Field.findAll({
      where,
      include: [agentInclude],
      order: [['createdAt', 'DESC']],
    });

    const serialized = fields.map(serialize);

    const byStage  = { planted: 0, growing: 0, ready: 0, harvested: 0 };
    const byStatus = { active: 0, at_risk: 0, completed: 0 };

    serialized.forEach((f) => {
      byStage[f.stage]   = (byStage[f.stage]   || 0) + 1;
      byStatus[f.status] = (byStatus[f.status]  || 0) + 1;
    });

    // Recent updates (last 10 across all relevant fields)
    const fieldIds = serialized.map((f) => f.id);
    let recentUpdates = [];
    if (fieldIds.length > 0) {
      recentUpdates = await FieldUpdate.findAll({
        where: { fieldId: fieldIds },
        include: [
          { model: User, as: 'agent', attributes: agentAttrs },
          { model: Field, attributes: ['id', 'name', 'cropType'] },
        ],
        order: [['createdAt', 'DESC']],
        limit: 10,
      });
    }

    res.json({
      total: serialized.length,
      byStage,
      byStatus,
      fields: serialized,
      recentUpdates,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};