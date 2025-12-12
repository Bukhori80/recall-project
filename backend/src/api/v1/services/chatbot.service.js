// Kita perlu model untuk cek data customer dan rekomendasi
import Customer from '../../../models/Customer.js';
import Recommendation from '../../../models/Recommendation.js';

// (Nanti, di sinilah kita akan memanggil API ML)
// import { getMLRecommendation } from './ml.service.js';

/**
 * Service untuk memproses pesan dan menghasilkan balasan
 */
export const generateReply = async (customerId, message) => {
  try {
    // 1. Dapatkan data customer untuk konteks
    const customer = await Customer.findOne({ customer_id: customerId });
    if (!customer) {
      return "Maaf, saya tidak dapat menemukan data Anda.";
    }

    const lowerMessage = message.toLowerCase();

    // === 2. Logika NLU (Natural Language Understanding) Sederhana ===

    // Skenario 1: User bertanya soal rekomendasi
    if (lowerMessage.includes('rekomendasi') || lowerMessage.includes('promo') || lowerMessage.includes('paket')) {
      
      // LOGIKA FALLBACK (karena ML belum ada):
      // Cek apakah ada rekomendasi PENDING di database
      const pendingRec = await Recommendation.findOne({
        customer: customer._id,
        status: 'PENDING'
      });

      if (pendingRec) {
        // Tandai sebagai 'SENT' agar tidak ditawarkan lagi
        pendingRec.status = 'SENT';
        await pendingRec.save();
        
        return `Halo ${customerId}! Kebetulan kami punya penawaran untuk Anda: ${pendingRec.offer_name}. ${pendingRec.offer_details}.`;
      }

      /* // === DI SINI LOGIKA ML ANDA NANTI ===
      // (Buka komen ini saat ML API sudah deploy)
      
      const mlRec = await getMLRecommendation(customer.profile);
      if (mlRec) {
          // Simpan rekomendasi baru dari ML ke DB
          // ...
          return `Berdasarkan profil pemakaian Anda, kami merekomendasikan: ${mlRec.offer_name}`;
      }
      */

      // Jika tidak ada PENDING dan ML belum ada:
      return "Untuk saat ini, belum ada rekomendasi spesifik untuk Anda. Anda bisa cek halaman promo kami untuk info terbaru.";
    }

    // Skenario 2: User bertanya soal lokasi (Fitur 2)
    if (lowerMessage.includes('lokasi saya') || lowerMessage.includes('saya dimana')) {
      if (customer.location.coordinates[0] !== 0) { // Cek jika bukan [0,0]
        return `Lokasi terakhir Anda tercatat di koordinat [${customer.location.coordinates.join(', ')}].`;
      } else {
        return "Saya belum memiliki data lokasi Anda. Pastikan GPS di aplikasi Anda aktif ya.";
      }
    }

    // Skenario 3: Sapaan
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hi')) {
      return `Halo, ${customerId}! Ada yang bisa saya bantu? Anda bisa tanyakan soal 'rekomendasi' atau 'lokasi saya'.`;
    }

    // Skenario 4: Jawaban Default
    return "Maaf, saya belum mengerti. Saya bisa bantu cek 'rekomendasi' atau 'lokasi saya'.";

  } catch (error) {
    console.error("Chatbot Service Error:", error);
    return "Maaf, terjadi sedikit gangguan di sistem kami. Coba lagi nanti ya.";
  }
};