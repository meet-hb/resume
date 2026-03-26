const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// GET all messages
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows.map(m => ({
            id: String(m.id),
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            createdAt: m.created_at
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new message
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, subject, message]
        );
        const m = result.rows[0];

        // Send email notification (non-blocking)
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `Portfolio Contact: ${subject}`,
            html: `
              <div style="font-family:sans-serif;background:#050505;color:white;padding:40px;border-radius:20px;">
                <h2 style="color:#00b4d8;">📬 New Portfolio Message</h2>
                <hr style="border-color:#1a1a2e;" />
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background:rgba(255,255,255,0.04);padding:20px;border-radius:10px;margin-top:20px;border-left:3px solid #00b4d8;">
                  <p style="color:#ccc;">${message}</p>
                </div>
              </div>`
        }).catch(err => console.warn('[Email] Forward failed:', err.message));

        res.status(201).json({ message: 'Message saved', data: { id: String(m.id), name: m.name, email: m.email, subject: m.subject, message: m.message, createdAt: m.created_at } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
