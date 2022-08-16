const app = require('../src/app');
const request = require('supertest');
const Hotel = require('../src/models/Hotels');

const hotel = {
    "name": "De Chris",
    "address": "17 Lagos Asaba Express Way",
    "contact": "08034971477",
    "description": "A place to rest a tired head"
}
const hotel2 = {
    "name": "Moses hotel",
    "address": "17 Lagos Asaba Express Way",
    "contact": "08034971477",
    "description": "A place to rest a tired head"
}

describe('check if the database is empty', ()=>{
    beforeEach(async ()=>{
        await Hotel.deleteMany({});
    });
    test("Should confirm no hotel in database", async()=>{
        await request(app).get('/hotels').expect(204)
    });
});

beforeEach(async () =>{
    await Hotel.deleteMany({});
    await new Hotel(hotel).save();
});



test("Should send a list of hotels", async()=>{
    await  request(app).get('/hotels')
    .expect(200);
});

test("Should register the hotel", async()=>{
    await request(app).post('/hotels/register')
    .send(hotel2).expect(201);
});

test("Should update the hotel data", async()=>{
    await request(app).patch(`/hotels/${hotel.name}/update`).
    send({
    "name": "Alero Resorts",
    "address": "17 Lagos Asaba Express Way",
    "contact": "08034971477",
    "description": "Enjoy life to the fullest"
    }).expect(204);
});

test("Should not update the hotel data", async()=>{
    await request(app).patch(`/hotels/${hotel.name}/update`).
    send({
    "name": "Alero Resorts",
    "address": "17 Lagos Asaba Express Way",
    "contact": "08034971477",
    "rating": 10
    }).expect(401);
});

test("Should delete hotel", async()=>{
    await request(app).delete(`/hotels/${hotel.name}/remove`)
    .expect(200);
});

