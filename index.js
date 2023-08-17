import express from "express"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"; 
import dotenv from "dotenv"; 
import multer from "multer"; 
import helmet from "helmet"; 
import morgan from "morgan"; 
import path from "path"; 
//curly braces are used when importing specific named exports from a module
//while default exports are imported without curly braces
import { fileURLToPath } from "url"; 
import {register} from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"; 
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";


// * CONFIGURATION */

//(import.meta.url), it returns the URL of the current module as a string // fileURLToPath() function to convert the URL into a file path
const __filename = fileURLToPath(import.meta.url); 
// path.dirname() function is used to extract the directory name from the file path
const __dirname = path.dirname(__filename); 

dotenv.config(); 
const app = express(); 
app.use(express.json()); 

// It helps secure your Express.js application by setting various HTTP headers to protect against common security vulnerabilities
// This header informs the browser that cross-origin requests (requests from different domains) are allowed for resources on your application.
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"})); 

app.use(morgan("common")); 

//extended: true: This allows for nested objects and arrays in the JSON data. When set to true, the JSON parser supports complex data structures.
// If set to false, only simple JSON payloads are parsed.

app.use(bodyParser.json({limit: "30mb" , extended: true})); 
app.use(bodyParser.urlencoded({limit: "30mb" , extended: true})); 

app.use(cors()); 

//storing all assets in this folder locally instead of actual scenario i.e on S3 cloud
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); 

/* FILE STORAGE */ 

//this is from multer doc, we are actully setting what happen when someone uploads a file
//it gioes to this assets repo 

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");
    }, 
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
}); 

const upload = multer({storage});

/* ROUTES WITH FILES */ //this is defined in here so that it can access thos upload

//going to the middleware to upload and then implementing the logic to register 
app.post("/auth/register",  upload.single("picture"), register);  
app.post("/posts", verifyToken, upload.single("picture"), createPost);


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP*/

const PORT = process.env.PORT || 6001 ; 
mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(()=>{
    app.listen(PORT, () => console.log (`Server Port: ${PORT}`));

    /* ADD the initial user data ONLY ONCE */ 
    //so run it fill the db , then comment out the below 

    /*console.log(posts);
    User.insertMany(users);
    Post.insertMany(posts); */
})
.catch ((error)=> console.log(`${error} did not connect`)); 