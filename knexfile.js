const knex = require('knex');
const dotenv = require('dotenv');

module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: 'localhost',  // host database
        user: 'root',       // username MySQL Anda
        password: '', // password MySQL Anda
        database: 'education_anak',  // nama database Anda
      },
      migrations: {
        directory: './src/database/migrations',
      },
      seeds: {
        directory: './src/database/seeds',
      },
    },
  };
  