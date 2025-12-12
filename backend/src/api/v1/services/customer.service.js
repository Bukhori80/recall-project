import Customer from '../../../models/Customer.js';

/**
 * Service untuk mengambil semua customer (dengan pagination & search)
 */
export const findAllCustomers = async (page = 1, limit = 10, search = "") => {
  try {
    const skip = (page - 1) * limit;
    
    // Buat query filter
    const query = {};
    if (search) {
      // Cari berdasarkan customer_id atau email
      query.$or = [
        { customer_id: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Urutkan yg terbaru di atas
      
    const total = await Customer.countDocuments(query);

    return {
      customers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error(`Gagal mengambil data customer: ${error.message}`);
  }
};

/**
 * Service untuk mengambil detail customer berdasarkan customer_id
 */
export const findCustomerById = async (customerId) => {
  try {
    // Cari satu dokumen Customer berdasarkan field 'customer_id'
    // console.log(customerId);
    const customer = await Customer.findOne({ customer_id: customerId });
    // console.log(customer);
    // Jika tidak ditemukan, 'customer' akan bernilai 'null'
    return customer;
  } catch (error) {
    // Melempar error dengan pesan yang deskriptif
    throw new Error(`Gagal mengambil customer dengan ID ${customerId}: ${error.message}`);
  }
};

// Service untuk membuat customer baru
export const createCustomer = async (customerData) => {
  try {
    // Logika bisnis: buat customer baru
    // (Di sini kita bisa tambahkan validasi, dll)

    // Pastikan customer_id dan email ada
    if (!customerData.customer_id || !customerData.email) {
        throw new Error('customer_id dan email wajib diisi');
    }

    const newCustomer = new Customer(customerData);
    await newCustomer.save();
    return newCustomer;
  } catch (error) {
    throw new Error(`Gagal membuat customer baru: ${error.message}`);
  }
};

/**
 * Service untuk meng-update customer berdasarkan customer_id
 */
export const updateCustomer = async (customerId, updateData) => {
  try {
    // Kita cari berdasarkan 'customer_id' (bukan '_id')
    const customer = await Customer.findOneAndUpdate(
      { customer_id: customerId }, // Kriteria pencarian
      { $set: updateData },        // Data baru (gunakan $set untuk update parsial)
      { 
        new: true, // Mengembalikan dokumen yang SUDAH di-update
        runValidators: true // Menjalankan validasi skema saat update
      }
    );
    // Jika tidak ditemukan, 'customer' akan bernilai 'null'
    return customer; 
  } catch (error) {
    throw new Error(`Gagal mengupdate customer: ${error.message}`);
  }
};

/**
 * Service untuk menghapus customer berdasarkan customer_id
 */
export const deleteCustomer = async (customerId) => {
  try {
    const customer = await Customer.findOneAndDelete(
      { customer_id: customerId } // Kriteria pencarian
    );
    // Jika tidak ditemukan, 'customer' akan bernilai 'null'
    return customer;
  } catch (error) {
    throw new Error(`Gagal menghapus customer: ${error.message}`);
  }
};

/**
 * Service untuk update lokasi customer (GeoJSON)
 */
export const updateLocation = async (customerId, longitude, latitude) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { customer_id: customerId },
      {
        $set: {
          // Format GeoJSON 'Point'
          location: {
            type: 'Point',
            coordinates: [longitude, latitude], // PENTING: [longitude, latitude]
          },
        },
      },
      { new: true } // Kembalikan data yang sudah di-update
    );
    return customer;
  } catch (error) {
    throw new Error(`Gagal mengupdate lokasi: ${error.message}`);
  }
};

/**
 * Service untuk mencari customer terdekat menggunakan $near
 */
export const findNearbyCustomers = async (longitude, latitude, maxDistance) => {
  try {
    // Ini adalah kueri geospasial MongoDB!
    const customers = await Customer.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance, // Jarak dalam METER
        },
      },
    }).select('customer_id email location'); // Hanya pilih field yg relevan

    return customers;
  } catch (error)
 {
    throw new Error(`Gagal mencari customer terdekat: ${error.message}`);
  }
};


/**
 * Service untuk register FCM token
 */
export const registerFCMToken = async (customerId, fcmToken) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { customer_id: customerId },
      { $set: { fcm_token: fcmToken } }, // Simpan token ke database
      { new: true }
    );
    return customer;
  } catch (error) {
    throw new Error(`Gagal mendaftarkan FCM Token: ${error.message}`);
  }
};


export const findRoamingCustomers = async () => {
  try {
    // Asumsi: "roaming" adalah customer dengan travel_score tinggi
    const customers = await Customer.find({ 
      'profile.travel_score': { $gte: 0.5 } 
    })
    .select('customer_id email location profile.travel_score')
    .limit(10); // Ambil 10 teratas

    return customers;
  } catch (error) {
    throw new Error(`Gagal menemukan customer roaming: ${error.message}`);
  }
};