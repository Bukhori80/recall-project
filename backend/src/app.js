import express from 'express';
import cors from 'cors';
import mainRouter from './api/v1/routes/index.js';


const app = express();

import swaggerUi from 'swagger-ui-express';
import fs from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerFilePath = path.join(__dirname, '../swagger-spec.json'); 
const swaggerFileContent = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocs = JSON.parse(swaggerFileContent);





// Mengizinkan request dari domain lain (misal: frontend Anda)
app.use(cors());
// Membaca body request sebagai JSON
app.use(express.json());
// Membaca body request dari form
app.use(express.urlencoded({ extended: true }));




// Ini akan membuat halaman di /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === Rute API Utama ===
// Semua rute di bawah /api/v1 akan ditangani oleh mainRouter

app.use('/api/v1', mainRouter);

// === Rute Health Check ===
// Untuk mengecek apakah server hidup
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Selamat datang di RECALL Project API v1!',
    docs: '/api-docs', // Beri link ke dokumentasi
  });
});

// (Nanti kita akan tambahkan Error Handling Middleware di sini)





export default app;