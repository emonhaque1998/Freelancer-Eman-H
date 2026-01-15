
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Service } from '../types';
import { ServiceItemSkeleton } from '../components/LoadingUI';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: '🚀',
    features: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await db.getServices();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Service catalog retrieval failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    setFormData({
      title: s.title,
      description: s.description,
      price: s.price,
      icon: s.icon,
      features: s.features.join(', ')
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const service: Service = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      icon: formData.icon,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== '')
    };

    try {
      await db.saveService(service);
      toast.success(editingId ? "Service offering updated." : "New service published to catalog.");
      resetForm();
      fetchServices();
    } catch (err) {
      toast.error("Failed to persist service data.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', icon: '🚀', features: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this service offering? This will also remove any related inquiries.')) {
      setActionLoading(id);
      try {
        await db.deleteService(id);
        setServices(prev => prev.filter(s => s.id !== id));
        toast.info("Service offering decommissioned.");
      } catch (err) {
        toast.error("Decommissioning failed. Dependency error.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Services</h2>
          <p className="text-slate-500 text-sm">Manage the services you offer to clients.</p>
        </div>
        <button 
          onClick={() => { if(isAdding) resetForm(); else setIsAdding(true); }} 
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${
            isAdding 
            ? 'bg-slate-200 text-slate-600' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add New Service</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddService} className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-sm space-y-4 animate-slide-down">
          <h3 className="font-bold text-slate-900">{editingId ? 'Edit Service Offering' : 'New Service Offering'}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Icon (Emoji)</label>
              <input required placeholder="🚀" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Service Title</label>
              <input required placeholder="e.g. Premium Web Design" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Price Tag</label>
              <input required placeholder="e.g. Starts at $500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Features (Comma separated)</label>
              <input required placeholder="SEO, Responsive, 24/7 Support" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
            <textarea required placeholder="Describe what this service covers in detail..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="px-5 py-3 rounded-xl bg-slate-50 outline-none w-full border border-transparent focus:border-indigo-300" rows={4}></textarea>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            {editingId ? 'Update Service' : 'Publish Service'}
          </button>
        </form>
      )}

      <div className="grid gap-6">
        {loading && services.length === 0 ? (
          Array(4).fill(0).map((_, i) => <ServiceItemSkeleton key={i} />)
        ) : (
          services.map(s => (
            <div key={s.id} className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-100 transition-all group ${actionLoading === s.id ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              <div className="flex items-center gap-6 flex-1">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                  <p className="text-indigo-600 font-bold text-sm mb-1">{s.price}</p>
                  <p className="text-slate-500 text-sm line-clamp-1">{s.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(s)} 
                  disabled={!!actionLoading}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30"
                  title="Edit Service"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, s.id)} 
                  disabled={!!actionLoading}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 relative overflow-hidden"
                  title="Delete Service"
                >
                  {actionLoading === s.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && services.length === 0 && !isAdding && (
          <div className="p-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            No services listed yet. Start by adding one above.
          </div>
        )}
      </div>
    </div>
  );
};
