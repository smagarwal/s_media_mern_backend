import mongoose from "mongoose";

// this sets up the schema of the user model in the db , this helps avoiding irrelevant format of the schema and ensures valid inputs
const UserSchema = new mongoose.Schema(
{
    firstName: {
        type: String, 
        required: true, 
        min: 2,
        max: 50,
    },

    lastName: {
        type: String, 
        required: true, 
        min: 2,
        max: 50
    },

    email: {
        type: String, 
        required: true, 
        min: 50,
        unique: true,
    },
    password: {
        type: String, 
        required: true, 
        min: 5,
    },
    picturePath: {
        type: String,
        default: "",
    },
    friends: {
        type: Array,
        default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
}, { timestamps: true});

const User = mongoose.model("User", UserSchema); 

export default User; 

