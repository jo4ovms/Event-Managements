const express = require('express');
const AuthController = require('../controllers/AuthController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Registrar novo usuário
 * @access Public
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/auth/login
 * @desc Login do usuário
 * @access Public
 */
router.post('/login', AuthController.login);

/**
 * @route POST /api/auth/logout
 * @desc Logout do usuário
 * @access Private
 */
router.post('/logout', requireAuth, AuthController.logout);

/**
 * @route GET /api/auth/me
 * @desc Verificar se usuário está autenticado
 * @access Private
 */
router.get('/me', requireAuth, AuthController.me);

module.exports = router;
