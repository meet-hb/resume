import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For this demo, we'll use a hardcoded admin credential. 
    // In a real app, this should be validated against the backend.
    if (credentials.username === 'admin' && credentials.password === 'password123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grid p-4">
      <div className="w-full max-w-md glass-morphism p-10 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter credentials to manage portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" name="username" required value={credentials.username} onChange={handleChange}
                className="w-full bg-dark/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="admin"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="password" name="password" required value={credentials.password} onChange={handleChange}
                className="w-full bg-dark/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm italic font-medium">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-secondary transition-all"
          >
            <span>Login Now</span>
            <LogIn size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
