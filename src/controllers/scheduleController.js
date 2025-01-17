const scheduleModel = require('../models/scheduleModel');

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await scheduleModel.getAllSchedules();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// get scehedule by id
const getScheduleById = async (req, res) => {
    try {
        const schedule = await scheduleModel.getScheduleById(req.params.id);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// create schedule
const createSchedule = async (req, res) => {
    const { day, start_time, end_time } = req.body;

    try {
        const newSchedule = {
            day,
            start_time,
            end_time
        };

        const schedule = await scheduleModel.createSchedule(newSchedule);
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update schedule
const updateSchedule = async (req, res) => {
    try {
        const schedule = await scheduleModel.updateSchedule(req.params.id, req.body);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// delete schedule
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await scheduleModel.deleteSchedule(req.params.id);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
}