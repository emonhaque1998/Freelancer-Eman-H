
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home as HomeIcon, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="relative inline-block mb-8">
          <div className="text-9xl font-black text-slate-200/50 select-none leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
             <AlertCircle className="w-16 h-16 text-indigo-600 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Lost in Cyberspace?</h1>
        <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
          The page you're looking for has moved to a new dimension or never existed in this reality.
        </p>
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <HomeIcon size={20} strokeWidth={3} /> 
            Back to Reality
          </Link>
        </motion.div>
        
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Eman Haque | Professional Web Solutions
          </p>
        </div>
      </motion.div>
    </div>
  );
};
