import express from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';



const router = express.Router();
// Semua rute di bawah ini sekarang terproteksi
router.use(protect);

// Rute: GET /api/v1/customers
// Tugas: Mengambil semua customer
router.get('/', customerController.getAllCustomers);

// Rute: POST /api/v1/customers
// Tugas: Membuat customer baru (untuk testing)
router.post('/', adminOnly, customerController.createCustomer);

// Rute: GET /api/v1/customers/nearby
// Tugas: Mencari customer terdekat (untuk dashboard/geomap)
router.get('/nearby', adminOnly, customerController.findCustomersNearby);


router.get('/roaming-list', adminOnly, customerController.getRoamingCustomers);

router.get('/:customerId', customerController.getCustomerById);

// Rute: GET /api/v1/customers/C00001
router.get('/:customerId', customerController.getCustomerById);

// Rute: PATCH /api/v1/customers/C00001 (untuk EDIT)
router.patch('/:customerId', customerController.updateCustomer);

// Rute: DELETE /api/v1/customers/C00001 (untuk DELETE)
router.delete('/:customerId', adminOnly, customerController.deleteCustomer);


// Rute: PATCH /api/v1/customers/C00001/location
// Tugas: Endpoint khusus untuk update lokasi dari aplikasi mobile
router.patch('/:customerId/location', customerController.updateCustomerLocation);

// Rute: PATCH /api/v1/customers/C00001/register-fcm
// Tugas: Mendaftarkan FCM token dari aplikasi mobile
router.patch('/:customerId/register-fcm', adminOnly, customerController.registerFCMToken);



export default router;