const express = require('express');
const router = express.Router();
const { register, login, logout, requestPasswordReset, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', requestPasswordReset);  // Route untuk meminta reset password
router.post('/reset-password/:token', resetPassword);  // Route untuk mengatur ulang password

module.exports = router;
