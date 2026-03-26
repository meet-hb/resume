import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    contactHeading: "Let's discuss for a project",
    contactSubtext: "Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    contactEmail: 'hello@developer.com',
    contactPhone: '+1-234-567-890',
    contactLocation: 'Remote / New York, USA',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/settings')
      .then(res => setInfo(prev => ({ ...prev, ...res.data })))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      await axios.post('http://localhost:5000/api/messages', formData);
      setStatus({ type: 'success', msg: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: <Mail className="text-primary" />, title: 'Email Me', value: info.contactEmail },
    { icon: <Phone className="text-primary" />, title: 'Call Me', value: info.contactPhone },
    { icon: <MapPin className="text-primary" />, title: 'Location', value: info.contactLocation },
  ];

  return (
    <section id="contact" className="py-24 relative bg-grid">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In <span className="text-primary blue-glow">Touch</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-10">
            <h3 className="text-3xl font-bold text-white mb-6">{info.contactHeading}</h3>
            <p className="text-gray-400 max-w-md">{info.contactSubtext}</p>

            <div className="space-y-6">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 glass-morphism rounded-xl hover:border-primary/20 transition-all">
                  <div className="p-3 bg-primary/10 rounded-lg">{item.icon}</div>
                  <div>
                    <h4 className="text-sm text-gray-500 font-bold uppercase tracking-widest">{item.title}</h4>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-morphism p-8 md:p-10 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium ml-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-dark/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium ml-1">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-dark/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium ml-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-dark/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium ml-1">Message</label>
                <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} className="w-full bg-dark/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"></textarea>
              </div>

              {status.msg && (
                <div className={`flex items-center space-x-2 p-4 rounded-xl ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{status.msg}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Sending...' : (<><span>Send Message</span><Send size={18} /></>)}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
