/**
 * PostgreSQL Seed Script
 * Run: node seed.js
 * Seeds the database with initial projects and skills data.
 */
const db = require('./utils/db');

const seedData = async () => {
    try {
        console.log('[Seed] Clearing existing data...');
        await db.query('TRUNCATE TABLE messages, projects, skills RESTART IDENTITY CASCADE');

        // ── Seed Projects ────────────────────────────────────────────────────
        const projects = [
            {
                title: 'E-Commerce Platform',
                description: 'A full-featured Amazon clone with React, Redux, and Node.js. Includes cart functionality and secure checkout.',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80',
                gitLink: 'https://github.com',
                demoLink: 'https://demo.com',
                technologies: ['React', 'Node.js', 'Express', 'PostgreSQL']
            },
            {
                title: 'AI Image Generator',
                description: 'Dynamic web app that uses OpenAI API to generate stunning images from text prompts.',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
                gitLink: 'https://github.com',
                demoLink: 'https://demo.com',
                technologies: ['React', 'Tailwind', 'Node.js', 'OpenAI']
            },
            {
                title: 'Portfolio Website',
                description: 'Premium portfolio for developers with a dark theme and glassmorphism effects.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
                gitLink: 'https://github.com',
                demoLink: 'https://demo.com',
                technologies: ['React', 'Vite', 'Framer Motion']
            }
        ];

        for (const p of projects) {
            await db.query(
                'INSERT INTO projects (title, description, image, git_link, demo_link, technologies) VALUES ($1, $2, $3, $4, $5, $6)',
                [p.title, p.description, p.image, p.gitLink, p.demoLink, p.technologies]
            );
        }
        console.log(`[Seed] ✅ Inserted ${projects.length} projects`);

        // ── Seed Skills ───────────────────────────────────────────────────────
        const skills = [
            { name: 'React.js',     category: 'Frontend', level: 95 },
            { name: 'JavaScript',   category: 'Frontend', level: 98 },
            { name: 'Tailwind CSS', category: 'Frontend', level: 92 },
            { name: 'Node.js',      category: 'Backend',  level: 90 },
            { name: 'Express.js',   category: 'Backend',  level: 85 },
            { name: 'PostgreSQL',   category: 'Backend',  level: 78 },
            { name: 'Git & GitHub', category: 'Tools',    level: 88 },
            { name: 'VS Code',      category: 'Tools',    level: 95 },
        ];

        for (const s of skills) {
            await db.query(
                'INSERT INTO skills (name, category, level) VALUES ($1, $2, $3)',
                [s.name, s.category, s.level]
            );
        }
        console.log(`[Seed] ✅ Inserted ${skills.length} skills`);

        // ── Seed Settings ─────────────────────────────────────────────────────
        await db.query('TRUNCATE TABLE settings RESTART IDENTITY');
        await db.query(
            'INSERT INTO settings (site_name, footer_text) VALUES ($1, $2)',
            ['DevPort.', '© 2026 Developer Portfolio. Built with React & Node.js']
        );
        console.log('[Seed] ✅ Default settings inserted');

        console.log('\n[Seed] 🎉 Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('[Seed] ❌ Error:', err.message);
        process.exit(1);
    }
};

seedData();
