import express from 'express';
import customerRoutes from './customer.routes.js';
import recommendationRoutes from './recommendation.routes.js'
import chatbotRoutes from './chatbot.routes.js';
import reportRoutes from './report.routes.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';

const router = express.Router();



// Daftarkan rute
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/reports', reportRoutes);
router.use('/products', productRoutes);


export default router;