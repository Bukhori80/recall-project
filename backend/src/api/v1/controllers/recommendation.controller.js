import * as recommendationService from '../services/recommendation.service.js';
import Customer from '../../../models/Customer.js';
import Recommendation from '../../../models/Recommendation.js';
import Product from '../../../models/Product.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getRecommendation = async (req, res, next) => {
  try {
    const { recommendationId } = req.params;
    const recommendation = await recommendationService.getRecommendationById(recommendationId);

    if (!recommendation) {
      return res.status(404).json({ status: 'error', message: 'Rekomendasi tidak ditemukan.' });
    }
    res.status(200).json({
      status: 'success',
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const sendAdaptiveRecommendation = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const result = await recommendationService.sendAdaptiveNotification(customerId);

    if (!result) {
      return res.status(404).json({ status: 'error', message: 'Tidak ada rekomendasi PENDING atau customer tidak ditemukan.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Notifikasi adaptif berhasil dikirim.',
      data: result
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// (Helper untuk testing)
export const createRecommendation = async (req, res, next) => {
  try {
    const newRec = await recommendationService.createRecommendation(req.body);
    res.status(201).json({ status: 'success', data: newRec });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const handleRecommendationClick = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { customerId } = req.body; // Didapat dari token middleware

    // 1. Update Status Rekomendasi
    const rec = await Recommendation.findByIdAndUpdate(recommendationId, {
      status: 'ACCEPTED' // Atau CLICKED
    });

    if (!rec) return res.status(404).json({ message: 'Rekomendasi tidak ditemukan' });

    // 2. Tambah Engagement Score Customer
    // Misal: Setiap klik nambah 0.5 poin
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { 'profile.engagement_score': 0.5 }
    });

    // 3. Tentukan URL Redirect
    let redirectUrl = "";

    // Logika Redirect Sesuai Revisi Anda
    if (rec.type === 'ROAMING' || rec.type === 'DATA_BOOSTER') {
      redirectUrl = "https://www.telkomsel.com/paket-data"; // Contoh situs resmi
    } else if (rec.type === 'GENERAL' && rec.offer_name.toLowerCase().includes('video')) {
      redirectUrl = "https://www.netflix.com/id"; // Situs streaming
    } else if (rec.offer_name.toLowerCase().includes('topup')) {
      redirectUrl = "https://www.tokopedia.com/pulsa"; // Situs Topup
    } else {
      redirectUrl = "https://www.google.com"; // Default
    }

    res.status(200).json({
      status: 'success',
      message: 'Engagement recorded',
      redirectUrl: redirectUrl
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const clickRecommendation = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    // req.user.id didapat dari middleware auth (token customer)
    const customerId = req.user.id;

    // 1. Update Status Rekomendasi
    const rec = await Recommendation.findOneAndUpdate(
      { _id: recommendationId },
      { status: 'ACCEPTED' }, // Tandai diterima/diklik
      { new: true }
    );

    if (!rec) return res.status(404).json({ message: 'Rekomendasi tidak ditemukan' });

    // 2. Tambah Engagement Score Customer (+1 poin per klik)
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { 'profile.engagement_score': 1 }
    });

    // 3. Tentukan URL Redirect (Logika Bisnis)
    let targetUrl = "https://www.telkomsel.com"; // Default
    const offerName = rec.offer_name.toLowerCase();
    const type = rec.type;

    if (type === 'ROAMING') {
      targetUrl = "https://www.telkomsel.com/roaming";
    } else if (type === 'DATA_BOOSTER') {
      targetUrl = "https://www.telkomsel.com/paket-data";
    } else if (offerName.includes('video') || offerName.includes('netflix')) {
      targetUrl = "https://www.netflix.com/id";
    } else if (offerName.includes('topup') || offerName.includes('pulsa')) {
      targetUrl = "https://www.tokopedia.com/pulsa";
    }

    res.status(200).json({
      status: 'success',
      message: 'Redirecting...',
      redirect_url: targetUrl
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }

};

export const generateMLRecommendation = async (req, res) => {
  try {
    const { customerId } = req.params;

    // 1. Ambil Data Customer
    const customer = await Customer.findOne({ customer_id: customerId });
    if (!customer) return res.status(404).json({ message: 'Customer tidak ditemukan' });

    // 2. Panggil Python ML
    // Python akan mengembalikan salah satu dari 9 string di atas
    let mlOutputName = 'General Offer';
    let confidence_score = 0;
    try {
      const mlRes = await axios.post(process.env.ML_SERVICE_URL + '/recommend', {
        avg_data_usage_gb: customer.profile.avg_data_usage_gb,
        monthly_spend: customer.profile.monthly_spend,
        pct_video_usage: customer.profile.pct_video_usage,
        travel_score: customer.profile.travel_score,
        complaint_count: customer.profile.complaint_count,

        avg_call_duration: customer.profile.avg_call_duration,
        sms_freq: customer.profile.sms_freq,
        topup_freq: customer.profile.topup_freq,

        plan_type: customer.plan_type,       // ✅ BENAR
        device_brand: customer.device_brand  // ✅ BENA
      });

      if (mlRes.data.status === 'success') {
        mlOutputName = mlRes.data.offer_name; // Contoh: "Streaming Partner Pack"
        confidence_score = mlRes.data.confidence;
        console.log('Received from ML Service:', mlRes.data);
        console.log(`🤖 AI Suggestion: ${mlOutputName}`);
      }
    } catch (err) {
      console.warn("⚠️ ML Service Error, using fallback:", err.message);
    }

    // ======================================================
    // 3. LOGIKA MAPPING PINTAR
    // ======================================================

    // Cari konfigurasi berdasarkan output ML
    // Jika output ML tidak dikenal, fallback ke 'General Offer'
    const selectedConfig = await Product.findOne({ ml_label: mlOutputName });

    // Fallback: Jika produk tidak ketemu (misal typo), ambil produk General
    if (!selectedConfig) {
      console.warn(`⚠️ Produk '${mlOutputName}' tidak ada di DB. Menggunakan Fallback.`);
      selectedConfig = await Product.findOne({ category: 'GENERAL' });
    }

    // Ambil detailnya
    const categoryEnum = selectedConfig.category; // Contoh: "GENERAL"
    const productDetail = selectedConfig; // Contoh: Netflix Details

    // 4. Simpan ke Database
    const newRec = await Recommendation.create({
      customer: customer._id,

      // PENTING: Simpan ENUM yang valid (agar tidak error validasi)
      type: categoryEnum,

      // Simpan Detail Produk untuk Frontend
      offer_name: productDetail.name,
      offer_details: productDetail.description,
      image_url: productDetail.img,
      redirect_url: productDetail.url,

      confidence_score: confidence_score,

      status: 'PENDING'
    });

    customer.recommendations.push(newRec._id);
    await customer.save();

    res.status(200).json({
      status: 'success',
      message: 'Rekomendasi berhasil dibuat',
      // Kirim data lengkap ke frontend (termasuk kategori asli ML buat debug kalau perlu)
      data: {
        ...newRec.toObject(),
        original_ml_output: mlOutputName
      }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


