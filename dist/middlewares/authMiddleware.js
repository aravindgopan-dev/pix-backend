"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasPermission;
const express_1 = require("@clerk/express");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
function hasPermission(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.headers.authorization);
        const auth = (0, express_1.getAuth)(req);
        console.log(auth);
        if (auth.userId === null) {
            res.status(401).json({ error: "Please login" });
            return;
        }
        try {
            req.user = auth.userId;
            console.log(auth.userId);
            next();
        }
        catch (error) {
            console.error("Error fetching user details:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
