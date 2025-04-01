"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controlleres/userController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/create", userController_1.createUser);
exports.default = router;
