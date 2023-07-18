const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
// clé d'identification
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
// valeur pivot
  isPaid: Boolean,
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;