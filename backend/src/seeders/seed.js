require('dotenv').config();
const { sequelize, User, Field, FieldUpdate } = require('../models');

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

async function seed() {
  await sequelize.authenticate();
  console.log('Connected to database...');
  await sequelize.sync({ force: true });
  console.log('Tables recreated.');

  // ── Users ──────────────────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin Coordinator',
    email: 'admin@smartseason.com',
    password: 'admin123',
    role: 'admin',
  });

  const agents = await User.bulkCreate([
    { name: 'James Mwangi',   email: 'james@smartseason.com',  password: 'agent123', role: 'agent' },
    { name: 'Sarah Kimani',   email: 'sarah@smartseason.com',  password: 'agent123', role: 'agent' },
    { name: 'David Ochieng',  email: 'david@smartseason.com',  password: 'agent123', role: 'agent' },
    { name: 'Grace Wanjiru',  email: 'grace@smartseason.com',  password: 'agent123', role: 'agent' },
  ], { individualHooks: true });

  const [james, sarah, david, grace] = agents;

  // ── Fields ─────────────────────────────────────────────────────
  const fieldDefs = [
    // James – 2 fields (one at risk due to stale update)
    {
      name: 'North Plot A', cropType: 'Maize', plantingDate: '2025-11-10',
      stage: 'growing', assignedAgentId: james.id, location: 'Nakuru North Zone',
      areaHectares: 5.2, lastUpdatedAt: daysAgo(2),
    },
    {
      name: 'South Plot B', cropType: 'Wheat', plantingDate: '2025-12-01',
      stage: 'planted', assignedAgentId: james.id, location: 'Nakuru South Zone',
      areaHectares: 3.1, lastUpdatedAt: daysAgo(9), // 9 days → at_risk
    },
    // Sarah – 2 fields (one ready, one harvested)
    {
      name: 'East Field 1', cropType: 'Beans', plantingDate: '2025-10-05',
      stage: 'ready', assignedAgentId: sarah.id, location: 'Eldoret East',
      areaHectares: 2.8, lastUpdatedAt: daysAgo(1),
    },
    {
      name: 'West Plot C', cropType: 'Sorghum', plantingDate: '2025-08-01',
      stage: 'harvested', assignedAgentId: sarah.id, location: 'Eldoret West',
      areaHectares: 4.5, lastUpdatedAt: daysAgo(5),
    },
    // David – 2 fields (one at risk – growing too long)
    {
      name: 'Central Farm D', cropType: 'Maize', plantingDate: '2025-09-01',
      stage: 'growing', assignedAgentId: david.id, location: 'Kisumu Central',
      areaHectares: 6.0, lastUpdatedAt: daysAgo(10), // stale → at_risk
    },
    {
      name: 'River Plot E', cropType: 'Rice', plantingDate: '2025-12-15',
      stage: 'planted', assignedAgentId: david.id, location: 'Kisumu River Zone',
      areaHectares: 3.7, lastUpdatedAt: daysAgo(0),
    },
    // Grace – 2 fields
    {
      name: 'Highlands F', cropType: 'Pyrethrum', plantingDate: '2025-11-20',
      stage: 'growing', assignedAgentId: grace.id, location: 'Nyeri Highlands',
      areaHectares: 2.0, lastUpdatedAt: daysAgo(3),
    },
    {
      name: 'Valley Plot G', cropType: 'Sunflower', plantingDate: '2025-10-01',
      stage: 'ready', assignedAgentId: grace.id, location: 'Nyeri Valley',
      areaHectares: 4.1, lastUpdatedAt: daysAgo(1),
    },
  ];

  for (const def of fieldDefs) {
    const field = await Field.create(def);

    // Seed a couple of updates per field to simulate history
    await FieldUpdate.create({
      fieldId: field.id, agentId: def.assignedAgentId,
      stage: 'planted',
      notes: 'Seeds sown. Soil moisture looks good after recent rains.',
      createdAt: new Date(def.plantingDate),
    });

    if (['growing', 'ready', 'harvested'].includes(def.stage)) {
      await FieldUpdate.create({
        fieldId: field.id, agentId: def.assignedAgentId,
        stage: 'growing',
        notes: 'Germination confirmed. About 85% emergence rate. Applying first round of fertiliser.',
        createdAt: new Date(new Date(def.plantingDate).getTime() + 20 * 86_400_000),
      });
    }

    if (['ready', 'harvested'].includes(def.stage)) {
      await FieldUpdate.create({
        fieldId: field.id, agentId: def.assignedAgentId,
        stage: 'ready',
        notes: 'Crop looks mature and ready for harvest. Arranging transport.',
        createdAt: daysAgo(7),
      });
    }

    if (def.stage === 'harvested') {
      await FieldUpdate.create({
        fieldId: field.id, agentId: def.assignedAgentId,
        stage: 'harvested',
        notes: 'Harvest completed successfully. Yield was above average this season.',
        createdAt: daysAgo(5),
      });
    }
  }

  console.log('\n✅ Database seeded successfully!\n');
  console.log('── Demo Credentials ───────────────────────────────');
  console.log('Admin :  admin@smartseason.com  /  admin123');
  console.log('Agent :  james@smartseason.com  /  agent123');
  console.log('Agent :  sarah@smartseason.com  /  agent123');
  console.log('Agent :  david@smartseason.com  /  agent123');
  console.log('Agent :  grace@smartseason.com  /  agent123');
  console.log('───────────────────────────────────────────────────\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});