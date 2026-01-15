
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Ghost, MoveLeft, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center bg-slate-50 overflow-hidden px-4">
      {/* Decorative Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[48px] p-8 md:p-16 text-center">
          
          <div className="relative inline-flex mb-12">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent opacity-10 select-none"
            >
              404
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-200"
              >
                <Ghost className="text-white w-12 h-12 md:w-16 md:h-16" strokeWidth={2.5} />
              </motion.div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            System Error: <span className="text-indigo-600">Route Not Found</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 max-w-md mx-auto leading-relaxed">
            The endpoint you requested is unreachable or has been deprecated in this version of the universe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/" 
                className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black shadow-2xl hover:bg-indigo-600 transition-all duration-300"
              >
                <HomeIcon size={20} className="group-hover:-translate-y-0.5 transition-transform" /> 
                Return to Home
              </Link>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 transition-all duration-300"
            >
              <MoveLeft size={20} /> 
              Go Back
            </motion.button>
          </div>

          {/* Footer Detail */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-500">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">B.Sc Graduate Portfolio System</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400">© {new Date().getFullYear()} Eman Haque • All Nodes Operational</p>
          </div>
        </div>
      </motion.div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px]"></div>
    </div>
  );
};
