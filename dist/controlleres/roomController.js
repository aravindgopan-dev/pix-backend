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
exports.getJoinedRooms = exports.joinRoom = exports.getUserRooms = exports.createRoom = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Get user from middleware
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Room name is required' });
            return;
        }
        // Use the authenticated user's ID
        const creatorId = user;
        const newRoom = yield prisma.room.create({
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
    }
    catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createRoom = createRoom;
const getUserRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here");
        console.log("Fetching user rooms");
        const user = req.user; // Get user from middleware
        console.log("User ID:", user, "hii");
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        // Fetch rooms where the user is the creator
        const rooms = yield prisma.room.findMany({
            where: { creatorId: user }
            // include: {
            //     users: {
            //         include: { user: true },
            //     },
            // },
        });
        console.log(rooms);
        res.status(200).json(rooms);
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserRooms = getUserRooms;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { roomId } = req.body;
        console.log("testing");
        if (!roomId) {
            res.status(400).json({ error: 'Room ID is required' });
            return;
        }
        // Check if user exists
        const userExists = yield prisma.user.findUnique({
            where: { id: user }
        });
        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Check if room exists
        const room = yield prisma.room.findUnique({
            where: { id: roomId }
        });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        // Check if user is already in the room
        const existingUserRoom = yield prisma.roomUser.findFirst({
            where: {
                userId: user,
                roomId
            }
        });
        if (existingUserRoom) {
            console.log(existingUserRoom);
            res.status(400).json({ error: 'User already in this room' });
            return;
        }
        // Add user to the room
        const userRoom = yield prisma.roomUser.create({
            data: {
                userId: user,
                roomId
            }
        });
        res.status(200).json(userRoom);
    }
    catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.joinRoom = joinRoom;
const getJoinedRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const userRooms = yield prisma.roomUser.findMany({
            where: { userId: user },
            select: {
                room: {
                    select: {
                        id: true, // roomId
                        name: true, // roomName
                        creatorId: true, // needed for isCreator check
                        creator: {
                            select: {
                                username: true // creator name
                            }
                        },
                        _count: {
                            select: {
                                users: true // total members count
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
    }
    catch (error) {
        console.error("Error fetching joined rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getJoinedRooms = getJoinedRooms;
