
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const socials = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-4">
            <Link to="/" className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs" aria-label="Home">
              EH
            </Link>
            <p className="text-xs font-medium text-slate-500">
              &copy; {new Date().getFullYear()} <span className="text-slate-900 font-bold">Eman Haque</span>. All Rights Reserved.
            </p>
          </div>

          {/* Quick Nav */}
          <nav className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/projects" className="hover:text-indigo-600 transition-colors">Projects</Link>
            <Link to="/services" className="hover:text-indigo-600 transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon size={18} strokeWidth={2.5} />
                </a>
              ))}
            </div>
            <div className="w-px h-4 bg-slate-100 mx-2 hidden md:block"></div>
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
              className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 group"
              title="Back to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} strokeWidth={3} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
