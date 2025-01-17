const express = require('express');
const { createMeetLink, sendMeetLinkToStudent, redirect, generateUrl } = require('../controllers/meetingController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-meet-link', authenticateToken, authorizeRole([2]), createMeetLink);
router.post('/send-meet-link', authenticateToken, authorizeRole([3]), sendMeetLinkToStudent);
router.get('/redirect', redirect);
router.get('/generate', generateUrl)


module.exports = router;

