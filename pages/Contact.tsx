
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { db } from '../services/db';
import { ContactMessage } from '../types';
import { MapPin, Navigation, Clock, ShieldCheck, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const msg: ContactMessage = {
        id: Math.random().toString(36).substr(2, 9),
        name: form.name,
        email: form.email,
        message: form.message,
        date: new Date().toISOString()
      };
      await db.saveMessage(msg);
      toast.success("Message transmitted successfully!");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 px-4 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-6">Let's Connect</h2>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8">
              Turning Ideas into <br /> <span className="text-indigo-600">Digital Solutions.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Reach out today for a professional engineering consultation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-4 ml-1">Identity Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition font-medium shadow-inner" placeholder="Eman Haque" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-4 ml-1">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition font-medium shadow-inner" placeholder="name@company.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-4 ml-1">Project Scope</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition font-medium shadow-inner" placeholder="Explain your requirements..." />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={sending}
                  className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition shadow-2xl disabled:opacity-50 text-lg flex items-center justify-center gap-3"
                >
                  {sending ? 'Transmitting...' : 'Send Message'} <Send size={20} />
                </motion.button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-16"
            >
              <div className="p-10 bg-indigo-600 rounded-[40px] text-white shadow-2xl shadow-indigo-100">
                <div className="flex items-center gap-2 mb-6 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Active Monitoring
                </div>
                <h4 className="text-3xl font-black mb-6">Business Hours</h4>
                <div className="space-y-4 font-bold">
                  <div className="flex justify-between items-center border-b border-indigo-500/50 pb-4">
                    <span>Monday - Friday</span>
                    <span className="text-indigo-200">09:00 - 18:00 (GMT+6)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-indigo-600 mb-2"><MapPin size={24} /></div>
                  <h5 className="font-black text-slate-900 text-xs uppercase mb-1">Office</h5>
                  <p className="text-sm text-slate-500 font-medium">Dhaka, BD</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-indigo-600 mb-2"><Clock size={24} /></div>
                  <h5 className="font-black text-slate-900 text-xs uppercase mb-1">Reply Time</h5>
                  <p className="text-sm text-slate-500 font-medium">&lt; 12 Hours</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
