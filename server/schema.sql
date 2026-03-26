-- 1. Create the Database
CREATE DATABASE portfolio;

-- 2. Switch to the portfolio database
-- \c portfolio;

-- 3. Create Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    git_link VARCHAR(255),
    demo_link VARCHAR(255),
    technologies TEXT[], -- Array of strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Skills Table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    level INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(100) DEFAULT 'DevPort.',
    logo VARCHAR(255),
    footer_text TEXT DEFAULT '© 2026 Developer Portfolio',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
