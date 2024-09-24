import express from "express";
import protectedme from "../middlewares/protected.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router()

router.post('/send:id',protectedme,sendMessage)
router.get('/:id',protectedme,getMessages)
router.get('/conversation',protectedme,getUsersForSidebar)

export default router