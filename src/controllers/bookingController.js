const Booking = require('../models/bookingModel');

// Get visible bookings for a class
const getClassBooking = async (req, res) => {
  try {
    const { id_class } = req.params; // Ambil ID kelas dari parameter
    const bookings = await Booking.getVisibleBookings(id_class); // Hanya booking yang aktif

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { id_user, id_class } = req.body;
    const newBooking = {
      id_user,
      id_class,
      book_status: true, // Default status
    };

    const [id_booking] = await Booking.createBooking(newBooking);
    res.status(201).json({ message: 'Booking created successfully', id_booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bookings by user ID
const getUserBookings = async (req, res) => {
  try {
    const { id_user } = req.params;
    const bookings = await Booking.getBookingsByUser(id_user);

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id_booking } = req.params;
    const { book_status } = req.body;

    await Booking.updateBookingStatus(id_booking, book_status);
    res.status(200).json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getClassBooking, createBooking, getUserBookings, updateBookingStatus };
