
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { toast } from 'react-toastify';
import { User as UserIcon, Mail, GraduationCap, Calendar, Camera, ShieldCheck, Save, Loader2, Lock, Eye, EyeOff } from 'lucide-react';

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
    graduationYear: user.graduationYear || new Date().getFullYear().toString(),
    password: user.password
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bscMajor: user.bscMajor,
      graduationYear: user.graduationYear,
      password: user.password
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation if they are trying to change it
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("Security mismatch: New passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password too weak. Use at least 6 characters.");
        return;
      }
    }

    setSaving(true);
    try {
      const updatePayload: Partial<User> & { id: string } = {
        ...formData,
        id: user.id
      };

      // Only update password if a new one was entered
      if (newPassword) {
        updatePayload.password = newPassword;
      }

      await db.updateUser(updatePayload);
      
      const updatedUser: User = { ...user, ...updatePayload };
      
      // Update local storage and app state
      localStorage.setItem('devport_session_user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      setNewPassword('');
      setConfirmPassword('');
      toast.success("Identity and security records updated!");
    } catch (err) {
      toast.error("Failed to sync profile. Verification error.");
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
          <p className="text-slate-500 text-sm">Manage your platform identity, security, and academic metadata.</p>
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
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-slate-400 shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Degree</p>
                    <p className="text-xs font-bold text-slate-700">B.Sc in {formData.bscMajor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-slate-400 shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Class of</p>
                    <p className="text-xs font-bold text-slate-700">{formData.graduationYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-[32px] text-white">
             <div className="flex items-center gap-2 mb-3">
               <Lock className="text-indigo-400" size={16} />
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Security Protocol</p>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               Changing your password will take effect immediately. Keep it complex and secure.
             </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              <h3 className="text-indigo-600 font-bold uppercase tracking-widest text-xs">General Identity</h3>
            </div>
            
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
          </section>

          {/* Security Section */}
          <section className="space-y-6 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
              <h3 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Access Security</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                  New Password
                </label>
                <div className="relative">
                  <input 
                    type={showPass ? "text" : "password"}
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner pr-12" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                  Confirm Password
                </label>
                <input 
                  type={showPass ? "text" : "password"}
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full opacity-30"></div>
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Academic Metadata</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">B.Sc Major</label>
                <input 
                  value={formData.bscMajor} 
                  onChange={e => setFormData({...formData, bscMajor: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Graduation Year</label>
                <input 
                  value={formData.graduationYear} 
                  onChange={e => setFormData({...formData, graduationYear: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition shadow-inner" 
                />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-indigo-600 transition shadow-2xl disabled:opacity-50 text-xl flex items-center justify-center gap-3"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            {saving ? 'Processing Sync...' : 'Apply Admin Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
