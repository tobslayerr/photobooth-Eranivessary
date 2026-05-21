import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes';
import connectDB from './db';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Photobox Backend is Running (Vercel Ready)');
});

export default app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Backend server berjalan di http://localhost:${PORT}`);
    });
}