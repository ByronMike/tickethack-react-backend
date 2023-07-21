// OBJECTIF : créer une route pour enregister dans le panier

var express = require("express");
var router = express.Router();

const Trip = require("../models/trips");
const Booking = require("../models/bookings");
const moment = require("moment");
const { checkBody } = require("../modules/checkBody");

router.post("/", (req, res) => {
  // checkBody *** (bas de page)
  if (!checkBody(req.body, ["tripId"])) {
    res.json({ result: false, error: "Missing trip ID" });
    return;
  }

  Trip.findById(req.body.tripId).then((trip) => {
    if (trip) {
      const newBooking = new Booking({
        trip: trip._id,
        isPaid: false,
      });

      newBooking.save().then(() => {
        res.json({ result: true });
      });
    } else {
      res.json({ result: false, error: "Trip not found" });
    }
  });
});

// OBJECTIF : créer une route pour afficher les informations des trajets bookés
router.get("/", (req, res) => {
  Booking.find({ isPaid: false })
    .populate("trip")
    .then((bookings) => {
      // console.log("backend booking", bookings);
      if (bookings.length > 0) {
        const modifiedBookings = bookings.map((booking) => {
          const modifiedBooking = { ...booking._doc }; // Create a copy of the trip object
          
          // Add hour and minute properties to the modified trip object
          modifiedBooking.hour = moment(booking.trip.date).format("HH");
          modifiedBooking.minute = moment(booking.trip.date).format("mm");
      
          return modifiedBooking;
        });
        res.json({ result: true, data: modifiedBookings });
      } else {
        res.json({ result: false, error: "No bookings found" });
      }
    });
});

// OBJECTIF : créer une route pour supprimer les trajets selon ID
// Note : deletedCount is a property given by mongoose
router.delete("/:tripId", (req, res) => {
  Booking.deleteOne({ trip: req.params.tripId }).then(({ deletedCount }) => {
    Booking.find({ isPaid: false })
      .populate("trip")
      .then((bookings) => {
        res.json({ result: deletedCount > 0, data: bookings });
      });
  });
});

module.exports = router;
