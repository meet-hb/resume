import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Layout, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#050505]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid opacity-20 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-widest">Available for New Projects</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1] md:leading-[0.9]">
            CREATING THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x p-2">
              FUTURE OF WEB
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed px-4">
            I build high-end, scalable digital products with <span className="text-white">React</span> and <span className="text-white">Node.js</span>. 
            Merging design aesthetics with technical excellence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-6">
            <motion.a 
              href="#projects" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto group px-10 py-5 rounded-2xl bg-primary text-white font-black text-lg transition-all shadow-[0_0_40px_rgba(0,180,216,0.3)] hover:shadow-[0_0_60px_rgba(0,180,216,0.5)] flex items-center justify-center space-x-3"
            >
              <span>Explore My Work</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a 
              href="#contact" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-black text-lg backdrop-blur-md hover:bg-white/10 transition-all text-center"
            >
              Get In Touch
            </motion.a>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { 
              icon: <Layout className="w-10 h-10 text-primary" />, 
              title: 'Frontend Prowess', 
              desc: 'Specializing in React, Next.js, and high-performance UI frameworks.' 
            },
            { 
              icon: <Cpu className="w-10 h-10 text-accent" />, 
              title: 'System Architecture', 
              desc: 'Building robust Node.js backends and complex database architectures.' 
            },
            { 
              icon: <Terminal className="w-10 h-10 text-secondary" />, 
              title: 'Clean Engineering', 
              desc: 'Applying design patterns and best practices for maintainable codebases.' 
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              className="glass-morphism p-10 rounded-[2rem] text-left group hover:bg-white/[0.05] transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-500"></div>
              <div className="mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">{feature.icon}</div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
