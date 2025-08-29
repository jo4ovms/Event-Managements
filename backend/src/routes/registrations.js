const express = require('express');
const RegistrationController = require('../controllers/RegistrationController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/registrations
 * @desc Inscrever-se em evento
 * @access Private
 */
router.post('/', requireAuth, RegistrationController.register);

/**
 * @route DELETE /api/registrations/:eventId
 * @desc Cancelar inscrição
 * @access Private
 */
router.delete('/:eventId', requireAuth, RegistrationController.unregister);

/**
 * @route GET /api/registrations/my-events
 * @desc Listar meus eventos inscritos
 * @access Private
 */
router.get('/my-events', requireAuth, RegistrationController.myRegistrations);

module.exports = router;
