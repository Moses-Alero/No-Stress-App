//const path = require('path')
const express = require('express');
const multer = require('multer');
const hotelAuth = require('../middleware/hotelAuth');
const Hotel = require('../models/Hotels');

const router = new express.Router();

const upload = multer({
    limits:{
        fileSize: 5242880
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
            return cb(new Error('Only images can be uploaded'));
        }
        cb(null, true);
    }
});


router.get("/hotels", async (_req,res)=>{  
    const hotels = await Hotel.find({});

    try{
        if(hotels.length < 1) {
            return res.status(204).send({error: 'No Hotels have been registered by you'})
        }
        const hotelData = hotels.map(hotel =>{ 
            return {name: hotel.name, description: hotel.description, image: hotel.image, rating: hotel.rating };
        });
        res.status(200).send(hotelData);
    }catch(error){
        res.status(400).send(error);
    }
});

router.post("/hotels/register", async (req,res)=>{
    const hotel = new Hotel(req.body);

    try{
        await hotel.save();
        res.status(201).send(hotel);
        
    }catch(error){
        res.status(401).send(error);
    }  
});

router.post("/hotels/:hotelName/upload",hotelAuth, upload.array('hotelImages',4), async (req, res)=>{
    const hotel = await Hotel.findOne({name: req.params.hotelName})
    hotel.image = req.files;
    await hotel.save();
    res.status(200).send();
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message});
})

router.get("/hotels/:hotelName/images", hotelAuth, async (req,res)=>{
    try {
        const hotel  = await Hotel.findOne({name: req.params.hotelName});
        if(!hotel.image) throw new Error();
        hotelImageData = []
        hotel.image.forEach(image => {
            hotelImageData.push({filename: image.originalname, image: image.buffer})
        });
        res.set("Content-Type: image/jpeg");
        res.status(200).send(hotelImageData);
    } catch (error) {
       res.status(404).send({error}); 
    }    
})



router.patch("/hotels/:hotelName/update", hotelAuth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description','address','contact'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if(!isValidUpdate) return res.status(401).send({error: `Only ${allowedUpdates} can be updated`})

    const hotel = await Hotel.findOne({name: req.params.hotelName});
    
    try{
        updates.forEach(update => hotel[update] = req.body[update]);
        await hotel.save();
        res.status(204).send(hotel)
    } catch (error) {
        res.status(404).send({error});
    }
});

router.delete("/hotels/:hotelName/remove", async (req, res)=>{
    try{
        const hotel = await Hotel.findOneAndDelete({name: req.params.hotelName});

        if(!hotel) return res.status(404).send({error: `No Hotel named ${req.params.hotelName}`});

        res.status(200).send({hotel: hotel});
    }catch(error){
        res.status(500).send(error);
    }
}); 

//Todo: add image update or delete endpoints
module.exports = router;