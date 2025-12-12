import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

// Skema untuk data teknis/profil (Input saat Register)
const CustomerProfileSchema = new Schema({
    avg_data_usage_gb: { type: Number, default: 0 },
    pct_video_usage: { type: Number, default: 0 },
    avg_call_duration: { type: Number, default: 0 },
    sms_freq: { type: Number, default: 0 },
    monthly_spend: { type: Number, default: 0 },
    topup_freq: { type: Number, default: 0 },
    travel_score: { type: Number, default: 0 },
    churn_risk: { type: Number, default: 0 }, // Hasil prediksi ML nanti
    engagement_score: { type: Number, default: 0 }, // Bertambah saat klik rekomendasi
    churn_factors: { type: [String], default: [] }
}, { _id: false });

const CustomerSchema = new Schema({
    // --- Login Info ---
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Disembunyikan secara default
    
    // --- Identitas & Device ---
    email: { type: String }, 
    customer_id: { type: String, unique: true }, // Generate otomatis nanti
    plan_type: { type: String, enum: ['Prepaid', 'Postpaid'], default: 'Prepaid' },
    device_brand: { type: String },

    // --- Lokasi ---
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [Longitude, Latitude]
    },
    
    // --- Data Profil ---
    profile: CustomerProfileSchema,

    // --- Relasi ---
    recommendations: [{ type: Schema.Types.ObjectId, ref: 'Recommendation' }]
}, { timestamps: true });

// Hook: Hash password sebelum simpan
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Cek password
CustomerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Customer', CustomerSchema);