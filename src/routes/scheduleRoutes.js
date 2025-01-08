const express = require('express');
const router = express.Router();
const { getAllSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController');


router.get('/schedule', getAllSchedules);
router.get('/schedule/:id', getScheduleById);
router.post('/schedule', createSchedule);
router.put('/schedule/:id', updateSchedule);
router.delete('/schedule/:id', deleteSchedule);

module.exports = router;