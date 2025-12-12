import express from 'express';
import * as chatbotController from '../controllers/chatbot.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
// Semua rute di bawah ini sekarang terproteksi
router.use(protect);
router.post('/message', chatbotController.handleMessage);

export default router;