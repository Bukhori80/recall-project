import * as customerService from '../services/customer.service.js';
import Customer from '../../../models/Customer.js';



// Controller untuk mengambil semua customer
export const getAllCustomers = async (req, res, next) => {
  try {
    // Ambil query params dari URL (e.g., /customers?page=2&limit=5&search=C00)
    const { page, limit, search } = req.query;

    const result = await customerService.findAllCustomers(page, limit, search);
    
    res.status(200).json({
      status: 'success',
      data: result.customers,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};



// Controller untuk membuat customer baru
export const createCustomer = async (req, res, next) => {
  try {
    // 1. Ambil data customer dari body request
    const customerData = req.body;

    // 2. Panggil service untuk menyimpan ke DB
    const newCustomer = await customerService.createCustomer(customerData);

    // 3. Kirim response sukses (status 201 = Created)
    res.status(201).json({
      status: 'success',
      data: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
/**
 * Controller untuk meng-update (Edit) data customer
 */
export const updateCustomer = async (req, res, next) => {
  try {
    // 1. Ambil customerId dari parameter URL (contoh: 'C00001')
    const { customerId } = req.params;
    // 2. Ambil data yang ingin di-update dari body
    const updateData = req.body;

    // 3. Panggil service (si Koki) untuk update
    const updatedCustomer = await customerService.updateCustomer(customerId, updateData);

    // 4. Cek jika customer tidak ditemukan
    if (!updatedCustomer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer tidak ditemukan',
      });
    }

    // 5. Kirim response sukses
    res.status(200).json({
      status: 'success',
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller untuk menghapus data customer
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    // 1. Ambil customerId dari parameter URL
    const { customerId } = req.params;

    // 2. Panggil service untuk delete
    const deletedCustomer = await customerService.deleteCustomer(customerId);

    // 3. Cek jika customer tidak ditemukan
    if (!deletedCustomer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer tidak ditemukan',
      });
    }

    // 4. Kirim response sukses (opsional: kirim balik data yg dihapus)
    res.status(200).json({
      status: 'success',
      message: `Customer ${customerId} berhasil dihapus.`,
      data: deletedCustomer,
    });
    // Alternatif (jika tidak ingin kirim data balik):
    // res.status(204).send(); // 204 = No Content
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller untuk meng-update lokasi customer
 */
export const updateCustomerLocation = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    // Ambil data longitude dan latitude dari body
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({ // 400 = Bad Request
        status: 'error',
        message: 'Longitude dan Latitude wajib diisi',
      });
    }

    // Panggil service untuk update lokasi
    const updatedCustomer = await customerService.updateLocation(
      customerId,
      longitude,
      latitude
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer tidak ditemukan',
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Lokasi ${customerId} berhasil diperbarui.`,
      data: updatedCustomer.location, // Kirim balik lokasi barunya
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller untuk mencari customer terdekat
 */
export const findCustomersNearby = async (req, res, next) => {
  try {
    // Ambil data dari query string (contoh: ?lng=106.8&lat=-6.2&dist=5000)
    const { lng, lat, dist } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter lng (longitude) dan lat (latitude) wajib diisi',
      });
    }

    // Panggil service
    const customers = await customerService.findNearbyCustomers(
      parseFloat(lng),
      parseFloat(lat),
      parseInt(dist || 1000) // Default 1000 meter (1km) jika dist tidak ada
    );

    res.status(200).json({
      status: 'success',
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


/**
 * Controller untuk untuk register FCM Token
 */
export const registerFCMToken = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { token } = req.body; // Aplikasi mobile harus mengirim { "token": "..." }

    if (!token) {
      return res.status(400).json({ status: 'error', message: 'FCM Token wajib diisi' });
    }

    const customer = await customerService.registerFCMToken(customerId, token);

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer tidak ditemukan' });
    }

    res.status(200).json({
      status: 'success',
      message: 'FCM Token berhasil terdaftar',
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Controller untuk mengambil data customer dengan id
 */
export const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // 1. Cari data di DB
    // (Asumsi kita cari berdasarkan field 'customer_id' string "C99...", bukan _id Mongo)
    const customer = await Customer.findOne({ customer_id: customerId }); 

    if (!customer) return res.status(404).json({ message: 'Customer tidak ditemukan' });

    // === SECURITY CHECK (IDOR Protection) ===
    
    // Jika yang request adalah Admin, BOLEH lewat.
    // Jika yang request adalah Customer, PASTIKAN ID-nya cocok dengan tokennya.
    if (req.role === 'customer') {
        // Bandingkan _id dari token (req.customer._id) dengan _id data yang diambil
        if (req.customer._id.toString() !== customer._id.toString()) {
            return res.status(403).json({ message: 'Anda tidak berhak melihat profil orang lain.' });
        }
    }
    // ========================================

    res.status(200).json({ status: 'success', data: customer });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller untuk mengambil data customer dan data rekomenadasinya dengan id
 */
export const findCustomerById = async (customerId) => {
  try {
    // Temukan customer DAN populate (gabungkan) data rekomendasinya
    const customer = await Customer.findOne({ customer_id: customerId })
      .populate('recommendations'); // Ini akan mengambil data dari tabel 'Recommendation'

    return customer;
  } catch (error) {
    throw new Error(`Gagal menemukan customer: ${error.message}`);
  }
};


export const getRoamingCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.findRoamingCustomers();
    res.status(200).json({
      status: 'success',
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};