import User from "../models/User.js";


/* READ */

export const getUser = async(req, res, next) => {
    try{

        //based on the dynamic parameter that we got from the url we access the user

        const { id } = req.params; 
        const user = await User.findById(id); 
        res.status(200).json(user); 

    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

export const getUserFriends = async (req, res) => {

    try {

        const { id } = req.params; 
        const user = await User.findById(id); 

        // for every id in the friends array we want to have a promise that fetches that friend based on the id from the db

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //want to modify the schema before it is sent to the frontend

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation , location, picturePath}) =>{
                return {_id, firstName,  lastName, occupation, location, picturePath};
            }
        ); 

        res.status(200).json(formattedFriends); 

    } catch (err){
        res.status(404).json({error: err.message});
    }
}; 
//search function to mongo
export const searchUser = async (req, res) => {

    try {

        const filt_in = req.body.searchText; 

        const filt_users = await User.find({
            $or:[
                {firstName: { $regex : filt_in, $options : "i" }}, 
                {lastName: { $regex: filt_in, $options: "i"}}
            ]
        }).select('_id firstName lastName picturePath').lean().exec();

        res.status(200).json(filt_users);

    }catch (err) {
        res.status(404).json({error: err.message})
    }

}

/* UPDATE */

export const addRemoveFriend = async (req, res) => {
     
    try{

        const { id, friendID } = req.params; 
        const user = await User.findById(id); 
        const friend = await User.findById(friendID); 

         //if the friendID is present in the user's friends array
        if(user.friends.includes(friendID)){
           
            //filter out all the frinds that are not equal to the friendID and then reassign the new list to user's friend list
            user.friends = user.friends.filter((fid) => fid !== friendID); 

            //if that frind is removed from the user's list , the useer should be removed from the friend list of that friend as well 
            friend.friends = friend.friends.filter((fid) => fid !== id); 
        } else  { 
            // if friend not in the list add it to user list 

            user.friends.push(friendID); 

            // do the same for the friend as well
            friend.friends.push(id); 
        }

        await user.save();
        await friend.save();

        // giving the new list it to frontend

        // for every id in the friends array we want to have a promise that fetches that friend based on the id from the db

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //want to modify the schema before it is sent to the frontend

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation , location, picturePath}) =>{
                return {_id, firstName,  lastName, occupation, location, picturePath};
            }
        ); 

        res.status(200).json(formattedFriends); 


         
    }catch (err) {

        res.status(404).json({error: err.message});
         
    }
}


 