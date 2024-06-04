import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Provided password:', password); // Adicionado log para depuração
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found:', email); // Log para depuração
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Stored hashed password:', admin.password); // Adicionado log para depuração
    const isMatch = await admin.comparePassword(password); // Usamos o método comparePassword definido no modelo Admin
    if (!isMatch) {
      console.log('Password does not match for:', email); // Log para depuração
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful for:', email); // Log para depuração
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin/register', async (req, res) => {
  const { adminName, email, password, role } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new Admin({
      adminName,
      email,
      password: hashedPassword,
      role,
    });

    await admin.save();

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
