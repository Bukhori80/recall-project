import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js'; 
import { mongoUri } from './src/config/index.js'; 

dotenv.config();

// DAFTAR PRODUK DENGAN KATEGORI BARU (9 JENIS)
const products = [
  // =========================================
  // 1. ROAMING PASS
  // (Menangkap ML: Roaming Pass Premium, Standard, Basic)
  // =========================================
  {
    ml_label: 'Roaming Pass Premium',
    category: 'Roaming Pass', // <--- Kategori Baru
    name: 'Roaming Global Platinum',
    description: 'Akses data di 100+ negara prioritas tanpa ganti kartu.',
    price: 350000,
    image_url: 'https://placehold.co/600x400/purple/gold?text=Roaming+Platinum',
    redirect_url: 'https://my.telkomsel.com/roaming/global'
  },
  {
    ml_label: 'Roaming Pass Standard',
    category: 'Roaming Pass',
    name: 'Roaming Asia Basic',
    description: 'Internet hemat di Singapore, Malaysia, Thailand.',
    price: 150000,
    image_url: 'https://placehold.co/600x400/purple/white?text=Roaming+Asia',
    redirect_url: 'https://my.telkomsel.com/roaming/asia'
  },
  {
    ml_label: 'Roaming Pass Basic',
    category: 'Roaming Pass',
    name: 'Roaming Harian',
    description: 'Paket darurat saat traveling (24 Jam).',
    price: 50000,
    image_url: 'https://placehold.co/600x400/purple/gray?text=Roaming+Basic',
    redirect_url: 'https://my.telkomsel.com/roaming'
  },

  // =========================================
  // 2. DATA BOOSTER
  // (Menangkap ML: Data Booster Premium, Standard, Basic)
  // =========================================
  {
    ml_label: 'Data Booster Premium',
    category: 'Data Booster',
    name: 'Kuota Sultan 50GB',
    description: 'Streaming 4K dan gaming tanpa batas seharian.',
    price: 100000,
    image_url: 'https://placehold.co/600x400/blue/gold?text=50GB+Booster',
    redirect_url: 'https://my.telkomsel.com/data/50gb'
  },
  {
    ml_label: 'Data Booster Standard',
    category: 'Data Booster',
    name: 'Kuota Internet 10GB',
    description: 'Cukup untuk kebutuhan browsing bulanan.',
    price: 50000,
    image_url: 'https://placehold.co/600x400/blue/white?text=10GB+Booster',
    redirect_url: 'https://my.telkomsel.com/data/10gb'
  },
  {
    ml_label: 'Data Booster Basic',
    category: 'Data Booster',
    name: 'Kuota Ketengan 1GB',
    description: 'Solusi hemat saat kuota kritis.',
    price: 10000,
    image_url: 'https://placehold.co/600x400/blue/gray?text=1GB+Ketengan',
    redirect_url: 'https://my.telkomsel.com/data/1gb'
  },

  // =========================================
  // 3. TOP-UP PROMO
  // =========================================
  {
    ml_label: 'Top-up Promo',
    category: 'Top-up Promo',
    name: 'Bonus Pulsa 20rb',
    description: 'Top up sekarang minimal 50rb dapat cashback.',
    price: 50000,
    image_url: 'https://placehold.co/600x400/yellow/black?text=TopUp+Bonus',
    redirect_url: 'https://my.telkomsel.com/topup'
  },

  // =========================================
  // 4. VOICE BUNDLE
  // =========================================
  {
    ml_label: 'Voice Bundle Premium',
    category: 'Voice Bundle',
    name: 'Nelpon Sepuasnya All Op',
    description: 'Bebas nelpon ke mana saja sebulan penuh.',
    price: 60000,
    image_url: 'https://placehold.co/600x400/cyan/black?text=Voice+Premium',
    redirect_url: 'https://my.telkomsel.com/voice'
  },
  {
    ml_label: 'Voice Bundle Standard',
    category: 'Voice Bundle',
    name: 'Nelpon 1000 Menit',
    description: 'Paket nelpon harian hemat ke sesama.',
    price: 20000,
    image_url: 'https://placehold.co/600x400/cyan/white?text=Voice+Std',
    redirect_url: 'https://my.telkomsel.com/voice'
  },
  // Tambahkan Basic jika ML mengeluarkan output 'Voice Bundle Basic'
  {
    ml_label: 'Voice Bundle Basic',
    category: 'Voice Bundle',
    name: 'Nelpon Harian',
    description: 'Paket nelpon darurat.',
    price: 5000,
    image_url: 'https://placehold.co/600x400/cyan/gray?text=Voice+Basic',
    redirect_url: 'https://my.telkomsel.com/voice'
  },

  // =========================================
  // 5. DEVICE UPGRADE OFFER
  // =========================================
  {
    ml_label: 'Device Upgrade Offer',
    category: 'Device Upgrade Offer',
    name: 'Bundling iPhone 15',
    description: 'Tukar tambah HP lama kamu, cicilan 0%.',
    price: 15000000,
    image_url: 'https://placehold.co/600x400/black/white?text=iPhone+Promo',
    redirect_url: 'https://my.telkomsel.com/device'
  },

  // =========================================
  // 6. FAMILY PLAN OFFER
  // =========================================
  {
    ml_label: 'Family Plan', // ML biasanya output "Family Plan"
    category: 'Family Plan Offer',
    name: 'Halo Keluarga Sejahtera',
    description: 'Satu tagihan hemat untuk 4 anggota keluarga.',
    price: 250000,
    image_url: 'https://placehold.co/600x400/orange/white?text=Halo+Family',
    redirect_url: 'https://my.telkomsel.com/halo-family'
  },

  // =========================================
  // 7. STREAMING PARTNER PACK
  // =========================================
  {
    ml_label: 'Streaming Partner Pack', // ML outputnya "Streaming Pack"
    category: 'Streaming Partner Pack',
    name: 'Disney+ & Netflix Bundle',
    description: 'Nonton film blockbuster sepuasnya tanpa kuota utama.',
    price: 45000,
    image_url: 'https://placehold.co/600x400/black/red?text=Streaming+Pack',
    redirect_url: 'https://www.netflix.com'
  },

  // =========================================
  // 8. RETENTION OFFER
  // =========================================
  {
    ml_label: 'Retention Offer',
    category: 'Retention Offer',
    name: 'Voucher Loyalty 50%',
    description: 'Hadiah khusus pelanggan setia, diskon tagihan bulan ini.',
    price: 0,
    image_url: 'https://placehold.co/600x400/red/white?text=Loyalty',
    redirect_url: 'https://my.telkomsel.com/rewards'
  },

  // =========================================
  // 9. GENERAL OFFER
  // =========================================
  {
    ml_label: 'General Offer',
    category: 'General Offer',
    name: 'Promo Poin Telco',
    description: 'Tukar poinmu dengan voucher belanja.',
    price: 0,
    image_url: 'https://placehold.co/600x400/gray/white?text=General',
    redirect_url: 'https://my.telkomsel.com/point'
  },
  // =========================================
  // 10. SMS BUNDLE
  // =========================================
  {
    ml_label: 'SMS Bundle',
    category: 'SMS Bundle',
    name: 'SMS Sepuasnya All Op',
    description: 'Bebas SMS ke mana saja sebulan penuh.',
    price: 30000,
    image_url: 'https://placehold.co/600x400/cyan/black?text=sms+Premium',
    redirect_url: 'https://my.telkomsel.com/sms'
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Hapus data lama
    await Product.deleteMany({});
    
    // Insert data baru
    await Product.insertMany(products);
    console.log('✅ Product Catalog Seeded with 9 Categories!');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedDB();