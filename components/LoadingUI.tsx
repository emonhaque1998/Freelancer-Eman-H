
import React from 'react';

export const PageLoader: React.FC = () => (
  <div className="fixed inset-0 bg-slate-50 z-[9999] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs animate-pulse">EH</div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-900 font-bold text-lg">Eman Haque</p>
        <p className="text-indigo-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Syncing Portfolio Data...</p>
      </div>
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-[450px]">
    <div className="h-64 shimmer w-full"></div>
    <div className="p-8 space-y-4">
      <div className="flex gap-2">
        <div className="w-12 h-4 shimmer rounded"></div>
        <div className="w-16 h-4 shimmer rounded"></div>
      </div>
      <div className="w-3/4 h-6 shimmer rounded"></div>
      <div className="w-full h-4 shimmer rounded"></div>
      <div className="w-2/3 h-4 shimmer rounded"></div>
      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
        <div className="w-24 h-4 shimmer rounded"></div>
        <div className="w-16 h-3 shimmer rounded"></div>
      </div>
    </div>
  </div>
);

export const ServiceItemSkeleton: React.FC = () => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-6 flex-1 w-full">
      <div className="w-16 h-16 shimmer rounded-2xl shrink-0"></div>
      <div className="space-y-2 flex-1">
        <div className="w-48 h-6 shimmer rounded"></div>
        <div className="w-32 h-4 shimmer rounded"></div>
        <div className="w-full h-3 shimmer rounded"></div>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="w-10 h-10 shimmer rounded-xl"></div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-slate-100">
    <td className="px-8 py-4"><div className="w-8 h-8 shimmer rounded-lg"></div></td>
    <td className="px-8 py-4"><div className="w-32 h-4 shimmer rounded"></div></td>
    <td className="px-8 py-4"><div className="w-48 h-4 shimmer rounded"></div></td>
    <td className="px-8 py-4"><div className="w-20 h-4 shimmer rounded-full"></div></td>
    <td className="px-8 py-4"><div className="w-24 h-4 shimmer rounded"></div></td>
  </tr>
);
