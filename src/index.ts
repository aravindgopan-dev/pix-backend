import express, { Request, Response, NextFunction } from "express";
import { getAuth, clerkMiddleware } from "@clerk/express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import hasPermission from "./middlewares/authMiddleware";
import roomRouter from "./routers/roomRouter"
import userRouter from "./routers/userRoute"
const app = express();
dotenv.config();
app.use(cors({
  origin: ["http://localhost:3000", "https://pix-frontend-eight.vercel.app"],  
  credentials: true,  // Allow credentials (cookies, headers, etc.)
  methods: ["GET", "POST"]
}));



app.use(cookieParser());
app.use(morgan("dev"));
app.use(clerkMiddleware());
app.use(express.json())
app.use(hasPermission);


app.use("/api/v1/room",roomRouter)
app.use("/api/v1/user",userRouter)

app.get("/", (req: Request, res: Response) => {
  res.json({ name: "Aravind" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
