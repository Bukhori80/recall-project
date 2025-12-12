import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nama produk wajib diisi'],
    trim: true 
  },
  
  description: { 
    type: String, 
    required: [true, 'Deskripsi wajib diisi'] 
  },
  
  category: { 
    type: String, 
    enum: [
        'Data Booster', 
        'Device Upgrade Offer', 
        'Family Plan Offer', 
        'General Offer', 
        'Retention Offer', 
        'Roaming Pass', 
        'Streaming Partner Pack', 
        'Top-up Promo', 
        'Voice Bundle',
        'SMS Bundle'
    ],
    required: true 
  },
  
  price: { 
    type: Number, 
    required: [true, 'Harga wajib diisi'],
    min: [0, 'Harga tidak boleh negatif']
  },

  // Field Tambahan untuk Detail Teknis
  quota_amount: { type: Number, default: 0, help: "Dalam GB" },
  validity_days: { type: Number, default: 30, help: "Masa aktif dalam hari" },
  
  // KUNCI SINKRONISASI ML (Sangat Penting)
  ml_label: { 
    type: String, 
    required: [true, 'ML Label wajib diisi untuk mapping'], 
    unique: true,
    trim: true
  },
  
  image_url: { type: String, default: 'https://placehold.co/600x400' },
  redirect_url: { type: String, default: '#' },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);