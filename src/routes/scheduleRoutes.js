const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');


// hanya bisa dilakukan oleh (1) admin
router.post('/create', authenticateToken, authorizeRole([1]), scheduleController.createSchedule);
router.put('/update/:id', authenticateToken, authorizeRole([1]), scheduleController.updateSchedule);
router.delete('/delete/:id', authenticateToken, authorizeRole([1]), scheduleController.deleteSchedule);

// dapat dilakukan oleh publik
router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);

module.exports = router;
