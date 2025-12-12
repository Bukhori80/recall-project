import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();



// Rute: POST /api/v1/auth/login
router.post('/login', authController.loginAdmin);

router.post('/customer/register', authController.registerCustomer);
router.post('/customer/login', authController.loginCustomer)

export default router;