import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
       
        const userId = (req as any).user;
        
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
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const newUser = await prisma.user.create({
            data: {
                id: userId, // Use the authenticated user ID
                username,
                avatar: avatar || "p1", // Default avatar if not provided
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle Prisma unique constraint violation
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            res.status(409).json({ error: 'Username already taken' });
            return;
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
};