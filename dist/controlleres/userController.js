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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized - Please login' });
            return;
        }
        const { username, avatar } = req.body;
        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }
        const newUser = yield prisma.user.create({
            data: {
                id: userId, // Use the authenticated user ID
                username,
                avatar: avatar || "p1", // Default avatar if not provided
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        // Handle Prisma unique constraint violation
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            res.status(409).json({ error: 'Username already taken' });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createUser = createUser;
