import express from "express";
import { sendMessage } from "../controller/MessageController.js";
import protect from "../middlewares/auth.js";

const MessageRouter = express.Router();

MessageRouter.post("/send", protect, sendMessage);

export default MessageRouter;
