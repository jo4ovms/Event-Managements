require('reflect-metadata');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const AppDataSource = require('./config/database');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

const app = express();
const PORT = process.env.PORT || 3001;

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Banco de Dados conectado!');

    const userRepository = AppDataSource.getRepository('User');
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@admin.com' },
    });

    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const admin = userRepository.create({
        name: 'Administrador',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin123', 12),
        isAdmin: true,
      });

      await userRepository.save(admin);
      console.log('👤 Default admin created: admin@admin.com / admin123');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3004',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);

  if (error.name === 'QueryFailedError') {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Dados duplicados encontrados',
      });
    }
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Referência inválida encontrada',
      });
    }
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Erro interno do servidor'
        : error.message,
  });
});

const startServer = async () => {
  await initializeDatabase();

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      name: 'connect.sid',
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000, // 8h
        sameSite: 'lax',
      },
    })
  );

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/registrations', registrationRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Rota não encontrada',
    });
  });

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(
      `Frontend URL configurada: ${
        process.env.FRONTEND_URL || 'http://localhost:5173'
      }`
    );
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
