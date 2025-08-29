const AppDataSource = require('../config/database');

class RegistrationController {
  /**
   * Inscrever usuário em evento
   * @route POST /api/registrations
   */
  static async register(req, res) {
    try {
      const { eventId } = req.body;
      const userId = req.session.userId;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: 'ID do evento é obrigatório',
        });
      }

      const eventRepository = AppDataSource.getRepository('Event');
      const userRepository = AppDataSource.getRepository('User');
      const registrationRepository =
        AppDataSource.getRepository('Registration');

      const event = await eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Evento não encontrado',
        });
      }

      const user = await userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const existingRegistration = await registrationRepository.findOne({
        where: {
          user: { id: userId },
          event: { id: eventId },
        },
      });

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'Você já está inscrito neste evento',
        });
      }

      const registration = registrationRepository.create({
        user,
        event,
      });

      await registrationRepository.save(registration);

      res.status(201).json({
        success: true,
        message: 'Inscrição realizada com sucesso',
        registration,
      });
    } catch (error) {
      console.error('Erro ao se inscrever no evento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Cancelar inscrição do usuário
   * @route DELETE /api/registrations/:eventId
   */
  static async unregister(req, res) {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = req.session.userId;

      if (isNaN(eventId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do evento inválido',
        });
      }

      const registrationRepository =
        AppDataSource.getRepository('Registration');

      const registration = await registrationRepository.findOne({
        where: {
          user: { id: userId },
          event: { id: eventId },
        },
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Inscrição não encontrada',
        });
      }

      await registrationRepository.remove(registration);

      res.json({
        success: true,
        message: 'Inscrição cancelada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * Listar eventos inscritos do usuário logado
   * @route GET /api/registrations/my-events
   */
  static async myRegistrations(req, res) {
    try {
      const userId = req.session.userId;

      const registrationRepository =
        AppDataSource.getRepository('Registration');

      const registrations = await registrationRepository.find({
        where: { user: { id: userId } },
        relations: ['event', 'event.createdBy'],
        order: { event: { eventDate: 'ASC' } },
      });

      res.json({
        success: true,
        registrations: registrations.map((reg) => ({
          id: reg.id,
          registeredAt: reg.registeredAt,
          event: reg.event,
        })),
      });
    } catch (error) {
      console.error('Erro ao listar minhas inscrições:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}

module.exports = RegistrationController;
