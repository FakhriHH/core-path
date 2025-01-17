const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const validateBooking = require('../middlewares/validateBooking');

router.post('/create', validateBooking, createBooking);
router.get('/booking/user/:id_user', getUserBookings);
router.patch('/update/:id_booking', updateBookingStatus);

module.exports = router;
