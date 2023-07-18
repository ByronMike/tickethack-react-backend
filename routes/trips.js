var express = require("express");
var router = express.Router();

const moment = require("moment");
const Trip = require("../models/trips");

router.get('/:departure/:arrival/:date', (req, res) => {
	// Déstructuration
  const { departure, arrival, date } = req.params;

  Trip.find({
		// Constructeur : new RegExp avec flag 'i' (insensible à la casse) 
    departure: new RegExp(departure, 'i'),
    arrival: new RegExp(arrival, 'i'),
    date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') },
  }).then(trips => {
    if (trips.length > 0) {
      res.json({ result: true, data: trips });
    } else {
      res.json({ result: false, error: 'No trip found' });
    }
  });
});

module.exports = router;
