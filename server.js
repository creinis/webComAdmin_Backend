import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import connectDB from './db-connection.js';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'https://web-com-adm-frontend.vercel.app', 
    'https://web-com-admin-backend.vercel.app', 
    'http://localhost:5173', 
    'http://localhost:5000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,AUTH',
  credentials: true,
}));
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);

// Configuração para lidar com rotas não definidas
app.get('/*', (req, res) => {
  console.log(`Request para: ${req.url}`);
  res.sendFile(path.join(__dirname, 'src', 'Rebuild_WebCom_WebAdm', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ADM Server is running on port ${PORT}`);
});
