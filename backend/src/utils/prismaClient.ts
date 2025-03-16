import { PrismaClient } from "@prisma/client/edge";
import { Request, Response } from "express";

export const prismaClient = (req:Request, res:Response)=>{
  try{
      const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

  return prisma;
  }
  catch (err: any) {
    const message = err.message;
    res.status(400).json({ error: message });
  }
}