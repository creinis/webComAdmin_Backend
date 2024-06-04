import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db-connection.js'; // Importe a função de conexão
import Admin from './models/Admin.js';

// Obtenha o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createMasterAdmin = async () => {
  const adminName = "masterAdmin";
  const email = "master@example.com";
  const password = "yourPasswordHere";
  const role = "master";

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    adminName,
    email,
    password: hashedPassword,
    role,
  });

  await newAdmin.save();
  console.log("Master admin created successfully");
};

const run = async () => {
  await connectDB(); // Chame a função connectDB() aqui
  await createMasterAdmin();
  mongoose.connection.close();
};

run();
