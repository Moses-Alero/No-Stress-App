const request = require('supertest');
const app = require('../src/app')
const Rooms = require('../src/models/Rooms');
const Hotel = require('../src/models/Hotels');


const testHotel = {
    "name": "Lerox",
    "address": "17 Lagos Asaba Express Way",
    "contact": "08034971477",
    "description": "A place to rest a tired head"
}

const room = {
    roomType: 'regular',
    roomTypeNo: 10,
    price: 10000,
}

const room2 = {
    roomType: 'king suite',
    roomTypeNo: 10,
    price: 50000,
}

beforeEach(async()=>{
    await Hotel.deleteMany({})
    await Rooms.deleteMany({});
    const hotel = await new Hotel(testHotel).save();
    await new Rooms({...room, hotel: hotel._id}).save();
});

test("should get rooms", async()=>{
    request(app).get(`/hotels/${testHotel.name}/rooms`)
    .expect(200);
});
 
test("should add room to the hotel", async()=>{
    await request(app).post(`/hotels/${testHotel.name}/rooms/add`)
    .send(room2)
    .expect(200);
});

test.only('should update room data', async()=>{
    console.log(room.roomType)
    await request(app).patch(`/hotels/${testHotel.name}/rooms/update`)
    .query({
        roomType: room.roomType
    })
    .send({
        "description": "Air conditioned, No Wifi"
    }).expect(204);
});

test('should remove room in Hotel', async()=>{
    await request(app).delete(`/hotels/${testHotel.name}/rooms/remove`)
    .query({
        roomType: room.roomType
    })
    .expect(200);
});

test('should delete all the rooms in the hotel', async()=>{
    await request(app).delete(`/hotels/${testHotel.name}/rooms/removeAll`)
    .expect(200);
});