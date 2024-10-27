const mongoose = require('mongoose');
const PlaceSchema = new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title:String,
    
    address:String, 
    price:Number,
    city:string,
    state:String,
    country:string,
    zip:String,
    photos:[String],
    description:String,
    perks:[string],
    extraInfo:string,
    checkIn:Number,
    checkOut:Number,
    
    maxGuests:Number,
});
const placeModel= mongoose.model('place',PlaceSchema);

module.exports =placeModel;