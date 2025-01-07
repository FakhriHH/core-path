const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} = require('../controllers/classController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Endpoint dengan akses role
router.get('/', authenticateToken, getAllClasses); // Semua user bisa mengakses
router.get('/:id', authenticateToken, getClassById); // Semua user bisa mengakses

router.post(
  '/',
  authenticateToken,
  authorizeRole([1, 2]), // Hanya admin (1) dan guru (2)
  createClass
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole([1, 2]), // Hanya admin (1) dan guru (2)
  updateClass
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole([1]), // Hanya admin (1)
  deleteClass
);

module.exports = router;