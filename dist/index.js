"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const roomRouter_1 = __importDefault(require("./routers/roomRouter"));
const userRoute_1 = __importDefault(require("./routers/userRoute"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins
    credentials: true // Allow credentials (cookies, headers, etc.)
}));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, express_2.clerkMiddleware)());
app.use(express_1.default.json());
app.use(authMiddleware_1.default);
app.use("/api/v1/room", roomRouter_1.default);
app.use("/api/v1/user", userRoute_1.default);
app.get("/", (req, res) => {
    res.json({ name: "Aravind" });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
