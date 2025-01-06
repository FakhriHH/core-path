const db = require('../config/knex');

const User = {
  createUser: (userData) => {
    return db('user').insert(userData);
  },

  getUserByEmail: (email) => {
    return db('user').where({ email }).first();
  },

  getUserById: (id) => {
    return db('user').where({ id_user: id }).first();
  },
};

module.exports = User;
