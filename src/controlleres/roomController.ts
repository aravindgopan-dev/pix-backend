import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
       
        const user = (req as any).user; // Get user from middleware

        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Room name is required' });
            return
        }

        // Use the authenticated user's ID
        const creatorId = user

        const newRoom = await prisma.room.create({
            data: {
                name,
                creatorId,
                users: {
                    create: { userId: creatorId },
                },
            },
            include: {
                creator: true,
                users: { include: { user: true } },
            },
        });

        res.status(201).json(newRoom);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const getUserRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("here")
        console.log("Fetching user rooms");

        const user = (req as any).user; // Get user from middleware
        console.log("User ID:", user,"hii");

        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Fetch rooms where the user is the creator
        const rooms = await prisma.room.findMany({
            where: { creatorId: user }
            // include: {
            //     users: {
            //         include: { user: true },
            //     },
            // },
        });
        console.log(rooms)

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};





export const joinRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;
        const { roomId } = req.body;
        console.log("testing")

        if (!roomId) {
            res.status(400).json({ error: 'Room ID is required' });
            return;
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: user }
        });

        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if room exists
        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }

        // Check if user is already in the room
        const existingUserRoom = await prisma.roomUser.findFirst({
            where: {
                userId: user,
                roomId
            }
        });

        if (existingUserRoom) {
            console.log(existingUserRoom)
            res.status(400).json({ error: 'User already in this room' });
            return;
        }

        // Add user to the room
        const userRoom = await prisma.roomUser.create({
            data: {
                userId: user,
                roomId
            }
        });

        res.status(200).json(userRoom);
    } catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getJoinedRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const userRooms = await prisma.roomUser.findMany({
            where: { userId: user },
            select: {
                room: {
                    select: {
                        id: true,           // roomId
                        name: true,         // roomName
                        creatorId: true,    // needed for isCreator check
                        creator: {
                            select: {
                                username: true  // creator name
                            }
                        },
                        _count: {
                            select: {
                                users: true     // total members count
                            }
                        }
                    }
                }
            },
            orderBy: {
                room: {
                    createdAt: 'desc'
                }
            }
        });

        // Transform to simplified structure
        const simplifiedRooms = userRooms.map(({ room }) => ({
            roomId: room.id,
            roomName: room.name,
            creatorName: room.creator.username,
            totalMembers: room._count.users,
            isCreator: room.creatorId === user
        }));

        res.status(200).json(simplifiedRooms);
    } catch (error) {
        console.error("Error fetching joined rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};