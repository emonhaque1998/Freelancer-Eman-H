
import React from 'react';
import { User } from '../types';

export const DashboardProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
        <img src={user.avatar} className="w-24 h-24 rounded-3xl object-cover" alt="Profile" />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{user.name}</h1>
          <p className="text-indigo-600 font-medium">Verified Graduate Member</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <p className="text-slate-700 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
              <p className="text-slate-700 font-medium">{user.email}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Academic Background</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Degree</label>
              <p className="text-slate-700 font-medium">B.Sc in {user.bscMajor}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
