import User from '../../../models/User.js';
import Customer from '../../../models/Customer.js';
import jwt from 'jsonwebtoken';

// Fungsi helper untuk membuat token
const signToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const registerUser = async (name, email, password) => {
  // 1. Cek jika user sudah ada
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  // 2. Buat user baru (password akan di-hash oleh hook di Model)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Buat token
  const token = signToken(user._id);

  // Hapus password dari output
  user.password = undefined;

  return { user, token };
};

export const loginUser = async (email, password) => {
  // 1. Cari user berdasarkan email
  // Kita perlu .select('+password') karena di model kita set `select: false`
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Email atau password salah');
  }

  // 2. Bandingkan password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  // 3. Buat token
  const token = signToken(user._id);

  // Hapus password dari output
  user.password = undefined;

  return { user, token };
};

export const loginCustomer = async (username, password) => {
  // 1. Cari user berdasarkan email
  // Kita perlu .select('+password') karena di model kita set `select: false`
  const user = await Customer.findOne({ username }).select('+password');

  if (!user) {
    throw new Error('Email atau password salah');
  }

  // 2. Bandingkan password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  // 3. Buat token
  const token = signToken(user._id);

  // Hapus password dari output
  user.password = undefined;

  return { user, token };
};