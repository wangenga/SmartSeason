const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.use(authenticate);

router.get('/agents',    ctrl.listAgents);
router.get('/',          requireAdmin, ctrl.listUsers);
router.post('/',         requireAdmin, ctrl.createUser);
router.delete('/:id',    requireAdmin, ctrl.deleteUser);

module.exports = router;