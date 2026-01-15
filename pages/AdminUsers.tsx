
import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../services/db';
import { User, UserRole } from '../types';
import { TableRowSkeleton } from '../components/LoadingUI';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Pagination } from '../components/Pagination';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await db.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("User repository sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      await db.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("User access role upgraded.");
    } catch (err) {
      toast.error("Access modification rejected by system.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const savedUser = localStorage.getItem('devport_session_user');
    const currentAdmin = savedUser ? JSON.parse(savedUser) : null;
    
    if (currentAdmin && currentAdmin.id === userId) {
      toast.warning("Suicide prevented: You cannot delete your own admin account.");
      return;
    }

    if (confirm('Are you absolutely sure? This user will lose access to their dashboard and history.')) {
      try {
        await db.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.info("User identity purged from system.");
      } catch (err) {
        toast.error("Purge operation failed.");
      }
    }
  };

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return users.slice(start, start + ITEMS_PER_PAGE);
  }, [users, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Users</h2>
          <p className="text-slate-500 text-sm">Manage user access levels and roles.</p>
        </div>
        <button onClick={fetchUsers} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh List
        </button>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-8 py-4">Identity</th>
                <th className="px-8 py-4">Details</th>
                <th className="px-8 py-4">Access Role</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                paginatedUsers.map(u => (
                  <tr key={u.id} className={`hover:bg-slate-50/50 transition ${updatingId === u.id ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} loading="lazy" className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="text-sm text-slate-600 font-medium">{u.email}</div>
                      <div className="text-[10px] text-slate-400">Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-4">
                      <select 
                        value={u.role} 
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase cursor-pointer border-none outline-none focus:ring-4 ring-indigo-50 transition-all shadow-sm ${
                          u.role === UserRole.ADMIN 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value={UserRole.USER} className="bg-white text-slate-900">User</option>
                        <option value={UserRole.ADMIN} className="bg-white text-slate-900">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && users.length === 0 && <div className="p-20 text-center text-slate-400 font-medium">No users discovered in system.</div>}
      </div>

      {!loading && users.length > 0 && (
        <Pagination
          totalItems={users.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
