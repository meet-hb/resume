const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../utils/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'logo-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET settings
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM settings LIMIT 1');
        if (result.rows.length === 0) {
            return res.json({
                siteName: 'DevPort.', logo: null,
                footerText: '© 2026 Developer Portfolio',
                contactEmail: 'hello@developer.com',
                contactPhone: '+1-234-567-890',
                contactLocation: 'Remote / New York, USA',
                contactHeading: "Let's discuss for a project",
                contactSubtext: "Whether you have a question or just want to say hi, I'll try my best to get back to you!"
            });
        }
        const s = result.rows[0];
        res.json({
            siteName: s.site_name,
            logo: s.logo,
            footerText: s.footer_text,
            contactEmail: s.contact_email || 'hello@developer.com',
            contactPhone: s.contact_phone || '+1-234-567-890',
            contactLocation: s.contact_location || 'Remote / New York, USA',
            contactHeading: s.contact_heading || "Let's discuss for a project",
            contactSubtext: s.contact_subtext || "Whether you have a question or just want to say hi, I'll try my best to get back to you!"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST update settings
router.post('/', upload.single('logo'), async (req, res) => {
    const { siteName, footerText, contactEmail, contactPhone, contactLocation, contactHeading, contactSubtext } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const check = await db.query('SELECT id FROM settings LIMIT 1');
        let result;
        let query, params;

        if (check.rows.length === 0) {
            query = `INSERT INTO settings (site_name, footer_text, logo, contact_email, contact_phone, contact_location, contact_heading, contact_subtext)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
            params = [siteName, footerText, logo, contactEmail, contactPhone, contactLocation, contactHeading, contactSubtext];
        } else {
            if (logo) {
                query = `UPDATE settings SET site_name=$1, footer_text=$2, logo=$3, contact_email=$4, contact_phone=$5, contact_location=$6, contact_heading=$7, contact_subtext=$8 RETURNING *`;
                params = [siteName, footerText, logo, contactEmail, contactPhone, contactLocation, contactHeading, contactSubtext];
            } else {
                query = `UPDATE settings SET site_name=$1, footer_text=$2, contact_email=$3, contact_phone=$4, contact_location=$5, contact_heading=$6, contact_subtext=$7 RETURNING *`;
                params = [siteName, footerText, contactEmail, contactPhone, contactLocation, contactHeading, contactSubtext];
            }
        }

        result = await db.query(query, params);
        const s = result.rows[0];
        res.json({
            message: 'Settings updated',
            data: {
                siteName: s.site_name, logo: s.logo, footerText: s.footer_text,
                contactEmail: s.contact_email, contactPhone: s.contact_phone,
                contactLocation: s.contact_location, contactHeading: s.contact_heading,
                contactSubtext: s.contact_subtext
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
