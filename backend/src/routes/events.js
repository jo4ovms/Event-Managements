const express = require('express');
const EventController = require('../controllers/EventController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/events
 * @desc Listar todos os eventos
 * @access Private
 */
router.get('/', requireAuth, EventController.index);

/**
 * @route POST /api/events
 * @desc Criar novo evento
 * @access Admin
 */
router.post('/', requireAuth, requireAdmin, EventController.create);

/**
 * @route PUT /api/events/:id
 * @desc Atualizar evento
 * @access Admin
 */
router.put('/:id', requireAuth, requireAdmin, EventController.update);

/**
 * @route DELETE /api/events/:id
 * @desc Deletar evento
 * @access Admin
 */
router.delete('/:id', requireAuth, requireAdmin, EventController.delete);

/**
 * @route GET /api/events/:id/registrations
 * @desc Listar inscrições de um evento
 * @access Admin
 */
router.get(
  '/:id/registrations',
  requireAuth,
  requireAdmin,
  EventController.getRegistrations
);

module.exports = router;
