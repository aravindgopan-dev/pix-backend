import { getAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv"
dotenv.config()

// const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function hasPermission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log(req.headers.authorization)
  
   
  const auth = getAuth(req);
  console.log(auth)
  if (auth.userId === null) {
    res.status(401).json({ error: "Please login" });
    return;
  }

  try {
    
    (req as any).user = auth.userId;
    console.log(auth.userId)
    next();
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}