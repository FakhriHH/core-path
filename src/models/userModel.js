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

  updateUser: (id, userData) => {
    return db('users').where({ id_user: id }).update(userData);
  },

  deleteUser: (id) => {
    return db('users').where({ id_user: id }).del();
  },
  updatePassword: (email, hashedPassword) => {
    return db('users').where({ email }).update({ password: hashedPassword });
  },

  getUserNameById: (id) => {
    return db('users')
    .select('name')
    .where({ id_user: id })
    .first();
  },
};

const findByEmail = async (email) => {
  const [user] = await db('users').where({ email }).select('*');
  return user;
};

module.exports = { User, findByEmail };
