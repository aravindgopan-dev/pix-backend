import { createUser } from "../controlleres/userController";
import { Router } from "express";

const router=Router()

router.post("/create",createUser)


export default router