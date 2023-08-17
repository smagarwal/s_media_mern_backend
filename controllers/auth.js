import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import User from "../models/User.js"; 

/* REGISTER USER */

export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; //from the req body get the info

        //encrypt the password
        const salt = await bcrypt.genSalt(); 
        const passwordHash = await bcrypt.hash(password, salt); 

        //create new user object with details we want to save in the database
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });
         
        //save the user in db 
        const savedUser = await newUser.save(); 

        //success status code 
        res.status(201).json(savedUser); 

    } catch (err) {

        res.status(500).json( {error: err.message});

    }
};

/* LOGGING IN */

export const login = async (req, res) => {

    try{
        const { email, password } = req.body;
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "User does not exist."});

        const isMatch = await bcrypt.compare(password, user.password); 
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials. "});

        //creating a token , the secret should be a tough string 
        const token = jwt.sign({id: user._id} , process.env.JWT_SECRET);

        //we don't want to pass the password of the user hence delete it 
        delete user.password; 

        res.status(200).json({ token, user});

    } catch (err) {
        res.status(500).json({error: err.message});
    }
}