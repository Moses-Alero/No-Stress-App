const Hotel = require('../models/Hotels');

const hotelAuth = async(req,res,next) =>{
    try {
        if (req.params.hotelName === undefined) return res.status(404).send({error: 'Invalid request'});
        const hotelName = await Hotel.findOne({name: req.params.hotelName});
        if(!hotelName) throw new Error();
        next();
    } catch (error) {
        res.status(404).send({error: `No hotel with name ${req.params.hotelName}`});
    }

}
module.exports = hotelAuth;