const knex = require('../config/knex');

const ClassModel = {
    getAllClasses: () => knex('classes').select('*'),
  
    getClassById: (id) => knex('classes').where('id_class', id).first(),
  
    createClass: (classData) => knex('classes').insert(classData),
  
    updateClass: (id, classData) =>
        knex('classes').where('id_class', id).update(classData),
  
    deleteClass: (id) => knex('classes').where('id_class', id).del(),
};
  
module.exports = ClassModel;