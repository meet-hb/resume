import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Github, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-20 text-primary">Loading Projects...</div>;

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured <span className="text-primary blue-glow">Projects</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            A showcase of my recent work, highlighting full-stack development, 
            premium UI/UX design, and complex problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    {project.gitLink && (
                      <a href={project.gitLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-primary transition-colors">
                        <Github size={22} className="text-white" />
                      </a>
                    )}
                    {project.demoLink && (
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-primary transition-colors">
                        <ExternalLink size={22} className="text-white" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-md text-[10px] uppercase font-bold tracking-wider">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 glass-morphism rounded-2xl">
                No projects found. Add some from the admin panel!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
