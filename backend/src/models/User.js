import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Format email tidak valid',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi'],
    minlength: 6,
    select: false, // Jangan kirim password di response .find()
  },
  role: {
    type: String,
    enum: ['admin', 'viewer'],
    default: 'viewer',
  }
}, { timestamps: true });

// === PENTING: Hashing Password ===
// Ini adalah "hook" yang berjalan otomatis SEBELUM .save()
UserSchema.pre('save', async function (next) {
  // Hanya hash password jika baru atau dimodifikasi
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt & hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method untuk membandingkan password (untuk Login)
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);