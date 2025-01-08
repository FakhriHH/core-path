const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/knex');

// Registrasi User
const register = async (req, res) => {
  const { name, email, password, phone, date_of_birth, gender, address, id_role = 3 } = req.body; // Default role siswa

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      phone,
      date_of_birth,
      gender,
      address,
      id_role
    };

    await User.createUser(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id_user, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Logout User
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Fungsi untuk mengirim email reset password
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Cek apakah email terdaftar
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token reset password menggunakan crypto
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Simpan token ke dalam database, bisa disimpan di tabel password_reset
    await db('password_reset').insert({
      id_user: user.id_user,
      reset_token: hashedToken,
      is_used: false
    });

    // Kirim email kepada user dengan link reset password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending password reset email', error: err.message });
  }
};

// Fungsi untuk mengubah password setelah token valid
const resetPassword = async (req, res) => {
  const { token } = req.params; // Token yang diterima di URL
  const { password } = req.body; // Password baru dari user

  try {
    // Cari token reset di database
    const resetRecord = await db('password_reset').where({ reset_token: token, is_used: false }).first();
    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Verifikasi token menggunakan bcrypt
    const isTokenValid = await bcrypt.compare(token, resetRecord.reset_token);
    if (!isTokenValid) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password user
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('user').where({ id_user: resetRecord.id_user }).update({ password: hashedPassword });

    // Tandai token sebagai sudah digunakan
    await db('password_reset').where({ reset_token: token }).update({ is_used: true });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};


module.exports = { register, login, logout, requestPasswordReset, resetPassword };
