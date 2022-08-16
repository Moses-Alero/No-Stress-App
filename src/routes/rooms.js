const express = require('express');
const hotelAuth = require('../middleware/hotelAuth');
const roomCheck = require('../middleware/roomCheck');
const multer = require('multer')
const Hotel = require('../models/Hotels');
const Rooms = require('../models/Rooms');

const router = new express.Router();

const upload = multer({
    limits:{
        fileSize: 524800
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
            throw new Error('only images can be uploaded');
        }
        cb(null, true);
    }
});


//get rooms in hotel
router.get("/hotels/:hotelName/rooms", hotelAuth, async (req,res) =>{
    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const rooms = await Rooms.find({Hotel: hotel._id});
   try {
    if (rooms.length < 1) return res.status(404).send({error: "No rooms have been listed"});//checks no of rooms in the hotel
    const roomData = rooms.map(room => {
        return {roomType: room.roomType, description:room.description, price: room.price, rating: room.rating};
    });
    res.status(200).send(roomData);
   } catch (error) {
       res.status(404).send(error);
   }
});

// add rooms to hotel
router.post("/hotels/:hotelName/rooms/add",hotelAuth, roomCheck, async (req,res)=>{
    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const room = new Rooms({...req.body, Hotel: hotel._id});
    try {
        await room.save();
        room.status = "Room added successfully";
        res.status(200).send({room});
    } catch (error) {
        res.status(404).send(error);
    }
});

// upload room images
router.post('/hotels/:hotelName/rooms/upload', hotelAuth, roomCheck, upload.array('roomImages', 4), async(req,res)=>{
    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const room = await Rooms.findOne({Hotel: hotel._id})
    room.image = req.files;
    await room.save();
},(error,req,res,next)=>{
    res.send({error: error.message})
})

//update room data
router.patch('/hotels/:hotelName/rooms/update', hotelAuth, roomCheck, async (req,res)=>{
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) { //check if request body sent is an empty object
        res.status(401).send({error: 'Invalid request'}); 
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['roomType','roomTypeNo','description','price'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

    if(!isValidUpdate) return res.status(401).send({error: `Only ${allowedUpdates} can be updated`});

    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const room = await Rooms.findOne({Hotel: hotel._id, roomType: req.query.roomType});
    
    try {
        updates.forEach(update => room[update] = req.body[update]);
        await room.save();
        res.status(204).send(room);
    } catch (error) {
        res.status(401).send(error);
    }
});

// delete rooms from hotel
router.delete("/hotels/:hotelName/rooms/remove", hotelAuth, async(req,res)=>{
    if(req.query.roomName === '') return res.status(404).send({error: 'Invalid request'});
    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const room = await Rooms.deleteOne({Hotel: hotel._id, roomType: req.query.roomType});

    try {
        if(room.deletedCount === 0){
            return res.status(404).send({error: `No room with name ${req.query.roomType}`});
    }
        res.status(200).send(room);
    } catch (error) {
        res.status(401).send(error);
    }
});

// delete all the rooms in an hotel
router.delete("/hotels/:hotelName/rooms/removeAll", hotelAuth, async (req, res)=>{
    const hotel = await Hotel.findOne({name: req.params.hotelName});
    const rooms = await Rooms.deleteMany({Hotel: hotel._id});
    try {
        if(!rooms) return res.status(404).send({error: `No rooms added to ${req.params.hotelName}`});
        res.status(200).send(rooms)
    } catch (error) {
        res.status(404).send(error)
    }
});

module.exports = router;