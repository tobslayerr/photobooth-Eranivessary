import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import connectDB from './db';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Photobox Backend is Running (Vercel Ready)');
});

app.use('/api', apiRoutes);

// Connect DB (Penting: Panggil di luar handler untuk warm connection di Vercel)
connectDB();

// Export app untuk Vercel
export default app;

// Jalankan server HANYA jika bukan di production (untuk local development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Backend server berjalan di http://localhost:${PORT}`);
    });
}
