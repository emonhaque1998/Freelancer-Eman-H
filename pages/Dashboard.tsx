
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navItems = [
    { label: 'My Profile', path: 'profile', icon: '👤' },
    { label: 'My Orders', path: 'orders', icon: '📦' },
    { label: 'AI Career Coach', path: 'ai', icon: '🤖' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
               <div className="flex items-center gap-4">
                 <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover" alt="Avatar" />
                 <div className="overflow-hidden">
                   <p className="font-bold text-slate-900 truncate">{user.name}</p>
                   <p className="text-[10px] text-indigo-600 font-bold uppercase">Graduate</p>
                 </div>
               </div>
            </div>
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm border border-slate-100'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </aside>

          {/* Page Content */}
          <main className="flex-1 animate-slide-down">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
