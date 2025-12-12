import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
// import { protect, adminOnly } from '../middlewares/authMiddleware.js'; // Jika ada middleware auth

const router = express.Router();

// Semua rute di bawah ini terproteksi
router.use(protect);

// Public Routes (Bisa diakses siapa saja/frontend)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin Routes (Harusnya dilindungi middleware, untuk demo kita buka dulu)
router.post('/', adminOnly, productController.createProduct);
router.patch('/:id', adminOnly, productController.updateProduct);
router.delete('/:id', adminOnly, productController.deleteProduct);

export default router;