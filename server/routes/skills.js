const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// GET all
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM skills ORDER BY category, name');
        res.json(result.rows.map(s => ({ id: String(s.id), name: s.name, category: s.category, level: s.level })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create
router.post('/', async (req, res) => {
    const { name, category, level } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO skills (name, category, level) VALUES ($1, $2, $3) RETURNING *',
            [name, category, parseInt(level)]
        );
        const s = result.rows[0];
        res.status(201).json({ id: String(s.id), name: s.name, category: s.category, level: s.level });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update
router.put('/:id', async (req, res) => {
    const { name, category, level } = req.body;
    try {
        const result = await db.query(
            'UPDATE skills SET name=$1, category=$2, level=$3 WHERE id=$4 RETURNING *',
            [name, category, parseInt(level), req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const s = result.rows[0];
        res.json({ id: String(s.id), name: s.name, category: s.category, level: s.level });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM skills WHERE id = $1 RETURNING id', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
