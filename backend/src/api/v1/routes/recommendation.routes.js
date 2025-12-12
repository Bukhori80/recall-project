import express from 'express';
import * as recommendationController from '../controllers/recommendation.controller.js';
import { protect, adminOnly, customerOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();
// Semua rute di bawah ini sekarang terproteksi
router.use(protect);

// (Helper untuk testing: Buat rekomendasi dummy)
router.post('/', adminOnly, recommendationController.createRecommendation);

// Rute untuk Memicu Pengiriman Notifikasi
// POST /api/v1/recommendations/CUST123/send
// Ini berarti "Cari rekomendasi PENDING untuk CUST123, lalu kirim"
router.post('/:customerId/send-adaptive', adminOnly, recommendationController.sendAdaptiveRecommendation);

router.get('/:recommendationId', customerOnly, recommendationController.getRecommendation);
router.post('/:recommendationId/click', customerOnly, recommendationController.clickRecommendation);

router.post('/:customerId/generate-ai', customerOnly, recommendationController.generateMLRecommendation);

export default router;