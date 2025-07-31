import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

export const register = async(req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:"Missing Details"});
    }


    try {
        const existingEmail = await userModel.findOne({email});
        if(existingEmail){
            return res.json({success:false, message:"Email Already Exist"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);



        const user = new userModel({
            
        })
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}