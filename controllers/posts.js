import Post from "../models/Post.js";
import User from "../models/User.js"

/* CREATE */ 

export const createPost =  async (req, res)=> {

    try{

        //take the data for posting 

        const {userId, description, picturePath } = req.body; 

        const user = await User.findById(userId); 
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })

        //add the new post to the db
        await newPost.save(); 

        //get all the posts from the db and return to the frontend
        const post  = await Post.find();

        res.status(201).json(post); 

    }catch (err){
        res.status(409).json({error: err.message}); 
    }
}; 

/* READ */

export const getFeedPosts = async (req, res) => {

    try {
        //get all the posts from the db and return to the frontend
        const post  = await Post.find();
        res.status(200).json(post); 

    } catch (err){
        res.status(404).json({error: err.message}); 
    }
};

export const getUserPosts = async (req, res) =>{
    try {
        const { userId } = req.params; 
        //the posts of the specific user and return it to frontend
        const post  = await Post.find({userId});
        res.status(200).json(post); 
    } catch (err){
        res.status(404).json({error: err.message}); 
    }
};

/* UPDATE */ 

export const likePost = async (req, res) =>{
    try {

        
        //this is the id of the post that will be liked 
        const { id } = req.params; //this is coming from the url 

        const { userId } = req.body; // this from the req body sent by frontend , 
        //this is the user that will like the post

        //the post is found 
        const post  = await Post.findById(id);

        //here from the likes map of that specific post we see if that userid exists, 
        //i.e if this user has already liked this post
        const  isLiked = post.likes.get(userId); 

        //if so 
        if(isLiked){
            post.likes.delete(userId);
        }else {
            //if not , then include in the likes map 
            post.likes.set(userId, true);
        }

        //now this updated post needs to be updated in the db 

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes },
            {new: true}
        );

        //return to the frontend

        res.status(200).json(updatedPost); 
    } catch (err){
        res.status(404).json({error: err.message}); 
    }
};






