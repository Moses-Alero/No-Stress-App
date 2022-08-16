const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomType: {
        type: String,
        required: true,
    },
    roomTypeNo: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxLength: 300
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    rating:{
        type: Number,
        trim: true,
        default: 0,
        max: 5
    },
    Hotel: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Hotels'
    },
    Images: {
        type: Array
    }
})

roomSchema.virtual('booking',{
    ref: 'booking',
    localField: 'rooms',
    foreignField: 'roomType'
})

const Rooms = mongoose.model('Rooms',roomSchema);

module.exports = Rooms;
