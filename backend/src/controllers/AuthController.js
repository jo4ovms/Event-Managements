const AppDataSource = require('../config/database');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

class AuthController {
  /**
   * Registra um novo usuário
   * @route POST /api/auth/register
   */
  static async register(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: 'Dados de registro são obrigatórios',
        });
      }

      const schema = Joi.object({
        name: Joi.string().min(2).max(255).required().messages({
          'string.min': 'Nome deve ter pelo menos 2 caracteres',
          'string.max': 'Nome deve ter no máximo 255 caracteres',
          'any.required': 'Nome é obrigatório',
        }),
        email: Joi.string().email().required().messages({
          'string.email': 'Email deve ser válido',
          'any.required': 'Email é obrigatório',
        }),
        password: Joi.string().min(6).required().messages({
          'string.min': 'Senha deve ter pelo menos 6 caracteres',
          'any.required': 'Senha é obrigatória',
        }),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const userRepository = AppDataSource.getRepository('User');

      const existingUser = await userRepository.findOne({
        where: { email: value.email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está cadastrado',
        });
      }

      const user = userRepository.create(value);
      await user.hashPassword();
      await userRepository.save(user);

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        user: user.toJSON(),
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Realiza login do usuário
   * @route POST /api/auth/login
   */
  static async login(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          success: false,
          message: 'Dados de login são obrigatórios',
        });
      }

      const schema = Joi.object({
        email: Joi.string().email().required().messages({
          'string.email': 'Email deve ser válido',
          'any.required': 'Email é obrigatório',
        }),
        password: Joi.string().required().messages({
          'any.required': 'Senha é obrigatória',
        }),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const userRepository = AppDataSource.getRepository('User');
      const user = await userRepository.findOne({
        where: { email: value.email },
      });

      if (!user || !(await user.validatePassword(value.password))) {
        return res.status(401).json({
          success: false,
          message: 'Email ou senha inválidos',
        });
      }

      if (!req.session) {
        return res.status(500).json({
          success: false,
          message: 'Sessão não inicializada - tente novamente',
        });
      }

      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.isAdmin = user.isAdmin;

      res.cookie('user_logged', user.email, {
        maxAge: 8 * 60 * 60 * 1000, // 8h
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: user.toJSON(),
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Realiza logout do usuário
   * @route POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão:', err);
          return res.status(500).json({
            success: false,
            message: 'Erro ao fazer logout',
          });
        }

        res.clearCookie('user_logged');
        res.clearCookie('connect.sid');

        res.json({
          success: true,
          message: 'Logout realizado com sucesso',
        });
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Verifica se usuário está autenticado
   * @route GET /api/auth/me
   */
  static async me(req, res) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado',
        });
      }

      const userRepository = AppDataSource.getRepository('User');
      const user = await userRepository.findOne({
        where: { id: req.session.userId },
      });

      if (!user) {
        req.session.destroy();
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      res.json({
        success: true,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}

module.exports = AuthController;
