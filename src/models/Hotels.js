const mongoose = require('mongoose')
const {Rooms} = require('./Rooms')

const HotelSchema = mongoose.Schema({
    name:{
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxLength: 300
    },
    address:{
        type: String,
        trim: true,
        required: true
    },
    contact:{
        type: String,
        trim: true,
        required: true
    },
    rating:{
        type: Number,
        trim: true,
        default: 0,
        max: 5
    },
    image:{
            type: Array            
        }
    
})

HotelSchema.virtual('rooms',{
    ref: 'Rooms',
    localField: 'Hotel Name',
    foreignField: 'Hotels'
})



const Hotel = mongoose.model("Hotels", HotelSchema);


module.exports = Hotel