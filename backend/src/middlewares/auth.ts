import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken';
// import cookieParser from 'cookie-parser';  // not needed here since already present in app

 export const userAuth = async (req:Request, res:Response, next:NextFunction)=>{
  try{
      const prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      });
    const cookies = req.cookies;
    const { token } = cookies;
    
    if (!token){
      throw new Error("Invalid token!");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET||"");

    const dataObj = JSON.parse(JSON.stringify(decoded));

    const { userId } = dataObj;

    const user = await prisma.user.findUnique({where:{userId:userId}});
    if (!user){
      throw new Error("User not present!");
    }

    req.body = {userId, ...req.body};
    next();
  }  
  catch(err:any){
    const message = err.message;
    res.status(400).json({error:"Invalid credentials!", message})
  }
 }