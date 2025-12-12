import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();
// Semua rute di bawah ini sekarang terproteksi
router.use(protect);

// Rute: GET /api/v1/reports/churn
// Tugas: Mendapat data agregat untuk laporan churn
router.get('/churn', adminOnly, reportController.getChurnReport);

// Rute: GET /api/v1/reports/recommendations
// Tugas: Mendapat data agregat untuk laporan rekomendasi
router.get('/recommendations', adminOnly, reportController.getRecommendationReport);

// Rute: GET /api/v1/reports/usage
// Tugas: Mendapat data agregat untuk laporan penggunaan
router.get('/usage', adminOnly, reportController.getUsageReport);

// Rute: GET /api/v1/reports/dashboard
// Tugas: Mendapat data agregat untuk laporan dashboard
router.get('/dashboard', adminOnly, reportController.getDashboardReport);
// Endpoint untuk Dashboard Admin
// Sebaiknya dilindungi middleware admin jika sudah ada
router.get('/ai-performance', adminOnly, reportController.getAIPerformanceStats);
export default router;