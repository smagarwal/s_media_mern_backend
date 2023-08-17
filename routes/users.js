import express from "express";

import {
    getUser, 
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"; 

import { verifyToken } from "../middleware/auth.js";

const router = express.Router(); 

/* READ */

router.get("/:id", verifyToken, getUser);

router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */

///:id/:friendID" is the URL pattern for this route. 
//It contains two dynamic parameters, :id and :friendID
// which can be accessed in the route handler.

router.patch("/:id/:friendID", verifyToken, addRemoveFriend); 

export default router; 