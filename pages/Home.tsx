
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../services/db';
import { AboutData } from '../types';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export const Home: React.FC = () => {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    db.getAbout().then(setAbout).catch(console.error);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-ping"></span>
                Available for new opportunities
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
                Building the Next Generation of <span className="text-indigo-600">Web Experiences</span>.
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                I'm a B.Sc Graduate Web Developer specialized in creating modern, 
                high-performance applications with React, Node.js, and clean architecture.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/projects"
                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 block"
                  >
                    View My Work
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="px-8 py-4 bg-white text-slate-900 font-black border border-slate-200 rounded-2xl hover:bg-slate-50 transition block"
                  >
                    Let's Talk
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-indigo-200 blur-[100px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              {about?.imageUrl ? (
                <img
                  src={about.imageUrl}
                  alt="Developer Profile"
                  className="relative rounded-[40px] shadow-2xl border border-white transition duration-700 group-hover:scale-[1.02] aspect-square object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="relative rounded-[40px] aspect-square bg-slate-100 flex items-center justify-center border-4 border-dashed border-slate-200">
                  <ImageIcon className="text-slate-300 w-20 h-20" />
                </div>
              )}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">B.Sc Graduated</div>
                  <div className="text-xs text-slate-500 font-bold">Computer Science Major</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-slate-50 border-y border-slate-100 relative"
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-4">Technical Proficiency</h2>
            <h3 className="text-4xl font-black text-slate-900">My Expert <span className="text-indigo-600">Tech Stack.</span></h3>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {about?.skills.map((skill, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="px-8 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all cursor-default flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-lg font-black text-slate-700">{skill}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to start your <span className="text-indigo-400">next project?</span></h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Let's build something exceptional together. Available for worldwide collaborations.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link 
                to="/contact" 
                className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-900/40 hover:bg-indigo-700 transition flex items-center gap-3"
              >
                Get in Touch <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
