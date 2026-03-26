/**
 * Creates settings table if it doesn't exist, then seeds all tables.
 * Run: node setup.js
 */
const db = require('./utils/db');

async function setup() {
    try {
        // Create all tables first
        await db.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                git_link VARCHAR(255),
                demo_link VARCHAR(255),
                technologies TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS skills (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50),
                level INTEGER DEFAULT 50,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id SERIAL PRIMARY KEY,
                site_name VARCHAR(100) DEFAULT 'DevPort.',
                logo VARCHAR(255),
                footer_text TEXT DEFAULT '© 2026 Developer Portfolio',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('[Setup] ✅ All tables created/verified');

        // Clear existing data
        await db.query('TRUNCATE TABLE messages RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE projects RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE skills RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE settings RESTART IDENTITY CASCADE');

        // Projects
        const projects = [
            { title: 'E-Commerce Platform', description: 'Amazon clone with React, Redux & Node.js. Cart, checkout & payments.', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80', gitLink: 'https://github.com', demoLink: 'https://demo.com', technologies: ['React', 'Node.js', 'Express', 'PostgreSQL'] },
            { title: 'AI Image Generator', description: 'Uses OpenAI API to generate images from text prompts.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80', gitLink: 'https://github.com', demoLink: 'https://demo.com', technologies: ['React', 'Tailwind', 'Node.js', 'OpenAI'] },
            { title: 'Portfolio Website', description: 'Premium dark-theme developer portfolio with glassmorphism.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80', gitLink: 'https://github.com', demoLink: 'https://demo.com', technologies: ['React', 'Vite', 'Framer Motion'] }
        ];
        for (const p of projects) {
            await db.query('INSERT INTO projects (title, description, image, git_link, demo_link, technologies) VALUES ($1,$2,$3,$4,$5,$6)', [p.title, p.description, p.image, p.gitLink, p.demoLink, p.technologies]);
        }
        console.log(`[Setup] ✅ ${projects.length} projects seeded`);

        // Skills
        const skills = [
            { name: 'React.js', category: 'Frontend', level: 95 },
            { name: 'JavaScript', category: 'Frontend', level: 98 },
            { name: 'Tailwind CSS', category: 'Frontend', level: 92 },
            { name: 'Node.js', category: 'Backend', level: 90 },
            { name: 'Express.js', category: 'Backend', level: 85 },
            { name: 'PostgreSQL', category: 'Backend', level: 78 },
            { name: 'Git & GitHub', category: 'Tools', level: 88 },
            { name: 'VS Code', category: 'Tools', level: 95 },
        ];
        for (const s of skills) {
            await db.query('INSERT INTO skills (name, category, level) VALUES ($1,$2,$3)', [s.name, s.category, s.level]);
        }
        console.log(`[Setup] ✅ ${skills.length} skills seeded`);

        // Settings
        await db.query("INSERT INTO settings (site_name, footer_text) VALUES ($1, $2)", ['DevPort.', '© 2026 Developer Portfolio. Built with React & Node.js']);
        console.log('[Setup] ✅ Default settings inserted');

        console.log('\n[Setup] 🎉 All done! Your PostgreSQL database is ready.');
        process.exit(0);
    } catch (err) {
        console.error('[Setup] ❌ Error:', err.message);
        process.exit(1);
    }
}

setup();
