import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import { port, mongoUri } from '../../../config/index.js'; // Kita perlu impor config email

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === KONFIGURASI FIREBASE ===
// (Butuh file 'serviceAccountKey.json' di root)
try {
  // Ganti 'path/to/serviceAccountKey.json' dengan path sebenarnya
  // Untuk di root: './serviceAccountKey.json'
  // Kita bangun path absolut ke file dari lokasi file ini
  // ../../../ -> (services -> v1 -> api -> src -> root)
  const serviceAccountPath = path.join(__dirname, '../../../../serviceAccountKey.json');

  // Baca file-nya (bukan di-impor)
  const serviceAccountFile = fs.readFileSync(serviceAccountPath);
  
  // Parse file JSON secara manual
  const serviceAccount = JSON.parse(serviceAccountFile);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Berikan objek hasil parse
  });
  console.log("Firebase Admin SDK terinisialisasi.");
} catch (error) {
  console.warn("Firebase Admin GAGAL inisialisasi. Pastikan 'serviceAccountKey.json' ada di root folder.", error.message);
}


// === KONFIGURASI EMAIL (NODEMAILER) ===
// Kita baca dari file .env (yang sudah di-load oleh config/index.js)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true untuk port 465, false untuk port lain
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Service untuk mengirim Email
 * @param {string} to - Email penerima
 * @param {string} subject - Judul email
 * @param {string} htmlBody - Isi email (dalam format HTML)
 */
export const sendEmail = async (to, subject, htmlBody) => {
  try {
    const info = await transporter.sendMail({
      from: '"Tim Telco Asah" <no-reply@telco.com>',
      to: to,
      subject: subject,
      html: htmlBody,
    });

    console.log('Email berhasil terkirim: %s', info.messageId);
    
    // URL ini HANYA untuk Ethereal. Di production, ini tidak ada.
    console.log('Lihat email (Ethereal): %s', nodemailer.getTestMessageUrl(info));
    return true;

  } catch (error) {
    console.error('Gagal mengirim email:', error);
    return false;
  }
};

/**
 * Service untuk mengirim Push Notification (FCM)
 * @param {string} fcmToken - Token FCM perangkat customer
 * @param {string} title - Judul notifikasi
 * @param {string} body - Isi pesan notifikasi
 */
export const sendPushNotification = async (fcmToken, title, body) => {
  if (!admin.apps.length) {
      console.warn('Firebase Admin tidak siap, membatalkan push notification.');
      return false; // Firebase tidak terinisialisasi
  }
  
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Push notification berhasil terkirim:', response);
    return true;
  } catch (error) {
    console.error('Gagal mengirim push notification:', error);
    return false;
  }
};