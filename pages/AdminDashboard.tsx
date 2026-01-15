
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { db } from '../services/db';

export const AdminDashboard: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheckCount, setLastCheckCount] = useState(0);

  useEffect(() => {
    const checkMessages = async () => {
      const messages = await db.getMessages();
      if (messages.length > lastCheckCount) {
        setUnreadCount(messages.length - lastCheckCount);
      }
    };
    checkMessages();
    const interval = setInterval(checkMessages, 10000);
    return () => clearInterval(interval);
  }, [lastCheckCount]);

  const adminLinks = [
    { label: 'Users', path: 'users', icon: '👥' },
    { label: 'Admin Profile', path: 'profile', icon: '🆔' },
    { label: 'Manage About', path: 'about-me', icon: '👤' },
    { label: 'Projects', path: 'projects', icon: '📁' },
    { label: 'Services', path: 'services', icon: '🛠️' },
    { label: 'Inquiries', path: 'inquiries', icon: '📩' },
    { label: 'Contact Messages', path: 'messages', icon: '💬', badge: unreadCount > 0 ? 'New' : null },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-xl shadow-indigo-100">A</div>
              <h2 className="font-extrabold text-slate-900">Admin Panel</h2>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Management Suite</p>
            </div>
            {adminLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (link.path === 'messages') {
                    setUnreadCount(0);
                    db.getMessages().then(m => setLastCheckCount(m.length));
                  }
                }}
                className={({ isActive }) => 
                  `w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{link.icon}</span>
                  {link.label}
                </div>
                {link.badge && (
                  <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full animate-pulse">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </aside>

          {/* Management Content Area */}
          <main className="flex-1 animate-slide-down">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
