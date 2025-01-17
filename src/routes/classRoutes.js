const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const express = require('express');
const router = express.Router();
const { 
    createClass, getClasses, updateClass, deleteClass, 
    getClassesByCategory, getClassesByRole, getClassesByLevel, 
    getAllDataLevel, getAllDataCategory, getAllClassesById, 
    getAllCategoryById, getScheduleByLevel } = require('../controllers/classController');

// Route untuk CRUD kelas
router.post('/create', authenticateToken,authorizeRole([1]), createClass);  // Hanya admin
router.get('/list', authenticateToken, getClasses);       // Semua bisa lihat
router.put('/update/:id_class', authenticateToken, authorizeRole([1]), updateClass);  // Hanya admin
router.delete('/delete/:id_class', authenticateToken, authorizeRole([1]),  deleteClass); // Hanya admin
router.get('/category/:categoryId', getClassesByCategory);
router.get('/role/:roleId', authenticateToken, getClassesByRole);
router.get('/level/:levelId', authenticateToken, getClassesByLevel);
router.get('/getAllLevel', authenticateToken, authorizeRole([3]), getAllDataLevel);
router.get('/getAllCategory', authenticateToken, authorizeRole([3]), getAllDataCategory);
router.get('/classes/:id_class', authenticateToken, authorizeRole([3]), getAllClassesById);
router.get('/category/:id_category',authenticateToken, authorizeRole([3]), getAllCategoryById);
router.get('/schedule/:id_level', authenticateToken, authorizeRole([3]), getScheduleByLevel);

module.exports = router;
