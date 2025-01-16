const knex = require('knex');
const dotenv = require('dotenv');
dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  migrations: {
    directory: '../database/migrations',
  },
  seeds: {
    directory: '../database/seeds',
  },
});


db.raw('SELECT 1')
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err.message);
  });


module.exports = db;
