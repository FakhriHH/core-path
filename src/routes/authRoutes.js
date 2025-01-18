const express = require('express');
const router = express.Router();
const { register, login, logout, requestGetPasswordReset,
     requestPasswordReset, forgotPassword,
      updateUser, deleteUser, updatePassword, getUserNameById } = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password', requestGetPasswordReset);  
router.post('/reset-password', requestPasswordReset);  
router.put("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, authorizeRole([1]), deleteUser);
router.put('/update-password', authenticateToken, updatePassword);
router.get('/getUser/:id', authenticateToken, getUserNameById);

module.exports = router;
