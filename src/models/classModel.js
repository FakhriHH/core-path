const db = require('../config/knex');

class Classes {
  static async createClass(newClass) {
    return db('classes').insert(newClass).returning('id_class');
  }

  static async getClassById(id_class) {
    return db('classes').where({ id_class }).first();
  }

  static getAllClasses() {
    return db('classes')
      .select('classes.id_class', 'category_class.name_category', 'levels.level_name', 'users.name as teacher_name', 'schedule.day', 'classes.price',)
      .leftJoin('category_class', 'classes.id_category', 'category_class.id_category')
      .leftJoin('levels', 'classes.id_level', 'levels.id_level')
      .leftJoin('users', 'classes.id_teacher', 'users.id_user')
      .leftJoin('schedule', 'classes.id_schedule', 'schedule.id_schedule')
      .where('users.id_role', 2);  // Mengambil dari role teacher
  }

  static updateClass(id_class, data) {
    return db('classes').where({ id_class }).update(data);
  }

  static deleteClass(id_class) {
    return db('classes').where({ id_class }).del();
  }

  static async getAllDataClassByCategory(categoryId) {
    return db('classes')
      .join('category_class', 'classes.id_category', '=', 'category_class.id_category')
      .where({ 'classes.id_category': categoryId })
      .select('classes.id_class', 'classes.id_schedule', 'classes.id_level', 'classes.price', 'category_class.name_category');
  }

  static async getAllDataClassByRole(roleId) {
    return db('classes')
      .join('users', 'classes.id_teacher', '=', 'users.id_user')
      .where({ 'users.id_role': roleId })
      .select('classes.id_class', 'classes.id_category', 'classes.id_schedule', 'classes.id_level', 'classes.price', 'users.name as name_teacher');
  }

  static async getAllDataClassByLevel(levelId) {
    return db('classes')
      .join('levels', 'classes.id_level', '=', 'levels.id_level')
      .where({ 'classes.id_level': levelId })
      .select('classes.id_class', 'classes.id_category', 'classes.id_schedule', 'levels.level_name', 'classes.price');
  }
}

class CategoryClass {
  static async getCategoryById(id_category) {
    return db('category_class').where({ id_category }).first();
  }
}

class Levels {
  static async getLevelById(id_level) {
    return db('levels').where({ id_level }).first();
  }
  static async getAllDataLevel() {
    return db('levels').select('*');
  }
}

class User {
  static async getUserById(id_user) {
    return db('users').where({ id_user }).first();
  }
}

module.exports = { Classes, CategoryClass, Levels, User, Levels };
