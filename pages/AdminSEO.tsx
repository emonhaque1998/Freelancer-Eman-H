
import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { AboutData } from '../types';
import { toast } from 'react-toastify';
import { Search, Globe, Share2, Info, ExternalLink, Save, CheckCircle2, Terminal, ShieldCheck } from 'lucide-react';

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
      toast.success("SEO & Verification records deployed!");
    } catch (err) {
      toast.error("Cloud sync failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Syncing SEO Engine...</div>;
  if (!formData) return null;

  return (
    <div className="space-y-8 animate-slide-down pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Search Engine Manager</h2>
        <p className="text-slate-500 text-sm">Verify site ownership and manage crawler visibility.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Modern Google Connectivity Hub */}
        <div className="bg-white p-10 rounded-[40px] border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-600">
            <Search size={140} />
          </div>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Google Console Connectivity</h3>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Ownership Verification</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                  <Terminal size={16} className="text-indigo-600" /> Token Verification Guide:
                </h4>
                <ul className="text-xs text-slate-500 space-y-3 list-disc ml-4 font-medium">
                  <li>Open <a href="https://search.google.com/search-console" target="_blank" className="text-indigo-600 underline font-bold">Google Search Console</a>.</li>
                  <li>Choose your property and go to <b>Settings &rarr; Verification</b>.</li>
                  <li>Select <b>"HTML Tag"</b> method.</li>
                  <li>Copy the <b>content</b> value (this is your TXT Token).</li>
                  <li>Paste it into the field on the right.</li>
                </ul>
              </div>
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                className="inline-flex items-center gap-2 text-xs font-black bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-indigo-600 transition shadow-lg"
              >
                Access Google Console <ExternalLink size={14} />
              </a>
            </div>

            <div className="space-y-6">
               <div className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100">
                  <label className="block text-[10px] font-black text-indigo-400 uppercase mb-3 ml-1">Verification Token / Content ID</label>
                  <input 
                    value={formData.googleConsoleToken || ''} 
                    onChange={e => setFormData({...formData, googleConsoleToken: e.target.value})}
                    placeholder="Example: pR_7Tj7v0W6-k2m..."
                    className="w-full px-6 py-5 rounded-2xl bg-white border-2 border-transparent focus:border-indigo-500 outline-none transition font-mono text-xs shadow-sm text-indigo-900"
                  />
                  <p className="text-[9px] text-slate-400 mt-4 italic font-medium">
                    * The system will automatically inject this as: <br />
                    <code className="text-indigo-600">&lt;meta name="google-site-verification" content="..." /&gt;</code>
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Branding & Social Preview */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-pink-100 rounded-3xl flex items-center justify-center text-pink-600">
              <Share2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Social Metadata</h3>
              <p className="text-xs text-pink-600 font-bold uppercase tracking-widest">Open Graph & Previews</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase ml-1 mb-2">SEO Description</label>
                <textarea 
                  rows={4}
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
                />
              </div>
            </div>

            <div className="space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Live Appearance Simulation</label>
               <div className="bg-slate-50 border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
                  <div className="aspect-[1.91/1] bg-slate-200 overflow-hidden">
                    {formData.seoThumbnailUrl ? (
                      <img src={formData.seoThumbnailUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">NO THUMBNAIL</div>
                    )}
                  </div>
                  <div className="p-8">
                    <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">EMANHAQUE.DEV</p>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">{formData.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{formData.overview}</p>
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
          {saving ? 'Processing Cloud Sync...' : 'Save & Deploy SEO Changes'}
        </button>
      </form>
    </div>
  );
};
