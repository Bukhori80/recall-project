import Customer from '../../../models/Customer.js';
import Recommendation from '../../../models/Recommendation.js';

// Impor "Tukang Pos" kita
import { sendEmail, sendPushNotification } from './notification.service.js';

/**
 * Service untuk mengirim notifikasi adaptif
 * Logika: Cari 1 rekomendasi "PENDING" untuk customer, lalu kirim.
 */
export const sendAdaptiveNotification = async (customerId) => {
  try {
    // 1. Cari customer untuk dapat email & fcm_token
    const customer = await Customer.findOne({ customer_id: customerId });
    if (!customer) {
      throw new Error('Customer tidak ditemukan');
    }

    // 2. Cari 1 rekomendasi PENDING untuk customer tsb
    const recommendation = await Recommendation.findOne({
      customer: customer._id, // Relasi ObjectId
      status: 'PENDING',      // Hanya yang belum dikirim
    });

    if (!recommendation) {
      return null; // Tidak ada rekomendasi PENDING
    }

    // 3. Siapkan Pesan
    const title = `Penawaran Spesial Untuk Anda!`;
    const body = `Hai, kami punya ${recommendation.offer_name}. ${recommendation.offer_details}`;
    const htmlBody = `
      <h1>Penawaran Spesial, ${customer.customer_id}!</h1>
      <p>Kami punya rekomendasi paket yang cocok untuk Anda:</p>
      <h2>${recommendation.offer_name}</h2>
      <p>${recommendation.offer_details}</p>
      <p>Klik di sini untuk mengaktifkan!</p>`;

    // 4. Kirim! (Kita kirim keduanya secara paralel)
    const emailSent = await sendEmail(customer.email, title, htmlBody);

    let pushSent = false;
    if (customer.fcm_token) {
      pushSent = await sendPushNotification(customer.fcm_token, title, body);
    }

    // 5. Update status rekomendasi jadi 'SENT'
    recommendation.status = 'SENT';
    await recommendation.save();

    return {
        recommendation_id: recommendation._id,
        email_sent: emailSent,
        push_sent: pushSent
    };

  } catch (error) {
    throw new Error(`Gagal mengirim notifikasi adaptif: ${error.message}`);
  }
};

// (Helper untuk testing)
export const createRecommendation = async (recData) => {
    // Cari customer._id berdasarkan customer_id
    const customer = await Customer.findOne({ customer_id: recData.customer_id });
    if (!customer) throw new Error("Customer ID tidak ditemukan untuk membuat rekomendasi");

    const newRec = new Recommendation({
        customer: customer._id,
        type: recData.type,
        offer_name: recData.offer_name,
        offer_details: recData.offer_details,
        status: 'PENDING' // Default
    });
    await newRec.save();
    return newRec;
};

export const getRecommendationById = async (recommendationId) => {
    const recommendation = await Recommendation.findById(recommendationId).populate('customer', '-_id customer_id email');
    if (!recommendation) {
        throw new Error('Rekomendasi tidak ditemukan');
    }
    return recommendation;
}