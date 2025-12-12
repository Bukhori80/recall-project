import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mongoUri } from './src/config/index.js';
import Customer from './src/models/Customer.js';
import Recommendation from './src/models/Recommendation.js';
import User from './src/models/User.js';

dotenv.config();

// 1. Data Admin Dashboard (Tetap sama)
const dummyUsers = [
  { name: 'Admin Telco', email: 'admin@telco.com', password: 'password123', role: 'admin' },
  { name: 'Viewer Telco', email: 'viewer@telco.com', password: 'password123', role: 'viewer' }
];

// 2. Data Customer Dummy (DITAMBAH Username & Password)
// Password default untuk semua customer: '123456'
const dummyCustomers = [
  { 
    username: 'user_1', password: '123456', // <-- BARU
    customer_id: 'C00001', email: 'high_value_low@mail.com', 
    plan_type: 'Postpaid', device_brand: 'Samsung', 
    location: { type: 'Point', coordinates: [106.827172, -6.175392] }, 
    profile: { avg_data_usage_gb: 50, travel_score: 0.8, monthly_spend: 800000, value_segment: 'High', data_user_type: 'Heavy', churn_risk: 0.1, churn_factors: ['Loyal customer'], pct_video_usage: 60, avg_call_duration: 300, sms_freq: 5, topup_freq: 0, engagement_score: 10 } 
  },
  { 
    username: 'user_2', password: '123456',
    customer_id: 'C00002', email: 'high_value_high@mail.com', 
    plan_type: 'Postpaid', device_brand: 'iPhone', 
    location: { type: 'Point', coordinates: [106.8096, -6.2088] }, 
    profile: { avg_data_usage_gb: 70, travel_score: 0.7, complaint_count: 4, monthly_spend: 900000, value_segment: 'High', data_user_type: 'Heavy', churn_risk: 0.85, churn_factors: ['High complaint count', 'Price sensitive'], pct_video_usage: 80, avg_call_duration: 150, sms_freq: 2, topup_freq: 0, engagement_score: 2 } 
  },
  { 
    username: 'user_3', password: '123456',
    customer_id: 'C00003', email: 'mid_value_mid@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Xiaomi', 
    location: { type: 'Point', coordinates: [107.6191, -6.9175] }, 
    profile: { avg_data_usage_gb: 25, travel_score: 0.2, complaint_count: 1, monthly_spend: 350000, value_segment: 'Medium', data_user_type: 'Medium', churn_risk: 0.45, churn_factors: ['Inconsistent network'], pct_video_usage: 40, avg_call_duration: 100, sms_freq: 10, topup_freq: 3, engagement_score: 5 } 
  },
  { 
    username: 'user_4', password: '123456',
    customer_id: 'C00004', email: 'low_value_low@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Oppo', 
    location: { type: 'Point', coordinates: [110.3695, -7.7956] }, 
    profile: { avg_data_usage_gb: 10, travel_score: 0.1, monthly_spend: 100000, value_segment: 'Low', data_user_type: 'Light', churn_risk: 0.2, churn_factors: ['Usage is stable'], pct_video_usage: 20, avg_call_duration: 50, sms_freq: 20, topup_freq: 2, engagement_score: 3 } 
  },
  { 
    username: 'user_5', password: '123456',
    customer_id: 'C00005', email: 'low_value_2@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Vivo', 
    location: { type: 'Point', coordinates: [112.7521, -7.2575] }, 
    profile: { avg_data_usage_gb: 12, travel_score: 0.1, monthly_spend: 120000, value_segment: 'Low', churn_risk: 0.15, engagement_score: 1 } 
  },
  { 
    username: 'user_6', password: '123456',
    customer_id: 'C00006', email: 'mid_value_2@mail.com', 
    plan_type: 'Postpaid', device_brand: 'Realme', 
    profile: { avg_data_usage_gb: 30, travel_score: 0.3, monthly_spend: 400000, value_segment: 'Medium', churn_risk: 0.5, churn_factors: ['Price increase'], engagement_score: 4 } 
  },
  { 
    username: 'user_7', password: '123456',
    customer_id: 'C00007', email: 'high_churn_2@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Samsung', 
    profile: { avg_data_usage_gb: 5, travel_score: 0, monthly_spend: 50000, value_segment: 'Low', churn_risk: 0.9, churn_factors: ['Low usage', 'No engagement'], engagement_score: 0 } 
  },
  { 
    username: 'user_8', password: '123456',
    customer_id: 'C00008', email: 'high_value_3@mail.com', 
    plan_type: 'Postpaid', device_brand: 'iPhone', 
    location: { type: 'Point', coordinates: [106.828, -6.176] }, 
    profile: { avg_data_usage_gb: 60, travel_score: 0.6, monthly_spend: 750000, value_segment: 'High', churn_risk: 0.05, engagement_score: 8 } 
  },
  { 
    username: 'user_9', password: '123456',
    customer_id: 'C00009', email: 'mid_value_3@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Oppo', 
    profile: { avg_data_usage_gb: 22, travel_score: 0.1, monthly_spend: 250000, value_segment: 'Medium', churn_risk: 0.3, engagement_score: 2 } 
  },
  { 
    username: 'user_10', password: '123456',
    customer_id: 'C00010', email: 'low_value_3@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Vivo', 
    profile: { avg_data_usage_gb: 8, travel_score: 0.2, monthly_spend: 80000, value_segment: 'Low', churn_risk: 0.6, churn_factors: ['Competitor offer', 'Price sensitive'], engagement_score: 1 } 
  },
  { 
    username: 'user_11', password: '123456',
    customer_id: 'C00011', email: 'new_user_11@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Xiaomi', 
    location: { type: 'Point', coordinates: [98.6785, 3.5952] }, 
    profile: { avg_data_usage_gb: 35, travel_score: 0.4, monthly_spend: 300000, value_segment: 'Medium', data_user_type: 'Medium', churn_risk: 0.25, engagement_score: 3 } 
  },
  { 
    username: 'user_12', password: '123456',
    customer_id: 'C00012', email: 'new_user_12@mail.com', 
    plan_type: 'Postpaid', device_brand: 'Samsung', 
    profile: { avg_data_usage_gb: 45, travel_score: 0.1, monthly_spend: 650000, value_segment: 'High', data_user_type: 'Heavy', churn_risk: 0.1, engagement_score: 7 } 
  },
  { 
    username: 'user_13', password: '123456',
    customer_id: 'C00013', email: 'new_user_13@mail.com', 
    plan_type: 'Prepaid', device_brand: 'iPhone', 
    location: { type: 'Point', coordinates: [115.2166, -8.6705] }, 
    profile: { avg_data_usage_gb: 18, travel_score: 0.9, monthly_spend: 220000, value_segment: 'Medium', data_user_type: 'Medium', churn_risk: 0.4, engagement_score: 4 } 
  },
  { 
    username: 'user_14', password: '123456',
    customer_id: 'C00014', email: 'new_user_14@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Realme', 
    profile: { avg_data_usage_gb: 7, travel_score: 0, monthly_spend: 75000, value_segment: 'Low', data_user_type: 'Light', churn_risk: 0.7, churn_factors: ['Inconsistent network'], engagement_score: 0 } 
  },
  { 
    username: 'user_15', password: '123456',
    customer_id: 'C00015', email: 'new_user_15@mail.com', 
    plan_type: 'Postpaid', device_brand: 'Oppo', 
    location: { type: 'Point', coordinates: [119.4135, -5.1477] }, 
    profile: { avg_data_usage_gb: 55, travel_score: 0.8, monthly_spend: 720000, value_segment: 'High', data_user_type: 'Heavy', churn_risk: 0.15, engagement_score: 6 } 
  },
  { 
    username: 'user_16', password: '123456',
    customer_id: 'C00016', email: 'new_user_16@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Vivo', 
    profile: { avg_data_usage_gb: 14, travel_score: 0.1, monthly_spend: 130000, value_segment: 'Low', data_user_type: 'Light', churn_risk: 0.2, engagement_score: 2 } 
  },
  { 
    username: 'user_17', password: '123456',
    customer_id: 'C00017', email: 'new_user_17@mail.com', 
    plan_type: 'Postpaid', device_brand: 'Samsung', 
    profile: { avg_data_usage_gb: 28, travel_score: 0.2, monthly_spend: 330000, value_segment: 'Medium', data_user_type: 'Medium', churn_risk: 0.35, engagement_score: 3 } 
  },
  { 
    username: 'user_18', password: '123456',
    customer_id: 'C00018', email: 'new_user_18@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Xiaomi', 
    location: { type: 'Point', coordinates: [106.829, -6.177] }, 
    profile: { avg_data_usage_gb: 40, travel_score: 0.5, monthly_spend: 450000, value_segment: 'Medium', data_user_type: 'Heavy', churn_risk: 0.55, churn_factors: ['High complaint count'], engagement_score: 4 } 
  },
  { 
    username: 'user_19', password: '123456',
    customer_id: 'C00019', email: 'new_user_19@mail.com', 
    plan_type: 'Postpaid', device_brand: 'iPhone', 
    profile: { avg_data_usage_gb: 80, travel_score: 0.6, monthly_spend: 1100000, value_segment: 'High', data_user_type: 'Heavy', churn_risk: 0.8, churn_factors: ['High usage', 'Price sensitive'], engagement_score: 5 } 
  },
  { 
    username: 'user_20', password: '123456',
    customer_id: 'C00020', email: 'new_user_20@mail.com', 
    plan_type: 'Prepaid', device_brand: 'Oppo', 
    profile: { avg_data_usage_gb: 9, travel_score: 0.1, monthly_spend: 90000, value_segment: 'Low', data_user_type: 'Light', churn_risk: 0.1, engagement_score: 1 } 
  },
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    // 1. Bersihkan Data Lama
    await Customer.deleteMany({});
    await Recommendation.deleteMany({});
    await User.deleteMany({});

    // 2. Buat Admin
    console.log('Inserting admin users...');
    await User.create(dummyUsers);
    
    // 3. Buat Customer (Akan mentrigger 'pre-save' hook untuk hash password)
    console.log('Inserting customers...');
    const createdCustomers = await Customer.create(dummyCustomers);
    
    // 4. Buat Rekomendasi
    const recommendations = [
      { customer: createdCustomers[0]._id, type: 'Data Booster', offer_name: 'Paket Platinum 100GB', status: 'PENDING', updatedAt: new Date() },
      { customer: createdCustomers[1]._id, type: 'Retention Offer', offer_name: 'Diskon 50% 3 Bulan', status: 'SENT', updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { customer: createdCustomers[1]._id, type: 'Data Booster', offer_name: 'Bonus Kuota 20GB', status: 'ACCEPTED', updatedAt: new Date() },
      { customer: createdCustomers[2]._id, type: 'Data Booster', offer_name: 'Paket Mingguan 5GB', status: 'SENT', updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
      { customer: createdCustomers[2]._id, type: 'Streaming Partner Pack', offer_name: 'Langganan VOD', status: 'REJECTED', updatedAt: new Date() },
      { customer: createdCustomers[10]._id, type: 'Roaming Pass', offer_name: 'Paket Roaming Asia', status: 'PENDING', updatedAt: new Date() },
      { customer: createdCustomers[13]._id, type: 'Data Booster', offer_name: 'Bonus Kuota 20GB', status: 'ACCEPTED', updatedAt: new Date() },
      { customer: createdCustomers[18]._id, type: 'Retention Offer', offer_name: 'Cashback 20%', status: 'SENT', updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
      { customer: createdCustomers[6]._id, type: 'Retention Offer', offer_name: 'Diskon Spesial', status: 'REJECTED', updatedAt: new Date() },
      { customer: createdCustomers[16]._id, type: 'Device Upgrade Offer', offer_name: 'Upgrade Plan', status: 'PENDING', updatedAt: new Date() },
      { customer: createdCustomers[12]._id, type: 'Roaming Pass', offer_name: 'Paket Roaming USA', status: 'SENT', updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { customer: createdCustomers[14]._id, type: 'Family Plan Offer', offer_name: 'Paket Platinum 100GB', status: 'ACCEPTED', updatedAt: new Date() },
    ];
    
    console.log('Inserting recommendations...');
    await Recommendation.insertMany(recommendations);
    
    console.log('==================================');
    console.log('Database seeding complete! 🚀');
    console.log('Admin Account: admin@telco.com / password123');
    console.log('Sample Customer: user_1 / 123456');
    console.log('==================================');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();