const db = require('../config/knex');

const Schedule = {
    createSchedule: (scheduleData) => {
        return db('schedule').insert(scheduleData);
    },
    getAllSchedules: () => {
        return db('schedule').select('*');
    },
    getScheduleById: (id) => {
        return db('schedule').where({ id_schedule: id }).first();
    },
    updateSchedule: (id, scheduleData) => {
        return db('schedule').where({ id_schedule: id }).update(scheduleData);
    },
    deleteSchedule: (id) => {
        return db('schedule').where({ id_schedule: id }).del();
    },
};

module.exports = Schedule;