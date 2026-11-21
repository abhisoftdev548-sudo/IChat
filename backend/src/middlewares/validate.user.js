import {getAuth} from "@clerk/express";
import User from "../models/user.model.js";

const validateUser = async (req, res, next) => {
    try{
        const {userId}  = getAuth(req);
        if(!userId){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }
        const user = await User.findOne({clerkId: userId});
        if(!user){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({success: false, message: "Error in verifing user"});
    }
}

export default validateUser;