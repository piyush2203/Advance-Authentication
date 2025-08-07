import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// import { use } from "react";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "Email Already Exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //jwt.sign(payload, secret, options)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //send welcome email

    const mailOptions = {
      from: "piyushgupta21506@gmail.com",
      to: email,
      subject: "WELCOME TO MY COMPANY",
      text: `Welcome to my website, you are successfully registered with your email ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ success: false, message: "Email and Password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    if (isMatched) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOTP = async (req, res) => {
  try {
    const userId = req.userId; // taken from middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User Already Verified" });
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: "piyushgupta21506@gmail.com",
      to: user.email, // fixed email bug
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



export const verifyEmail = async(req,res) =>{
    const { otp } = req.body;
    const userId = req.userId; // from middleware


    if(!userId||!otp){
        return res.json({success:false, message:"Missing Details"});
    }

    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User Not Found"});
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success:false, message:"Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: "OTP Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json({ success: true, message: "Email Verified Successfully" });
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

//check if user is authenticated
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}


//to send the reset otp
export const sendResetOtp = async(req,res)=>{
    const {email} = req.body;

    if(!email){
      return res.json({ success: false, message: "Email is required" });
      
    }

    try {
      const user =await userModel.findOne({email});

      if(!user){
        return res.json({ success: false, message:"User Not Found"});
      }

      const otp = String(Math.floor(Math.random() * 900000 + 100000));
      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

      await user.save();

      const mailOptions = {
        from: "piyushgupta21506@gmail.com",
        to: user.email, // fixed email bug
        subject: "Account Verification OTP",
        text: `Your reset OTP is ${otp}. Use this OTP to reset your password.`,
      };

      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
}


//reset user password

export const resetPassword  = async(req,res)=>{
  const {email,newPassword,otp} = req.body;
  if(!email|| !newPassword|| !otp){
    return res.json({success:false, message: "Email, OTP and New Password is required"});
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
       return res.json({success:false, message: "User not found"});

    }

    if(user.resetOtp !== otp || user.resetOtp === ""){
      return res.json({success:false, message: "Invalid OTP"});
    }


    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false, message: "OTP Expired"});
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt= 0;

    await user.save();

    return res.json({ success: true, message: "Password has been saved Successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}



