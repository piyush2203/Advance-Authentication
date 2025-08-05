import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
// import { use } from "react";

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



        const user = new userModel({name,email, password:hashedPassword});
        await user.save();
        


        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        //jwt.sign(payload, secret, options)
        res.cookie("token", token, {
            httpOnly: true,
            secure:process.env.NODE_ENV==='PRODUCTION',
            sameSite:process.env.NODE_ENV==='PRODUCTION'?"none":"strict",
            maxAge: 7*24*60*60*1000

        });

        return res.json({success:true});
        //COOKIE 
        // {
        //     "id": "67845d4322a743c607627417",  // user's MongoDB _id
        //     "iat": 1712891186,                // issued at time
        //     "exp": 1712977586                 // expiration time
        // }

    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export const login = async(req,res)=>{
    const{ email, password} = req.body;

    if(!email || !password){
        res.json({success:false, message:"Email and Password are required"});
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"Invalid Email"});
        }

        const isMatched  = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.json({success: false, message:"Invalid Password"});
        }

        if(isMatched){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"}); 
            res.cookie("token", token, {
            httpOnly: true,
            secure:process.env.NODE_ENV==='PRODUCTION',
            sameSite:process.env.NODE_ENV==='PRODUCTION'?"none":"strict",
            maxAge: 7*24*60*60*1000

        });
        }


        return res.json({success:true});

        
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}


export const logout = async(req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure:process.env.NODE_ENV==='PRODUCTION',
            sameSite:process.env.NODE_ENV==='PRODUCTION'?"none":"strict",
        })

        return res.json({success:true, message:"Logged Out"});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}