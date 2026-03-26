import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/skills');
        setSkills(res.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = ['Frontend', 'Backend', 'Tools', 'Other'];

  if (loading) return <div className="text-center py-20 text-primary">Loading Skills...</div>;

  return (
    <section id="skills" className="py-24 bg-dark/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Technical <span className="text-primary blue-glow">Skills</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categories.map((cat, idx) => {
            const catSkills = skills.filter(s => s.category === cat);
            if (catSkills.length === 0) return null;
            
            return (
              <div key={idx} className="space-y-6">
                <h3 className="text-2xl font-bold text-white border-l-4 border-primary pl-4">{cat}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {catSkills.map((skill, index) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
