const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const knex = require('../config/knex');

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

    const token = jwt.sign({ id: user.id_user, role: user.id_role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Logout User
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

const requestGetPasswordReset = async (req, res) => {
  const { token } = req.query;

  try {
      // Validasi input token
      if (!token) {
          return res.status(400).json({ Token: "Token is required." });
      }

      // Cari token di database
      const tokenData = await knex("password_resets").where({ token }).first();

      if (!tokenData) {
          return res.status(404).json({ message: "Invalid or expired token." });
      }

      // Periksa apakah token sudah kedaluwarsa
      const currentTime = new Date();
      if (currentTime > tokenData.expires_at) {
          return res.status(400).json({ message: "Token has expired." });
      }

      // Token valid, respons berhasil
      res.status(200).json({
          message: "Token is valid.",
          token: token,
      });
  } catch (error) {
      console.error("Error in reset-password validation:", error);
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
};

const requestPasswordReset = async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;

  try {
      // Validasi input
      if (!password) {
          return res.status(400).json({ message: "Password is required." });
      }
      if (!token) {
          return res.status(400).json({ message: "Token is required." });
      }

      // Cari token di database
      const resetRequest = await knex("password_resets")
          .where({ token })
          .andWhere("expires_at", ">", new Date()) // Token tidak boleh kadaluarsa
          .first();

      if (!resetRequest) {
          return res.status(400).json({ message: "Invalid or expired token." });
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password user
      await knex("users")
          .where({ email: resetRequest.email })
          .update({ password: hashedPassword });

      // Hapus token setelah digunakan
      await knex("password_resets").where({ token }).del();

      // Respons berhasil
      res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
      console.error("Error in reset-password:", error);
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Validasi input
      if (!email) {
          return res.status(400).json({ message: "Email is required." });
      }

      // Cari user berdasarkan email
      const user = await knex("users").where({ email }).first();

      if (!user) {
          return res.status(404).json({ message: "User not found. Please check the email address." });
      }

      // Generate token unik
      const token = crypto.randomBytes(32).toString("hex");
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // Token berlaku selama 1 jam

      // Simpan token dan waktu kedaluwarsa di database
      await knex("password_resets").insert({
          email: user.email,
          token: token,
          expires_at: expirationTime,
      });

      // Buat link reset password
      const resetLink = `http://localhost:5000/api/auth/reset-password?token=${token}`;

      // Konfigurasi transporter email
      const transporter = nodemailer.createTransport({
          service: "Gmail", // Bisa diganti dengan layanan lain seperti SendGrid, Outlook, dll.
          auth: {
              user: process.env.EMAIL_USER, // Ganti dengan email Anda
              pass: process.env.EMAIL_PASS, // Ganti dengan password email Anda
          },
      });

      // Opsi email dengan HTML
      const mailOptions = {
          from: process.env.EMAIL_USER, // Ganti dengan email Anda
          to: email,
          subject: "Password Reset Request",
          html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                  <h2 style="text-align: center; color: #007BFF;">Password Reset Request</h2>
                  <p>Hello <b>${user.name}</b>,</p>
                  <p>You requested a password reset. Click the button below to reset your password:</p>
                  <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                      <tr>
                          <td align="center" bgcolor="#007BFF" style="border-radius: 4px;">
                              <a href="${resetLink}" 
                                 style="display: inline-block; font-size: 16px; color: #ffffff; text-decoration: none; padding: 10px 20px; background-color: #007BFF; border-radius: 4px;">
                                 Reset Password
                              </a>
                          </td>
                      </tr>
                  </table>
                  <p>If the button above does not work, copy and paste the following link into your browser:</p>
                  <p style="word-wrap: break-word;">
                      <a href="${resetLink}" style="color: #007BFF;">${resetLink}</a>
                  </p>
                  <p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
                  <hr style="border: 0; border-top: 1px solid #ddd;">
                  <p style="text-align: center; font-size: 12px; color: #777;">
                      © 2025 Your Company Name. All rights reserved.<br>
                      Need help? <a href="mailto:support@example.com" style="color: #007BFF;">Contact Support</a>.
                  </p>
              </div>
          `,
      };          

      // Kirim email
      await transporter.sendMail(mailOptions);

      // Respons berhasil
      res.status(200).json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
      console.error("Error in forget-password:", error);
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
};


module.exports = { register, login, logout, requestGetPasswordReset, requestPasswordReset, forgotPassword };
