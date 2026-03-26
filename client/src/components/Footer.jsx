import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
    const [footerText, setFooterText] = useState('© 2026 Developer Portfolio. Built with React & Node.js');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                if (res.data.footerText) setFooterText(res.data.footerText);
            } catch (err) {
                console.error('Error fetching footer settings:', err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="py-10 text-center border-t border-gray-900 bg-dark">
            <p className="text-gray-500 text-sm px-4">{footerText}</p>
        </footer>
    );
};

export default Footer;
