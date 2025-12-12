import Customer from '../../../models/Customer.js';
import Recommendation from '../../../models/Recommendation.js';

/**
 * Service untuk Laporan Churn
 * Menghitung jumlah customer berisiko churn (risk > 0.5)
 */
export const generateChurnReport = async () => {
  try {
    const report = await Customer.aggregate([
      {
        $project: {
          // Buat kategori 'churn_segment' berdasarkan 'churn_risk'
          churn_segment: {
            $switch: {
              branches: [
                { 
                  case: { $lte: [ "$profile.churn_risk", 0.3 ] }, 
                  then: "Low" 
                },
                { 
                  case: { $and: [ { $gt: [ "$profile.churn_risk", 0.3 ] }, { $lte: [ "$profile.churn_risk", 0.7 ] } ] }, 
                  then: "Medium" 
                },
                { 
                  case: { $gt: [ "$profile.churn_risk", 0.7 ] }, 
                  then: "High" 
                }
              ],
              default: "Unknown"
            }
          }
        }
      },
      {
        // Hitung jumlah (count) untuk setiap segmen
        $group: {
          _id: "$churn_segment",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          segment: "$_id",
          count: 1
        }
      }
    ]);
    return report;
  } catch (error) {
    throw new Error(`Gagal membuat laporan churn: ${error.message}`);
  }
};

/**
 * Service untuk Laporan Rekomendasi
 * Menghitung jumlah rekomendasi berdasarkan statusnya
 */
export const generateRecommendationReport = async () => {
  try {
    const report = await Recommendation.aggregate([
      // $group: Kelompokkan berdasarkan 'status'
      {
        $group: {
          _id: '$status', // (Hasilnya akan jadi 'PENDING', 'SENT', 'CLICKED', dll)
          count: { $sum: 1 } // Hitung jumlah di tiap grup
        }
      },
      // $sort: Urutkan hasilnya
      {
        $sort: { count: -1 } // Urutkan dari yg terbanyak
      }
    ]);
    return report;
  } catch (error) {
    throw new Error(`Gagal membuat laporan rekomendasi: ${error.message}`);
  }
};

/**
 * Service untuk Laporan Penggunaan (Usage)
 * Menghitung rata-rata penggunaan & spend berdasarkan value_segment
 */
export const generateUsageReport = async () => {
  try {
    const report = await Customer.aggregate([
      {
        $match: {
          'profile.value_segment': { $exists: true } // Hanya yg punya segmen
        }
      },
      // $group: Kelompokkan berdasarkan 'value_segment'
      {
        $group: {
          _id: '$profile.value_segment', // (Hasil: 'Low', 'Medium', 'High')
          totalCustomers: { $sum: 1 },
          avgDataUsage: { $avg: '$profile.avg_data_usage_gb' },
          avgMonthlySpend: { $avg: '$profile.monthly_spend' }
        }
      },
      // $project: Membersihkan output agar lebih rapi
      {
        $project: {
          _id: 0, // Hapus field _id
          segment: '$_id', // Ganti nama _id jadi segment
          totalCustomers: 1,
          avgDataUsage: { $round: ['$avgDataUsage', 2] }, // Bulatkan 2 angka desimal
          avgMonthlySpend: { $round: ['$avgMonthlySpend', 2] }
        }
      }
    ]);
    return report;
  } catch (error) {
    throw new Error(`Gagal membuat laporan penggunaan: ${error.message}`);
  }
};

/**
 * Service untuk "Super-Endpoint" Dashboard
 * Menjalankan semua agregasi dashboard secara paralel
 */

export const generateDashboardReport = async () => {
  try {
    // 1. Laporan Churn (LOW, MEDIUM, HIGH) - Dari mockup Churn
    const churnStatusPromise = Customer.aggregate([
      { $project: {
          churn_segment: {
            $switch: {
              branches: [
                { case: { $lte: [ "$profile.churn_risk", 0.3 ] }, then: "Low" },
                { case: { $and: [ { $gt: [ "$profile.churn_risk", 0.3 ] }, { $lte: [ "$profile.churn_risk", 0.7 ] } ] }, then: "Medium" },
                { case: { $gt: [ "$profile.churn_risk", 0.7 ] }, then: "High" }
              ], default: "Unknown"
            }
          }
        }
      },
      { $group: { _id: "$churn_segment", count: { $sum: 1 } } },
      { $project: { _id: 0, segment: "$_id", count: 1 } }
    ]);

    // 2. Laporan Status Rekomendasi (ACCEPTED, SENT...) - Dari mockup Reco
    const recoStatusPromise = Recommendation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Laporan Tipe Rekomendasi (CHURN, UPSELL...) - Dari mockup Reco
    const recoTypePromise = Recommendation.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { _id: 0, type: "$_id", count: 1 } }
    ]);

    // 4. Laporan Top Churn Factors - Dari mockup Churn
    const churnFactorsPromise = Customer.aggregate([
      { $unwind: '$profile.churn_factors' }, // Pisahkan array
      { $group: { _id: '$profile.churn_factors', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, factor: "$_id", count: 1 } }
    ]);

    // 5. Laporan Rata-rata Churn per Segmen - Dari mockup Churn
    const churnPerSegmentPromise = Customer.aggregate([
      { $group: {
          _id: '$profile.value_segment',
          avgChurnRisk: { $avg: '$profile.churn_risk' }
        }
      },
      { $project: { _id: 0, segment: "$_id", avgChurnRisk: { $round: ["$avgChurnRisk", 2] } } }
    ]);

    // 6. Laporan Top 3 Devices - Dari mockup Usage
    const topDevicesPromise = Customer.aggregate([
      { $group: { _id: '$device_brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, device: "$_id", count: 1 } }
    ]);

    // 7. Laporan Plan Type - Dari mockup Usage
    const planTypePromise = Customer.aggregate([
      { $group: { _id: '$plan_type', count: { $sum: 1 } } },
      { $project: { _id: 0, plan: "$_id", count: 1 } }
    ]);

    // 8. Laporan Histori Penawaran (7 hari terakhir) - Dari mockup Reco
    const offerHistoryPromise = Recommendation.aggregate([
      { $match: { 
          status: 'SENT',
          updatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } // 7 hari terakhir
        } 
      },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } }
    ]);

    // Jalankan semua kueri secara paralel
    const [
      churnStatus,
      recoStatus,
      recoType,
      topChurnFactors,
      churnPerSegment,
      topDevices,
      planType,
      offerSentHistory
    ] = await Promise.all([
      churnStatusPromise,
      recoStatusPromise,
      recoTypePromise,
      churnFactorsPromise,
      churnPerSegmentPromise,
      topDevicesPromise,
      planTypePromise,
      offerHistoryPromise
    ]);

    // Kembalikan sebagai satu objek besar
    return {
      churnStatus,
      recoStatus,
      recoType,
      topChurnFactors,
      churnPerSegment,
      topDevices,
      planType,
      offerSentHistory
    };

  } catch (error) {
    throw new Error(`Gagal membuat laporan dashboard: ${error.message}`);
  }
};