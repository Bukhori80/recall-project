import Customer from '../../../models/Customer.js';
import User from '../../../models/User.js';
import Recommendation from '../../../models/Recommendation.js'; // Import Recommendation
import Product from '../../../models/Product.js';
import jwt from 'jsonwebtoken';
import axios from 'axios'; 
import dotenv from 'dotenv';
dotenv.config();


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// ==========================================
// REGISTER CUSTOMER
// ==========================================
export const registerCustomer = async (req, res) => {
  try {
    const {
      username, password, email,
      device_brand, plan_type, 
      longitude, latitude, 
      avg_data_usage_gb, pct_video_usage, avg_call_duration,
      sms_freq, monthly_spend, topup_freq, travel_score, complaint_count
    } = req.body;

    if (avg_data_usage_gb < 0 || monthly_spend < 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Data usage atau spend tidak boleh negatif.' 
      });
    }
    
    // Pastikan skor travel antara 0 dan 1
    if (travel_score && (travel_score < 0 || travel_score > 1)) {
        return res.status(400).json({
            status: 'error',
            message: 'Travel score harus antara 0.0 sampai 1.0'
        });
    }

    // 1. Cek Username
    const existing = await Customer.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username sudah terpakai' });

    // 2. Prediksi Churn Risk (Ke Python)
    let churnRisk;
    try {
      
        const churnRes = await axios.post('http://127.0.0.1:5000/predict', {
            // Pastikan field ini dikirim semua!
            avg_data_usage_gb, // (Opsional bagi churn model ini, tapi kirim saja)
            monthly_spend, 
            travel_score, 
            pct_video_usage, 
            complaint_count, // PENTING
            plan_type,       // PENTING
            device_brand     // PENTING
        });
        
        if (churnRes.data.status === 'success') {
            churnRisk = churnRes.data.result.risk_score;
            console.log(churnRes.data);
            console.log(`⚠️ Churn Risk Calculated: ${churnRisk}`);
        }
    } catch (err) {
        console.warn("⚠️ Gagal koneksi ML Churn:", err.message);
    }

    let churn_risk = churnRisk;
    // 2. Simpan Customer (Skip churn logic manual, fokus ke register)
    const customer_id = 'C' + Date.now().toString().slice(-5);
    const newCustomer = await Customer.create({
      username, password, email, customer_id, device_brand, plan_type,
      location: { type: 'Point', coordinates: [longitude || 0, latitude || 0] },
      profile: {
        avg_data_usage_gb, pct_video_usage, avg_call_duration,
        sms_freq, monthly_spend, topup_freq, travel_score, complaint_count,
        churn_risk, engagement_score: 0
      }
    });

    // 4. AUTO-GENERATE REKOMENDASI (Dengan Mapping yang BENAR)
try {
        const recoRes = await axios.post('http://127.0.0.1:5000/recommend', {
            // ... data input ...
            avg_data_usage_gb, monthly_spend, pct_video_usage, travel_score,
            avg_call_duration, sms_freq, topup_freq, complaint_count,
            plan_type, device_brand
        });

 if (recoRes.data.status === 'success') {
            const mlOutputName = recoRes.data.offer_name; 
            const mlConfidence = recoRes.data.confidence || 0;
            
            console.log(`🤖 AI Suggestion: ${mlOutputName} (${mlConfidence}%)`);

            // --- PERUBAHAN UTAMA: CARI PRODUK DI DATABASE ---
            // Cari produk yang ml_label-nya sama dengan output ML
            console.log(mlOutputName);
            let matchedProduct = await Product.findOne({ ml_label: mlOutputName });
            console.log('Matched Product from DB:', matchedProduct);
            // Fallback: Jika produk tidak ketemu (misal typo), ambil produk General
            if (!matchedProduct) {
                console.warn(`⚠️ Produk '${mlOutputName}' tidak ada di DB. Menggunakan Fallback.`);
                matchedProduct = await Product.findOne({ category: 'GENERAL' });
            }

            if (matchedProduct) {
                // Simpan Rekomendasi berdasarkan Data Produk DB
                const newRec = await Recommendation.create({
                    customer: newCustomer._id,
                    type: matchedProduct.category, // Ambil dari DB
                    offer_name: matchedProduct.name, // Ambil dari DB
                    offer_details: matchedProduct.description, // Ambil dari DB
                    image_url: matchedProduct.image_url,
                    redirect_url: matchedProduct.redirect_url,
                    confidence_score: mlConfidence,
                    status: 'PENDING'
                });
                
                newCustomer.recommendations.push(newRec._id);
                await newCustomer.save();
            }
        }
    } catch (err) {
        console.warn("⚠️ Gagal Auto-Generate Rekomendasi:", err.message);
    }
    // 5. Generate Token
    const token = signToken(newCustomer._id);

res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      token,
      data: { username: newCustomer.username }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// LOGIN CUSTOMER
export const loginCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username }).select('+password');
    if (!customer || !(await customer.comparePassword(password))) {
       return res.status(401).json({ status: 'error', message: 'Username atau password salah' });
    }
    const token = signToken(customer._id);
    res.status(200).json({
         status: 'success',
         token, 
         data: {
             username: customer.username,
             customer_id: customer.customer_id, 
             plan_type: customer.plan_type, 
             email: customer.email, 
             device_brand: customer.device_brand, 
             churn_risk: customer.profile.churn_risk,
             avg_data_usage_gb: customer.profile.avg_data_usage_gb,
             pct_video_usage: customer.profile.pct_call_duration,
             avg_call_duration: customer.profile.avg_call_duration,
             sms_freq: customer.profile.sms_freq,
             monthly_spend: customer.profile.monthly_spend,
             topup_freq: customer.profile.topup_freq,
             travel_score: customer.profile.travel_score,
             churn_risk: customer.profile.churn_risk,
             engagement_score: customer.profile.engagement_score,
             recomendations: customer.recommendations
         }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// LOGIN ADMIN
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }
        const token = signToken(user._id);
        res.status(200).json({ status: 'success', token, role: 'admin' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};