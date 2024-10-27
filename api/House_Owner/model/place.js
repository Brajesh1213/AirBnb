
import mongoose from "mongoose";
import House_User from '../model/User.js'

const PlaceSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'House_User' },
    title:String,    
    address:String, 
    city:String,
    state:String,
    zip:String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    maxGuests:Number,
});

export default mongoose.model('Place', PlaceSchema);


