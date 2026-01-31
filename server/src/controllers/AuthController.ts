import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request , Response } from "express";
const JWT_SECRET = process.env.JWT_SECRET;

import nodemailer from "nodemailer";
import { hash } from "crypto"
import { error } from "console";

export const userLogin =async (req:Request , res: Response): Promise<void>=>{
 try{
    const {email , password } = req.body;
    if(!email  || !password ){
       res.status(400).json({error : "Missing required fields"});
       return ;
    }
  
    const user = await prisma.user.findUnique({where: {email}});
    if(!user){
       res.status(401).json({error: "Invalid credentials"})
       return ;
    };
    if(!user.passwordHash){
      res.status(400).json({error:"Something went wrong"})
      return;
    }

    const valid = await bcrypt.compare(password , user.passwordHash);
    if(!valid){
       res.status(401).json({error: "Invalid credentials"})
       return;
    }
    
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in env"); // stop app startup
    }
     
    const token = jwt.sign(
      {userId: user.userId , email:user.email}, 
      JWT_SECRET, 
      {expiresIn: "7d"}
    )
    res.status(200).json({message: "Login successful", token , userId:user.userId , email:user.email});
 }
 catch(error){
   res.status(500).json({error:"Internal server error"});

 }
};

export const userSignUp =async (req: Request , res: Response): Promise<void>=>{
  try {
    const {username , email , password ,profilePictureUrl } = req.body;
    
    console.log(username , email , password , profilePictureUrl);
    
    if(!username || !email || !password || !profilePictureUrl){
         res.status(400).json({error: "Missing required fields"})
         return ;
    };
    // check existing user
    const existingUser = await prisma.user.findUnique({where:{email} });
    if(existingUser){
       res.status(400).json({ error:"User already exists"})
       return;
    };


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data:{
        username, email, passwordHash:hashedPassword , profilePictureUrl
      }
    })
     res.status(201).json({message:"User created successfully" , userId:newUser.userId});
  } catch (error) {
    console.error(error) 
     res.status(400).json({error: "Internal Server Error"});
  }
};
 

export const getOtp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const createotp = await prisma.oTP.upsert({
      where:  {email} ,
      update: { otp, expiresAt, password },
      create: { email, password, otp, expiresAt },
    });
console.log(createotp);
    if (!createotp) {
      return res.status(400).json({
        error: "Internal Server Error. Please try again later.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Project Management" <no-reply@yourapp.com>',
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP Error:", error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};

export const checkOtp = async (req:Request , res:Response)=>{
 const  {userotp} = req.body;
 console.log(userotp);
 try {
    const token = await prisma.oTP.findFirst({
      where:{
        otp:userotp.trim(),
        expiresAt:{
          gt:new Date(),
        }
      }
  })

   if(!token){
     return res.status(400).json({
      error:"Invalid or expire OTP"
     })
   }
   const hashed = await bcrypt.hash(token?.password, 10);
   
   await prisma.user.update({
    where:{
      email:token.email,
    },
    data:{passwordHash:hashed}
   });

    // delete used otp
   await prisma.oTP.delete({where:{id: token.id}});

   res.status(200).json({message : "Password reset successful"});
   
 } catch (error) {
   res.status(400).json({
    error:"Something Went Wrong"
   })
 }
};