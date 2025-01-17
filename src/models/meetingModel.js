const db = require('../config/knex');

const findClassById = (idClass) => db('classes').where({ id_class: idClass }).first();
const saveClassMeetLink = async (idClass, meetLink) => {
  return db('class_meeting_link').insert({
    id_class: idClass,
    meet_link: meetLink,
  });
};

const getClassMeetLink = (idClass) => db('class_meeting_link').where({ id_class: idClass }).first();

const getCategoryName = (idClass) => db("classes as c")
.join("category_class as cc", "c.id_category", "cc.id_category")
.where("c.id_class", idClass)
.select("cc.name_category", "c.meet_link")
.first();

module.exports = { findClassById, saveClassMeetLink, getClassMeetLink, getCategoryName };
