

import express from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
import Purchase from '../models/Purchase.js';
import Payment from '../models/Payment.js';
import SubscriptionStatus from '../models/SubscriptionStatus.js';

const router = express.Router();

console.log('Arquivo de rotas admin carregado');

// Rotas WebCommercial
router.get('/purchases', async (req, res) => {
  console.log('Recebida solicitação GET para /purchases');
  try {
    const purchases = await Purchase.find();
    console.log('Compras encontradas:', purchases.length);
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Erro ao buscar compras:', error.message);
    res.status(500).json({ message: 'Erro ao buscar compras.', error: error.message });
  }
});

router.get('/purchases/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Recebida solicitação GET para /purchases/${id}`);
  try {
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Compra não encontrada.' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    console.error('Erro ao buscar compra:', error.message);
    res.status(500).json({ message: 'Erro ao buscar compra.', error: error.message });
  }
});

router.get('/payments', async (req, res) => {
  console.log('Recebida solicitação GET para /payments');
  try {
    const payments = await Payment.find();
    console.log('Pagamentos encontrados:', payments.length);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error.message);
    res.status(500).json({ message: 'Erro ao buscar pagamentos.', error: error.message });
  }
});

router.get('/payments/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Recebida solicitação GET para /payments/${id}`);
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado.' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error.message);
    res.status(500).json({ message: 'Erro ao buscar pagamento.', error: error.message });
  }
});

router.get('/subscription-status', async (req, res) => {
  console.log('Recebida solicitação GET para /subscription-status');
  try {
    const subscriptionStatuses = await SubscriptionStatus.find();
    console.log('Status de assinaturas encontrados:', subscriptionStatuses.length);
    res.status(200).json(subscriptionStatuses);
  } catch (error) {
    console.error('Erro ao buscar status de assinaturas:', error.message);
    res.status(500).json({ message: 'Erro ao buscar status de assinaturas.', error: error.message });
  }
});

// Rotas WebAdmin
router.post('/register', async (req, res) => {
  const { adminName, email, password, role } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Este email já está sendo usado por outro administrador.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      adminName,
      email,
      password: hashedPassword,
      role
    });

    await admin.save();

    res.status(201).json({ message: 'Administrador registrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro ao registrar o administrador.', error: error.message });
  }
});

router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar administradores.' });
  }
});

router.get('/admins/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findById(id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar administrador.' });
  }
});

router.put('/admins/:id', async (req, res) => {
  const { id } = req.params;
  const { adminName, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.findByIdAndUpdate(id, { adminName, email, password: hashedPassword, role });
    res.json({ message: 'Administrador atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar administrador.' });
  }
});

router.delete('/admins/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Administrador excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir administrador.' });
  }
});

export default router;
