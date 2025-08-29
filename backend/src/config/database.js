const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Event = require('../entities/Event');
const Registration = require('../entities/Registration');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Event, Registration],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = AppDataSource;
