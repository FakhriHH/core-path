const db = require('../config/knex');

const User = {
  createUser: (userData) => {
    return db('users').insert(userData);
  },

  getUserByEmail: (email) => {
    return db('users').where({ email }).first();
  },

  getUserById: (id) => {
    return db('users').where({ id_user: id }).first();
  },

  updateUser : (id, updatedData) => {
    return db('users') 
      .where({ id_user: id})
      .update(updatedData);
  },


};

module.exports = User;
