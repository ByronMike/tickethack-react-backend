var express = require("express");
var router = express.Router();

const moment = require("moment");
const Trip = require("../models/trips");

router.get("/:departure/:arrival/:date", async (req, res) => {
  const { departure, arrival, date } = req.params;

  try {
    const trips = await Trip.find({
      departure: new RegExp(departure, "i"),
      arrival: new RegExp(arrival, "i"),
      date: {
        $gte: moment(date).startOf("day"),
        $lte: moment(date).endOf("day"),
      },
    });

    // console.log("backends trips", trips);

    if (trips.length > 0) {
      const modifiedTrips = trips.map((trip) => {
        const modifiedTrip = { ...trip._doc }; // Create a copy of the trip object
        
        // Add hour and minute properties to the modified trip object
        modifiedTrip.hour = moment(trip.date).format("HH");
        modifiedTrip.minute = moment(trip.date).format("mm");
    
        return modifiedTrip;
      });
    
      console.log("modifiedTrips", modifiedTrips);
    
      res.json({ result: true, data: modifiedTrips });
    } else {
      res.json({ result: false, error: "No trip found" });
    }
    
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
