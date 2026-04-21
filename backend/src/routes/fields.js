const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/fieldController');

router.use(authenticate);

router.get('/dashboard', ctrl.getDashboard);
router.get('/',          ctrl.listFields);
router.get('/:id',       ctrl.getField);

router.post('/',    requireAdmin, ctrl.createField);
router.put('/:id',  requireAdmin, ctrl.updateField);
router.delete('/:id', requireAdmin, ctrl.deleteField);

router.post('/:id/updates', ctrl.addUpdate);

module.exports = router;