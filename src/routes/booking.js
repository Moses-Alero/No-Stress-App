const express = require('express');
const Bookings = require('../models/Booking');
const router = express.Router();

//todo: remove this endpoint if found to be useless
router.get('/bookings', async (req, res)=>{
    const bookings = await Bookings.find();
    try {
         res.send(bookings);
    } catch (error) {
        res.status(404).send(error)
    }
});

router.post('/book', async (req, res)=>{
    const booking = await new Bookings(req.body);
    try {
        await booking.save();
        res.send(req.body);
    } catch (error) {
        res.status(401).send(error);
    }
});



module.exports = router;