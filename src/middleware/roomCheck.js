const Hotel = require("../models/Hotels");
const Rooms = require("../models/Rooms")


const roomCheck = async (req,res,next)=>{
    const hotel = await Hotel.findOne({name: req.params.hotelName})
    const roomType = await Rooms.findOne({roomType: req.body.roomType, Hotel: hotel._id});
    const roomTypeOnUpdate = await Rooms.findOne({roomType: req.query.roomType, Hotel: hotel._id});
    try {
        if (roomType) throw `${req.body.roomType} already exists in ${req.params.hotelName}`;
        if (req.query.roomType && !roomTypeOnUpdate) throw `No room named ${req.query.roomType} in ${req.params.hotelName}`
        next();
    } catch (error) {
        res.status(401).send({error})
    }
}

module.exports = roomCheck;