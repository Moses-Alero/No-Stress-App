const express = require('express');
require('./db/mongoose.js');
const hotelRouter = require('./routes/hotels');
const roomRouter = require('./routes/rooms')
const bookingRouter = require('./routes/booking')
const app = express();


app.use(express.json())

app.use(hotelRouter);
app.use(roomRouter);
app.use(bookingRouter);


module.exports = app