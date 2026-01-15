
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { toast } from 'react-toastify';
import { User as UserIcon, Mail, GraduationCap, Calendar, Camera, ShieldCheck, Save, Loader2 } from 'lucide-react';

interface AdminProfileProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ user, onUserUpdate }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bscMajor: user.bscMajor || 'Computer Science',
    graduationYear: user.graduationYear || new Date().getFullYear().toString()
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bscMajor: user.bscMajor,
      graduationYear: user.graduationYear
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser: User = { ...user, ...formData };
      await db.updateUser({ ...formData, id: user.id });
      
      // Update local storage and app state
      localStorage.setItem('devport_session_user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      toast.success("Profile credentials updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile. Verification error.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-down">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Account</h2>
          <p className="text-slate-500 text-sm">Manage your platform identity and academic metadata.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
          <ShieldCheck className="text-indigo-600" size={16} />
          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Root Access</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Identity Preview Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto rounded-[32px] border-4 border-white overflow-hidden shadow-xl mb-6 bg-slate-50">
                <img 
                  src={formData.avatar || user.avatar} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  alt="Admin Avatar"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://utfs.io/f/placeholder-user.png" }}
                />
              </div>
              <h3 className="font-black text-slate-900 text-xl truncate">{formData.name}</h3>
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-1">Administrator</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <GraduationCap className="text-slate-400" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Degree</p>
                    <p className="text-xs font-bold text-slate-700">B.Sc in {formData.bscMajor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Calendar className="text-slate-400" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Class of</p>
                    <p className="text-xs font-bold text-slate-700">{formData.graduationYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-[32px] text-white">
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Security Note</p>
             <p className="text-xs text-slate-400 leading-relaxed">
               Email changes will update your login credentials immediately. Ensure the new address is active.
             </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <UserIcon size={14} /> Full Name
              </label>
              <input 
                required
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                placeholder="Your official name" 
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <Mail size={14} /> Email Address
              </label>
              <input 
                required
                type="email"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                placeholder="admin@corp.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
              <Camera size={14} /> Profile Picture (UTFS URL)
            </label>
            <input 
              value={formData.avatar} 
              onChange={e => setFormData({...formData, avatar: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-mono text-[10px] text-indigo-600 transition shadow-inner" 
              placeholder="https://utfs.io/f/..." 
            />
          </div>

          <div className="pt-6 border-t border-slate-50">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">Academic Metadata</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">B.Sc Major</label>
                <input 
                  value={formData.bscMajor} 
                  onChange={e => setFormData({...formData, bscMajor: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                  placeholder="e.g. Computer Science" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Graduation Year</label>
                <input 
                  value={formData.graduationYear} 
                  onChange={e => setFormData({...formData, graduationYear: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                  placeholder="2024" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-indigo-600 transition shadow-2xl disabled:opacity-50 text-xl flex items-center justify-center gap-3"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            {saving ? 'Processing Sync...' : 'Apply Identity Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
