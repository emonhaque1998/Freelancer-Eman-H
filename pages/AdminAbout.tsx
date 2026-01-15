
import React, { useEffect, useState } from 'react';
import { db, UPLOADTHING_CONFIG } from '../services/db';
import { AboutData } from '../types';
import { toast } from 'react-toastify';
import { CloudUpload, ShieldCheck, Image as ImageIcon, CheckCircle2, Info, Monitor, Cpu, Globe, Share2 } from 'lucide-react';

export const AdminAbout: React.FC = () => {
  const [formData, setFormData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const data = await db.getAbout();
      setFormData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch brand metadata.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    try {
      await db.updateAbout(formData);
      // Trigger favicon update in real-time
      if (formData.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = formData.faviconUrl;
      }
      toast.success("Brand synchronization successful! All visuals are live.");
    } catch (err) {
      toast.error("Cloud synchronization failed. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Syncing with Cloud...</div>;
  if (!formData) return null;

  return (
    <div className="space-y-8 animate-slide-down pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">CMS: Brand Assets</h2>
          <p className="text-slate-500 text-sm">Manage visuals and metadata securely using UploadThing.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-12">
        {/* UploadThing Connection Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-green-400" size={24} />
              <h3 className="text-xl font-black">UploadThing Active</h3>
            </div>
            <p className="text-slate-400 text-sm">Target App ID: <span className="text-indigo-400 font-mono">{UPLOADTHING_CONFIG.appId}</span></p>
          </div>
          <a 
            href={`https://uploadthing.com/dashboard/${UPLOADTHING_CONFIG.appId}`} 
            target="_blank" 
            className="relative z-10 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/40"
          >
            <CloudUpload size={18} /> Open Cloud Manager
          </a>
        </div>

        {/* Media Hub */}
        <section className="space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
             <h3 className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Visual Media Hub</h3>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Asset 1: Profile */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <ImageIcon size={14} /> Profile Image
              </label>
              <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 group relative">
                {formData.imageUrl && !formData.imageUrl.includes('placeholder') ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Profile" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <CloudUpload size={40} strokeWidth={1} />
                    <p className="text-[10px] mt-2 font-black">Awaiting URL</p>
                  </div>
                )}
              </div>
              <input 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-mono text-indigo-600 shadow-inner" 
                placeholder="Paste UTFS URL..." 
              />
            </div>

            {/* Asset 2: Workspace */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <Monitor size={14} /> Workspace Lab
              </label>
              <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 group relative">
                {formData.workspaceImageUrl && !formData.workspaceImageUrl.includes('placeholder') ? (
                  <img src={formData.workspaceImageUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Workspace" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <CloudUpload size={40} strokeWidth={1} />
                    <p className="text-[10px] mt-2 font-black">Awaiting URL</p>
                  </div>
                )}
              </div>
              <input 
                value={formData.workspaceImageUrl || ''} 
                onChange={e => setFormData({...formData, workspaceImageUrl: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-mono text-indigo-600 shadow-inner" 
                placeholder="Paste UTFS URL..." 
              />
            </div>

            {/* Asset 3: Hardware */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <Cpu size={14} /> Hardware Tech
              </label>
              <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 group relative">
                {formData.hardwareImageUrl && !formData.hardwareImageUrl.includes('placeholder') ? (
                  <img src={formData.hardwareImageUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Hardware" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <CloudUpload size={40} strokeWidth={1} />
                    <p className="text-[10px] mt-2 font-black">Awaiting URL</p>
                  </div>
                )}
              </div>
              <input 
                value={formData.hardwareImageUrl || ''} 
                onChange={e => setFormData({...formData, hardwareImageUrl: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-mono text-indigo-600 shadow-inner" 
                placeholder="Paste UTFS URL..." 
              />
            </div>

            {/* Asset 4: Favicon */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                <Globe size={14} /> Site Favicon
              </label>
              <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-900 border-4 border-slate-800 group relative flex items-center justify-center p-8">
                {formData.faviconUrl && !formData.faviconUrl.includes('placeholder') ? (
                  <div className="relative group/fav">
                    <img src={formData.faviconUrl} className="w-16 h-16 object-contain rounded-lg shadow-2xl transition duration-500 group-hover/fav:scale-125" alt="Favicon" />
                    <div className="absolute -top-12 -left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-bold text-white opacity-0 group-hover/fav:opacity-100 transition-opacity">Browser Preview</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-700">
                    <Globe size={40} strokeWidth={1} />
                    <p className="text-[10px] mt-2 font-black">Small Square Icon</p>
                  </div>
                )}
              </div>
              <input 
                value={formData.faviconUrl || ''} 
                onChange={e => setFormData({...formData, faviconUrl: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-[10px] font-mono text-indigo-600 shadow-inner" 
                placeholder="Paste UTFS .ico/.png URL..." 
              />
            </div>
          </div>
        </section>

        {/* SEO Sharing Section */}
        <section className="space-y-8 pt-10 border-t border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
             <h3 className="text-pink-600 font-bold uppercase tracking-widest text-xs">SEO & Social Sharing Assets</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase ml-1">
                  <Share2 size={14} /> Social Media Thumbnail (OG Image)
                </label>
                <p className="text-[10px] text-slate-500 mb-4">This image appears when you share your link on Facebook, Twitter, WhatsApp, etc. Recommended size: 1200x630px.</p>
                <input 
                  value={formData.seoThumbnailUrl || ''} 
                  onChange={e => setFormData({...formData, seoThumbnailUrl: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-pink-50 font-mono text-[10px] text-pink-600 transition shadow-inner" 
                  placeholder="Paste UTFS URL for social sharing image..." 
                />
              </div>

              <div className="p-6 bg-pink-50 rounded-3xl border border-pink-100 flex items-start gap-3">
                <Info className="text-pink-600 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-pink-800 font-medium">
                  Updating this URL will immediately apply to your website's <b>og:image</b> and <b>twitter:image</b> meta tags.
                </p>
              </div>
            </div>

            <div className="space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Sharing Preview (Live Simulation)</label>
               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center overflow-hidden">
                    {formData.seoThumbnailUrl && !formData.seoThumbnailUrl.includes('placeholder') ? (
                      <img src={formData.seoThumbnailUrl} className="w-full h-full object-cover" alt="Social Preview" />
                    ) : (
                      <div className="text-slate-300 flex flex-col items-center">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-[10px] font-bold mt-2">No Image Selected</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">EMANHAQUE.DEV</p>
                    <h4 className="font-bold text-slate-900 text-sm">{formData.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{formData.overview}</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Text Metadata */}
        <section className="space-y-8 pt-10 border-t border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
             <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Profile Metadata</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Professional Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-bold text-slate-900 transition" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">About Bio</label>
              <textarea required rows={6} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 ring-indigo-50 font-medium text-slate-600 leading-relaxed transition" />
            </div>
          </div>
        </section>

        <button 
          type="submit" 
          disabled={saving} 
          className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-indigo-600 transition shadow-2xl disabled:opacity-50 text-xl tracking-tight"
        >
          {saving ? 'Synchronizing Securely...' : 'Publish Visual Updates'}
        </button>
      </form>
    </div>
  );
};
