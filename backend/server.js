import app from './src/app.js';
import { port } from './src/config/index.js'; 
import connectDB from './src/config/db.js';

// Fungsi untuk memulai server
const startServer = async () => {
  // 1. Koneksikan ke Database
  await connectDB();

  // 2. Jalankan server Express
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
};

startServer();