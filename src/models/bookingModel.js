const db = require('../config/knex');

const Booking = {

    // Get visible bookings for a class
    getVisibleBookings: (id_class) =>
      db('bookings')
        .where({ id_class, book_status: true }) // Filter hanya booking yang aktif
        .select('*'),

  
  // Create a new booking
  createBooking: (data) => db('booking').insert(data),

  // Retrieve booking by user ID
  getBookingsByUser: (id_user) => db('booking')
  .where('id_user', id_user)
  .andWhere('book_status', filter === 'completed' ? 'completed' : 'pending'),

  // Update booking status
  updateBookingStatus: (id_booking, book_status) =>
    db('booking').where('id_booking', id_booking).update({ book_status }),


  getBookingsByClass: (id_class) => db('booking').where('id_class', id_class),
};

module.exports = Booking;
