const express = require('express');
const router = express.Router();
const { register, login, logout, requestGetPasswordReset, requestPasswordReset, forgotPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password', requestGetPasswordReset);  
router.post('/reset-password', requestPasswordReset);  

module.exports = router;
