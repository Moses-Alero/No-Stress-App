const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    roomType: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'roomType'
    }
})

const Bookings = mongoose.model('bookings', BookingSchema);

module.exports = Bookings;