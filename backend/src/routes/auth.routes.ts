import express from 'express'
import { getme, login, logout, signup } from '../controllers/auth.controller.js';
import protectedme from '../middlewares/protected.js';

const router = express.Router();
router.post('/signup',signup)
router.post('/logout',logout)
router.post('/login',login)
router.get('/me',protectedme ,getme)

export default router