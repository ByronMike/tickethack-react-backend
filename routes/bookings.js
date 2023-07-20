// OBJECTIF : créer une route pour actualiser le statut de réservation

var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings');

router.put('/', (req, res) => {
  // Filtre : { isPaid: false }, Update : { isPaid: true }
  Booking.updateMany({ isPaid: false }, { isPaid: true }).then(({ modifiedCount }) => {
    res.json({ result: modifiedCount > 0 });
  })
});

// OBJECTIF : créer une route pour récupérer les informations trips à partir du statut de 
// réservation

router.get('/', (req, res) => {
  Booking.find({ isPaid: true })
    // La sortie est un document (trip) au format objet
    .populate('trip')
    .then(bookings => {
      if (bookings.length > 0) {
        res.json({ result: true, bookings });
      } else {
        res.json({ result: false, error: 'No bookings found' });
      }
    });
});

module.exports = router;