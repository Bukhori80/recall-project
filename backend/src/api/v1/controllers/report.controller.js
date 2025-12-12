import * as reportService from '../services/report.service.js';
import Recommendation from '../../../models/Recommendation.js';
import Customer from '../../../models/Customer.js';
/**
 * Controller untuk mengambil laporan Churn
 */
export const getChurnReport = async (req, res, next) => {
  try {
    const reportData = await reportService.generateChurnReport();
    res.status(200).json({
      status: 'success',
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Controller untuk mengambil laporan Rekomendasi
 */
export const getRecommendationReport = async (req, res, next) => {
  try {
    const reportData = await reportService.generateRecommendationReport();
    res.status(200).json({
      status: 'success',
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Controller untuk mengambil laporan Penggunaan (Usage)
 */
export const getUsageReport = async (req, res, next) => {
  try {
    const reportData = await reportService.generateUsageReport();
    res.status(200).json({
      status: 'success',
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const getDashboardReport = async (req, res, next) => {
  try {
    const reportData = await reportService.generateDashboardReport();
    res.status(200).json({
      status: 'success',
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Laporan Kinerja Model AI untuk Rekomendasi
export const getAIPerformanceStats = async (req, res) => {
  try {
    // 1. Ambil Semua Rekomendasi (Pending/Sent)
    // Kita butuh join dengan tabel Product untuk ambil harganya
    // Tapi karena harga tidak disimpan di Recommendation, kita ambil manual atau pakai lookup
    
    // Aggregation Pipeline yang Powerful
    const stats = await Recommendation.aggregate([
      {
        $lookup: {
          from: 'products', // Nama collection product di MongoDB (biasanya lowercase plural)
          localField: 'offer_name',
          foreignField: 'name', // Asumsi nama produk unik/sama
          as: 'productDetails'
        }
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          type: 1,
          offer_name: 1,
          confidence_score: 1,
          price: { $ifNull: ["$productDetails.price", 0] }, // Ambil harga, default 0
          // Hitung Expected Revenue per user: Harga * (Confidence / 100)
          expected_revenue: {
            $multiply: [
              { $ifNull: ["$productDetails.price", 0] },
              { $divide: ["$confidence_score", 100] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRecommendations: { $sum: 1 },
          avgConfidence: { $avg: "$confidence_score" },
          totalPotentialRevenue: { $sum: "$expected_revenue" }, // Total Proyeksi
          totalBaseRevenue: { $sum: "$price" } // Total jika semua user beli
        }
      }
    ]);

    // 2. Breakdown Kategori (Tetap dipertahankan)
    const categoryStats = await Recommendation.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence_score" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Top Products
    const topProducts = await Recommendation.aggregate([
      {
        $group: {
          _id: "$offer_name",
          count: { $sum: 1 },
          category: { $first: "$type" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 4. Statistik User
    const totalCustomers = await Customer.countDocuments();
    const highRiskCustomers = await Customer.countDocuments({ "profile.churn_risk": { $gt: 0.7 } });

    // Format Data Akhir
    const result = stats[0] || { totalRecommendations: 0, avgConfidence: 0, totalPotentialRevenue: 0 };

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          total_users: totalCustomers,
          total_recommendations: result.totalRecommendations,
          high_risk_users: highRiskCustomers,
          
          // METRIK BARU YANG ANDA MINTA
          avg_model_confidence: result.avgConfidence.toFixed(2) + '%',
          projected_monthly_revenue: Math.round(result.totalPotentialRevenue) // Dalam Rupiah
        },
        category_breakdown: categoryStats.map(item => ({
          category: item._id,
          count: item.count,
          avg_confidence: item.avgConfidence.toFixed(1) + '%'
        })),
        top_products: topProducts
      }
    });

  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};