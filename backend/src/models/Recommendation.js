import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  
  // Kategori (Hasil ML)
  type: { 
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
  
  // Detail Produk (Hasil Mapping Backend)
  offer_name: { type: String, required: true },
  offer_details: { type: String },
  
  // --- TAMBAHAN BARU SESUAI IDE ANDA ---
  image_url: { type: String, default: 'https://placehold.co/600x400?text=No+Image' },
  redirect_url: { type: String, default: '#' },
  // -------------------------------------

  confidence_score: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ['PENDING', 'SENT', 'CLICKED', 'ACCEPTED', 'REJECTED'], 
    default: 'PENDING' 
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Recommendation', RecommendationSchema);