
import React, { useState, useContext, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { LocationContext } from '../App';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar = memo<NavbarProps>(({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const geo = useContext(LocationContext);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Simple flag helper based on country code
  const getFlag = (code: string) => {
    if (!code) return '🌐';
    return code.toUpperCase().replace(/./g, char => 
      String.fromCodePoint(char.charCodeAt(0) + 127397)
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">EH</div>
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Eman Haque</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'border-indigo-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Location Badge */}
            {geo && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <span className="text-sm">{getFlag(geo.countryCode)}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{geo.currency}</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === UserRole.ADMIN ? '/admin' : '/dashboard'}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-4 py-2 rounded-xl transition"
                >
                  {user.role === UserRole.ADMIN ? 'Admin' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="text-slate-500 hover:text-slate-900 transition p-2"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}
          {geo && (
            <div className="px-3 pt-4 border-t border-slate-100 flex items-center gap-2">
              <span className="text-sm">{getFlag(geo.countryCode)}</span>
              <span className="text-xs font-bold text-slate-400">Prices converted to {geo.currency}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
});
