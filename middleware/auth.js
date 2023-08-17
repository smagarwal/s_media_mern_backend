import jwt from "jsonwebtoken"; 

// we are setting up this middleware so that only autherized/ logged in user could access all the corresponding routes using this middleware 

export const verifyToken = async (req, res, next) => {

    try{

        let token = req.header("Authorization");

        if(!token){
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); 

        req.user = verified; 

        next(); 

    }catch (err) {

        res.status(500).json({ error: err.message});

    }
}