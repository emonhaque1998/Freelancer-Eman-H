
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Project } from '../types';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveUrl: '',
    demoUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await db.getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      toast.error("Error loading project repository.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      techStack: p.techStack.join(', '),
      liveUrl: p.liveUrl,
      demoUrl: p.demoUrl,
      imageUrl: p.imageUrl
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const project: Project = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== ''),
      liveUrl: formData.liveUrl,
      demoUrl: formData.demoUrl,
      imageUrl: formData.imageUrl || `https://utfs.io/f/placeholder-project.png`,
      createdAt: editingId ? (projects.find(p => p.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };
    
    try {
      await db.saveProject(project);
      toast.success(editingId ? "Project architecture updated." : "New project successfully deployed.");
      resetForm();
      fetchProjects();
    } catch (err) {
      toast.error("Database save operation failed.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', techStack: '', liveUrl: '', demoUrl: '', imageUrl: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to permanently delete this project?')) {
      setActionLoading(id);
      try {
        await db.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.info("Project record permanently removed.");
      } catch (err) {
        toast.error("Deletion failed. Integrity check required.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Projects</h2>
          <p className="text-slate-500 text-sm">Create and manage your showcase items.</p>
        </div>
        <button 
          onClick={() => { if(isAdding) resetForm(); else setIsAdding(true); }} 
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${
            isAdding ? 'bg-slate-200 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add New Project</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProject} className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm space-y-4 animate-slide-down">
          <h3 className="font-bold text-slate-900">{editingId ? 'Edit Project' : 'New Project'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">General Info</label>
              <input required placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300 shadow-inner" />
              <input required placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300 shadow-inner" />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Live Links</label>
              <input required placeholder="Live URL" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300 shadow-inner" />
              <input required placeholder="Demo URL (GitHub)" value={formData.demoUrl} onChange={e => setFormData({...formData, demoUrl: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300 shadow-inner" />
            </div>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-2xl">
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 flex items-center gap-2">
              <ImageIcon size={12} /> Thumbnail (Paste UploadThing URL)
            </label>
            <input 
              placeholder="https://utfs.io/f/..." 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none w-full text-indigo-400 font-bold focus:border-indigo-500 transition shadow-inner" 
            />
          </div>

          <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300 shadow-inner" rows={4}></textarea>
          
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            {editingId ? 'Update Project' : 'Save Project'}
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center group transition-all ${actionLoading === p.id ? 'opacity-50 grayscale scale-95' : 'hover:border-indigo-200'}`}>
            <div className="w-full md:w-32 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
               <img 
                 src={p.imageUrl} 
                 className="w-full h-full object-cover" 
                 alt="" 
                 onError={(e) => { (e.target as HTMLImageElement).src = "https://utfs.io/f/placeholder-project.png" }}
               />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-1">{p.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.techStack.map(t => <span key={t} className="text-[8px] bg-slate-50 px-2 py-0.5 rounded font-bold text-slate-400">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={16} /></button>
              <button onClick={(e) => handleDelete(e, p.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                {actionLoading === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
