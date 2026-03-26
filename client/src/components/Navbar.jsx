import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ siteName: 'DevPort.', logo: null });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '#projects' },
    { name: 'Skills', path: '#skills' },
    { name: 'Contact', path: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-dark/60 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.3)] group-hover:scale-110 transition-transform overflow-hidden">
              {settings.logo ? (
                <img src={`http://localhost:5000${settings.logo}`} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Code2 className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">
              {settings.siteName.split('.')[0]}<span className="text-primary tracking-widest text-lg ml-1 font-bold">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path}
                className="text-gray-400 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            ))}
            <Link 
              to="/admin" 
              className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all flex items-center space-x-2"
            >
              <ShieldAlert size={14} />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/10"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-dark/98 backdrop-blur-3xl z-[100] animate-in slide-in-from-right duration-500 flex flex-col items-center justify-center p-6">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 p-2 text-white hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/10"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center space-y-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                className="text-5xl font-black text-white hover:text-primary transition-colors tracking-tighter"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/admin" 
              className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-[0_0_30px_rgba(0,180,216,0.3)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin System
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
