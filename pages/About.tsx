
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/db';
import { AboutData } from '../types';
import { PageLoader } from '../components/LoadingUI';
import { Cpu, Monitor, Image as ImageIcon } from 'lucide-react';

export const About: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const about = await db.getAbout();
        setData(about);
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const SmartImage = ({ src, alt, className }: { src: string | undefined, alt: string, className: string }) => {
    const [error, setError] = useState(false);
    if (!src || error || src.includes('placeholder')) {
      return (
        <div className={`${className} bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-200`}>
          <ImageIcon className="text-slate-300 w-12 h-12 mb-2" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 text-center">Update via Admin Panel</span>
        </div>
      );
    }
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        onError={() => setError(true)}
      />
    );
  };

  if (loading) return <PageLoader />;
  if (!data) return <div className="p-20 text-center">No about data found.</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Section */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-indigo-100 rounded-[40px] blur-2xl opacity-30 animate-pulse"></div>
              <SmartImage 
                src={data.imageUrl} 
                alt={data.name} 
                className="relative w-full aspect-square object-cover rounded-[40px] shadow-2xl border-8 border-white"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                <p className="text-indigo-600 font-black text-xl mb-1">B.Sc Graduate</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{data.education}</p>
              </div>
            </motion.div>

            {/* Content Side */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">The Developer</h2>
                <h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">
                  I'm <span className="text-indigo-600">{data.name}</span>, <br /> Engineering Excellence.
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {data.bio}
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-indigo-600 text-2xl mb-2">🎓</div>
                  <h4 className="font-bold text-slate-900 mb-1">Academic Level</h4>
                  <p className="text-sm text-slate-500">B.Sc Computer Science</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-indigo-600 text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-slate-900 mb-1">Active Roles</h4>
                  <p className="text-sm text-slate-500">DevOps & Full Stack Architecture</p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200">
                 <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-6">Core Tech Arsenal</h4>
                 <div className="flex flex-wrap gap-3">
                  {data.skills.map(skill => (
                    <span key={skill} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl shadow-sm hover:border-indigo-600 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">Inside the Lab</h2>
            <h3 className="text-4xl font-black text-slate-900">My Workspace & <span className="text-indigo-600">Gear Setup.</span></h3>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Studio Shot */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-[40px] rotate-2 group-hover:rotate-0 transition-transform opacity-10"></div>
                <SmartImage 
                  src={data.workspaceImageUrl} 
                  alt="My Workspace" 
                  className="relative rounded-[40px] shadow-2xl border-4 border-white object-cover aspect-video w-full group-hover:scale-[1.01] transition-transform"
                />
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h4 className="flex items-center gap-3 text-xl font-black text-slate-900 mb-4">
                  <Monitor className="text-indigo-600" /> Creative Station
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  My workstation is optimized for high-performance development and content creation. 
                  Featuring a dedicated audio setup with a pop-filter mic and a DSLR monitoring system.
                </p>
              </div>
            </motion.div>

            {/* Hardware Shot */}
            <motion.div variants={itemVariants} className="space-y-6 lg:mt-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600 rounded-[40px] -rotate-2 group-hover:rotate-0 transition-transform opacity-10"></div>
                <SmartImage 
                  src={data.hardwareImageUrl} 
                  alt="Hardware Components" 
                  className="relative rounded-[40px] shadow-2xl border-4 border-white object-cover aspect-video w-full group-hover:scale-[1.01] transition-transform"
                />
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h4 className="flex items-center gap-3 text-xl font-black text-slate-900 mb-4">
                  <Cpu className="text-indigo-600" /> Hardware Engineering
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Deep diving into system architecture. My background includes building and maintaining 
                  complex server environments and custom hardware integration.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 bg-slate-900 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Philosophy</h2>
                <h3 className="text-4xl font-black text-white leading-tight">Vision for the <span className="text-indigo-400">Next Gen.</span></h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  I build systems that are resilient, scalable, and intuitive for humans.
                </p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                 <motion.div 
                  whileHover={{ y: -10 }}
                  className="p-10 bg-indigo-600 rounded-[40px] text-white shadow-2xl flex flex-col justify-between min-h-[300px]"
                 >
                    <div className="text-4xl mb-4">🚀</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-4">Global Reach</h4>
                      <p className="text-indigo-100 leading-relaxed font-medium">{data.vision}</p>
                    </div>
                 </motion.div>
                 <motion.div 
                  whileHover={{ y: -10 }}
                  className="p-10 bg-slate-800 rounded-[40px] text-white flex flex-col justify-between min-h-[300px]"
                 >
                    <div className="text-4xl mb-4">💎</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-6 uppercase tracking-widest text-sm text-slate-400">Core Values</h4>
                      <div className="space-y-4">
                        {data.values.map(val => (
                          <div key={val} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span className="font-bold text-slate-200">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
