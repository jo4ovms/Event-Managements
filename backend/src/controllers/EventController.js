const AppDataSource = require('../config/database');
const Joi = require('joi');

class EventController {
  /**
   * Lista todos os eventos
   * @route GET /api/events
   */
  static async index(req, res) {
    try {
      const eventRepository = AppDataSource.getRepository('Event');

      const events = await eventRepository.find({
        relations: ['createdBy', 'registrations', 'registrations.user'],
        order: { eventDate: 'ASC' },
      });

      const eventsWithCount = events.map((event) => ({
        ...event,
        registrationCount: event.registrations ? event.registrations.length : 0,
      }));

      res.json({
        success: true,
        events: eventsWithCount,
      });
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Cria um novo evento
   * @route POST /api/events
   */
  static async create(req, res) {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem criar eventos',
        });
      }

      const schema = Joi.object({
        name: Joi.string().min(2).max(255).required().messages({
          'string.min': 'Nome deve ter pelo menos 2 caracteres',
          'any.required': 'Nome é obrigatório',
        }),
        description: Joi.string().allow('').optional(),
        eventDate: Joi.date().greater('now').required().messages({
          'date.greater': 'Data do evento deve ser futura',
          'any.required': 'Data do evento é obrigatória',
        }),
        location: Joi.string().min(2).max(255).required().messages({
          'string.min': 'Local deve ter pelo menos 2 caracteres',
          'any.required': 'Local é obrigatório',
        }),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const eventRepository = AppDataSource.getRepository('Event');
      const userRepository = AppDataSource.getRepository('User');

      const creator = await userRepository.findOne({
        where: { id: req.session.userId },
      });

      if (!creator) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const event = eventRepository.create({
        ...value,
        createdBy: creator,
      });

      await eventRepository.save(event);

      res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        event,
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Atualiza um evento
   * @route PUT /api/events/:id
   */
  static async update(req, res) {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem editar eventos',
        });
      }

      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do evento inválido',
        });
      }

      const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        description: Joi.string().allow('').optional(),
        eventDate: Joi.date().greater('now').required(),
        location: Joi.string().min(2).max(255).required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const eventRepository = AppDataSource.getRepository('Event');

      const event = await eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado',
        });
      }

      Object.assign(event, value);
      await eventRepository.save(event);

      res.json({
        success: true,
        message: 'Evento atualizado com sucesso',
        event,
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Deleta um evento
   * @route DELETE /api/events/:id
   */
  static async delete(req, res) {
    try {
      if (!req.session.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem deletar eventos',
        });
      }

      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do evento inválido',
        });
      }

      const eventRepository = AppDataSource.getRepository('Event');

      const event = await eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado',
        });
      }

      await eventRepository.remove(event);

      res.json({
        success: true,
        message: 'Evento deletado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Lista inscrições de um evento
   * @route GET /api/events/:id/registrations
   */
  static async getRegistrations(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do evento inválido',
        });
      }

      const eventRepository = AppDataSource.getRepository('Event');

      const event = await eventRepository.findOne({
        where: { id: eventId },
        relations: ['registrations', 'registrations.user'],
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado',
        });
      }

      const registrations = event.registrations.map((reg) => ({
        id: reg.id,
        registeredAt: reg.registeredAt,
        user: {
          id: reg.user.id,
          name: reg.user.name,
          email: reg.user.email,
        },
      }));

      res.json({
        success: true,
        registrations,
      });
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}

module.exports = EventController;
