import jwt from 'jsonwebtoken';
import User from '../../../models/User.js';
import Customer from '../../../models/Customer.js';

// ==========================================
// 1. PROTECT (Hanya Cek Login / Identitas)
// ==========================================
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, tidak ada token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cek di kedua tabel
    // Tips Optimasi: Sebaiknya saat login, simpan 'role' di token jwt.sign({id, role: 'admin'})
    // Tapi logika di bawah ini tetap aman untuk sekarang.
    
    const user = await User.findById(decoded.id).select('-password');
    const customer = await Customer.findById(decoded.id).select('-password');

    if (user) {
        req.user = user;       // Ini Admin/Staff
        req.role = 'admin';    // Tandai sebagai admin
    } else if (customer) {
        req.customer = customer; // Ini Customer
        req.role = 'customer';   // Tandai sebagai customer
    } else {
        return res.status(401).json({ message: 'Token tidak valid.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token gagal verifikasi.' });
  }
};

// ==========================================
// 2. ADMIN ONLY (Penjaga Pintu Admin)
// ==========================================
export const adminOnly = (req, res, next) => {
    // Cek apakah 'protect' tadi menemukan user (Admin)
    if (req.user && req.role === 'admin') {
        next(); // Boleh lewat
    } else {
        res.status(403).json({ message: 'Akses Ditolak. Khusus Admin.' });
    }
};

// ==========================================
// 3. CUSTOMER ONLY (Penjaga Pintu Customer)
// ==========================================
export const customerOnly = (req, res, next) => {
    // Cek apakah 'protect' tadi menemukan customer
    if (req.customer && req.role === 'customer') {
        next(); // Boleh lewat
    } else {
        res.status(403).json({ message: 'Akses Ditolak. Khusus Customer.' });
    }
};