
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AboutData } from '../types';
import { toast } from 'react-toastify';
import { Search, Globe, Share2, Info, ExternalLink, Save, CheckCircle2, FileCode, ShieldAlert } from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const [formData, setFormData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getAbout().then(data => {
      setFormData(data);
      setLoading(false);
    }).catch(err => {
      toast.error("Failed to load SEO data.");
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    try {
      await db.updateAbout(formData);
      toast.success("SEO records updated and deployed!");
    } catch (err) {
      toast.error("Failed to sync SEO records.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Syncing SEO Engine...</div>;
  if (!formData) return null;

  return (
    <div className="space-y-8 animate-slide-down">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">SEO & Indexing Manager</h2>
        <p className="text-slate-500 text-sm">Configure how search engines and social platforms see your website.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 pb-20">
        
        {/* Token Verification Card (File Simulation) */}
        <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-10 opacity-10 text-indigo-400">
             <FileCode size={140} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black">Token-based Verification</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Google Verification File Simulation</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                    <Info size={16} className="text-indigo-400" /> Instructions:
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Google আপনাকে একটি <code className="text-indigo-400">.html</code> ফাইল ডাউনলোড করতে বলবে। সেই ফাইলের নাম এবং ভেতরের কোডটি এখানে দিন। ওয়েবসাইট নিজেই সেই ফাইলটি গুগলের কাছে উপস্থাপন করবে।
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 mb-2">Verification Filename</label>
                   <input 
                     value={formData.googleVerificationFileName || ''} 
                     onChange={e => setFormData({...formData, googleVerificationFileName: e.target.value})}
                     placeholder="Example: google6e7f8g9h.html"
                     className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition font-mono text-xs"
                   />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase ml-1 mb-2">Verification Token (Inner Content)</label>
                   <input 
                     value={formData.googleVerificationToken || ''} 
                     onChange={e => setFormData({...formData, googleVerificationToken: e.target.value})}
                     placeholder="Example: google-site-verification: google6e7f8g9h.html"
                     className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-indigo-500 transition font-mono text-xs text-indigo-400"
                   />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Meta Card */}
        <div className="bg-white p-10 rounded-[40px] border border-orange-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Standard HTML Meta Tag</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Alternative Verification Method</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-xs text-slate-500 font-medium">
                If you prefer the Meta Tag method, just paste the <code className="text-orange-600">content</code> ID here.
              </p>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Meta content ID</label>
              <input 
                value={formData.googleVerificationId || ''} 
                onChange={e => setFormData({...formData, googleVerificationId: e.target.value})}
                placeholder="pR_7Tj7v0W6..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-orange-50 transition font-mono text-xs shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Social Sharing Card */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Share2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Social Media (Open Graph)</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Facebook & Twitter Preview</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1 mb-2">Global Meta Description</label>
                <textarea 
                  rows={3}
                  value={formData.overview} 
                  onChange={e => setFormData({...formData, overview: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-medium text-slate-600 text-sm shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1 mb-2">Sharing Thumbnail URL</label>
                <input 
                  value={formData.seoThumbnailUrl || ''} 
                  onChange={e => setFormData({...formData, seoThumbnailUrl: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-mono text-[10px] text-indigo-600 shadow-inner"
                  placeholder="https://utfs.io/f/..."
                />
              </div>
            </div>

            <div className="space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Live Preview Simulation</label>
               <div className="bg-slate-50 border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="aspect-[1.91/1] bg-slate-200 overflow-hidden">
                    {formData.seoThumbnailUrl ? (
                      <img src={formData.seoThumbnailUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">EMANHAQUE.DEV</p>
                    <h4 className="font-bold text-slate-900 mb-1">{formData.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{formData.overview}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black hover:bg-indigo-600 transition shadow-2xl disabled:opacity-50 text-xl flex items-center justify-center gap-3"
        >
          {saving ? <Save className="animate-spin" /> : <CheckCircle2 size={24} />}
          {saving ? 'Saving SEO Configuration...' : 'Save & Publish SEO Settings'}
        </button>
      </form>
    </div>
  );
};
