import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
{ 
   
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
   location: String, 
   description: String,
   picturePath: String,
   userPicturePath: String,
   //likes is made as a map so that search can be fast 
   likes: {
    type: Map,
    of: Boolean,
   },
   comments: { 
    type: Array,
    default: [],
   }
}, {timestamps: true}
);

const Post = mongoose.model("Post", postSchema); 

export default Post; 