import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Briefcase, Zap, MessageSquare, LogOut, Plus, Trash2, Edit, X, Upload, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form States
  const [projectForm, setProjectForm] = useState({ title: '', description: '', gitLink: '', demoLink: '', technologies: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 80 });
  const [settingsForm, setSettingsForm] = useState({
    siteName: '', footerText: '', logo: '',
    contactEmail: '', contactPhone: '', contactLocation: '',
    contactHeading: '', contactSubtext: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data);
      } else if (activeTab === 'skills') {
        const res = await axios.get('http://localhost:5000/api/skills');
        setSkills(res.data);
      } else if (activeTab === 'messages') {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
      } else if (activeTab === 'settings') {
        const res = await axios.get('http://localhost:5000/api/settings');
        setSettingsForm({
          siteName: res.data.siteName || '',
          footerText: res.data.footerText || '',
          logo: res.data.logo || '',
          contactEmail: res.data.contactEmail || '',
          contactPhone: res.data.contactPhone || '',
          contactLocation: res.data.contactLocation || '',
          contactHeading: res.data.contactHeading || '',
          contactSubtext: res.data.contactSubtext || '',
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('siteName', settingsForm.siteName);
    formData.append('footerText', settingsForm.footerText);
    if (selectedFile) formData.append('logo', selectedFile);

    try {
      await axios.post('http://localhost:5000/api/settings', formData);
      alert('Settings updated successfully');
      fetchData();
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('gitLink', projectForm.gitLink);
    formData.append('demoLink', projectForm.demoLink);
    formData.append('technologies', projectForm.technologies);
    if (selectedFile) formData.append('image', selectedFile);

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/projects/${currentId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/projects', formData);
      }
      setShowModal(false);
      resetForms();
      fetchData();
    } catch (err) {
      alert(`Failed to ${editMode ? 'update' : 'add'} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/skills/${currentId}`, skillForm);
      } else {
        await axios.post('http://localhost:5000/api/skills', skillForm);
      }
      setShowModal(false);
      resetForms();
      fetchData();
    } catch (err) {
      alert(`Failed to ${editMode ? 'update' : 'add'} skill`);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setProjectForm({ title: '', description: '', gitLink: '', demoLink: '', technologies: '' });
    setSkillForm({ name: '', category: 'Frontend', level: 80 });
    setSelectedFile(null);
    setEditMode(false);
    setCurrentId(null);
  }

  const handleEdit = (type, item) => {
    setEditMode(true);
    setCurrentId(item.id);
    if (type === 'projects') {
      setProjectForm({
        title: item.title,
        description: item.description,
        gitLink: item.gitLink || '',
        demoLink: item.demoLink || '',
        technologies: item.technologies ? item.technologies.join(', ') : ''
      });
    } else {
      setSkillForm({
        name: item.name,
        category: item.category,
        level: item.level
      });
    }
    setShowModal(true);
  }

  const deleteItem = async (type, id) => {
    if(!window.confirm('Are you sure you want to delete this?')) return;
    try {
        await axios.delete(`http://localhost:5000/api/${type}/${id}`);
        fetchData();
    } catch (err) {
        alert('Delete failed');
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-dark/80 border-b md:border-b-0 md:border-r border-gray-800 p-4 md:p-6 flex flex-row md:flex-col h-auto md:h-screen sticky top-0 z-[60] backdrop-blur-xl">
        <div className="flex items-center space-x-3 mb-0 md:mb-12 mr-6 md:mr-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-white hidden sm:inline">Admin<span className="text-primary italic">Panel</span></span>
        </div>

        <nav className="flex flex-row md:flex-col flex-1 space-x-2 md:space-x-0 md:space-y-2">
          {[
            { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
            { id: 'skills', label: 'Skills', icon: <Zap size={20} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-0 md:space-x-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {tab.icon}
              <span className="font-medium hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="ml-auto md:ml-0 md:mt-auto flex items-center space-x-0 md:space-x-4 px-3 md:px-4 py-2.5 md:py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white capitalize">{activeTab} Management</h2>
          {activeTab !== 'messages' && activeTab !== 'settings' && (
            <button 
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition-all font-bold shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              <span>Add New {activeTab === 'projects' ? 'Project' : 'Skill'}</span>
            </button>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl glass-morphism p-8 rounded-3xl relative animate-in zoom-in duration-300">
              <button 
                onClick={() => { setShowModal(false); resetForms(); }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-6">{editMode ? 'Edit' : 'Add New'} {activeTab === 'projects' ? 'Project' : 'Skill'}</h3>
              
              {activeTab === 'projects' ? (
                <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Title</label>
                    <input 
                      type="text" required value={projectForm.title} 
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea 
                      required value={projectForm.description} 
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Github Link</label>
                    <input 
                      type="text" value={projectForm.gitLink} 
                      onChange={(e) => setProjectForm({...projectForm, gitLink: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Demo Link</label>
                    <input 
                      type="text" value={projectForm.demoLink} 
                      onChange={(e) => setProjectForm({...projectForm, demoLink: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Technologies (Comma separated)</label>
                    <input 
                      type="text" placeholder="React, Node.js, Tailwind" 
                      value={projectForm.technologies} 
                      onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Image</label>
                    <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all">
                       <input 
                         type="file" required accept="image/*"
                         onChange={(e) => setSelectedFile(e.target.files[0])}
                         className="absolute inset-0 opacity-0 cursor-pointer z-10"
                       />
                       <div className="py-6 flex flex-col items-center justify-center text-gray-500">
                          <Upload className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium">{selectedFile ? selectedFile.name : 'Click to upload project cover'}</span>
                       </div>
                    </div>
                  </div>
                  <button 
                    disabled={loading}
                    className="md:col-span-2 mt-4 bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (editMode ? 'Update Project Data' : 'Save Project Data')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSkillSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Skill Name</label>
                    <input 
                      type="text" required value={skillForm.name} 
                      onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                        <select 
                            value={skillForm.category}
                            onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        >
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>Tools</option>
                            <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Level (%)</label>
                        <input 
                            type="number" min="0" max="100" required value={skillForm.level} 
                            onChange={(e) => setSkillForm({...skillForm, level: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                        />
                      </div>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full mt-4 bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Save Skill Data'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="glass-morphism rounded-3xl overflow-x-auto shadow-2xl border border-white/5">
          {activeTab === 'projects' && (
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs">Project</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs">Technologies</th>
                  <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-xs text-gray-500 truncate w-40">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.technologies.map((t, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit('projects', p)} className="p-2 text-gray-400 hover:text-primary transition-colors inline-block mr-2"><Edit size={18} /></button>
                      <button onClick={() => deleteItem('projects', p.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors inline-block"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'skills' && (
             <table className="w-full text-left">
             <thead className="bg-white/5 border-b border-gray-800">
               <tr>
                 <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs">Skill</th>
                 <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs">Category</th>
                 <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs">Level</th>
                 <th className="px-6 py-4 text-gray-400 font-bold uppercase text-xs text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-800">
               {skills.map((s) => (
                 <tr key={s.id} className="hover:bg-white/5 transition-colors">
                   <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                   <td className="px-6 py-4 text-gray-400">{s.category}</td>
                   <td className="px-6 py-4">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{width: `${s.level}%`}}></div>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button onClick={() => handleEdit('skills', s)} className="p-2 text-gray-400 hover:text-primary transition-colors inline-block mr-2"><Edit size={18} /></button>
                     <button onClick={() => deleteItem('skills', s.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors inline-block"><Trash2 size={18} /></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
          )}

          {activeTab === 'messages' && (
            <div className="p-6 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="p-6 border border-gray-800 rounded-2xl bg-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-white text-lg">{m.name}</h4>
                      <p className="text-sm text-primary">{m.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-400 text-sm leading-relaxed">{m.message}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8 max-w-2xl">
              <form onSubmit={handleSettingsSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Logo</label>
                  <div className="flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {settingsForm.logo || selectedFile ? (
                        <img 
                          src={selectedFile ? URL.createObjectURL(selectedFile) : `http://localhost:5000${settingsForm.logo}`} 
                          className="w-full h-full object-contain p-2" 
                          alt="Logo Preview" 
                        />
                      ) : (
                        <Settings className="w-8 h-8 text-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 relative group overflow-hidden rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all">
                      <input 
                        type="file" accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="py-6 flex flex-col items-center justify-center text-gray-500">
                        <Upload className="w-6 h-6 mb-1 text-primary" />
                        <span className="text-xs font-bold">Upload New Logo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Name / Logo Text</label>
                  <input 
                    type="text" value={settingsForm.siteName} 
                    onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    placeholder="e.g. DevPort."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Footer Text</label>
                  <input 
                    type="text" value={settingsForm.footerText} 
                    onChange={(e) => setSettingsForm({...settingsForm, footerText: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-secondary transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                >
                  {loading ? 'Updating...' : 'Save Site Settings'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
