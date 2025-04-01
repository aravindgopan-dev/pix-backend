import { Router } from "express";
import { createRoom,getUserRooms,joinRoom,getJoinedRooms } from "../controlleres/roomController";

const router = Router();


router.post("/create", createRoom);
router.get("/created",getUserRooms);
router.post("/join",joinRoom);
router.get("/joined",getJoinedRooms);
 
export default router; 