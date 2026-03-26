const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../utils/db');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows.map(p => ({
            id: String(p.id),
            title: p.title,
            description: p.description,
            image: p.image,
            gitLink: p.git_link,
            demoLink: p.demo_link,
            technologies: p.technologies || []
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create
router.post('/', upload.single('image'), async (req, res) => {
    const { title, description, gitLink, demoLink, technologies } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const techArray = technologies ? technologies.split(',').map(t => t.trim()) : [];
    try {
        const result = await db.query(
            `INSERT INTO projects (title, description, image, git_link, demo_link, technologies)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, image, gitLink, demoLink, techArray]
        );
        const p = result.rows[0];
        res.status(201).json({ id: String(p.id), title: p.title, description: p.description, image: p.image, gitLink: p.git_link, demoLink: p.demo_link, technologies: p.technologies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update
router.put('/:id', upload.single('image'), async (req, res) => {
    const { title, description, gitLink, demoLink, technologies } = req.body;
    const techArray = technologies ? technologies.split(',').map(t => t.trim()) : [];
    try {
        let query, params;
        if (req.file) {
            query = `UPDATE projects SET title=$1, description=$2, git_link=$3, demo_link=$4, technologies=$5, image=$6 WHERE id=$7 RETURNING *`;
            params = [title, description, gitLink, demoLink, techArray, `/uploads/${req.file.filename}`, req.params.id];
        } else {
            query = `UPDATE projects SET title=$1, description=$2, git_link=$3, demo_link=$4, technologies=$5 WHERE id=$6 RETURNING *`;
            params = [title, description, gitLink, demoLink, techArray, req.params.id];
        }
        const result = await db.query(query, params);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const p = result.rows[0];
        res.json({ id: String(p.id), title: p.title, description: p.description, image: p.image, gitLink: p.git_link, demoLink: p.demo_link, technologies: p.technologies });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
