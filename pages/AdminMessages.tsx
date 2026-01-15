
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { db } from '../services/db';
import { ContactMessage } from '../types';
import { Trash2, MailOpen } from 'lucide-react';
import { Pagination } from '../components/Pagination';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState<ContactMessage | null>(null);
  const lastIdRef = useRef<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {}
  };

  const fetchMessages = async (isInitial: boolean) => {
    if (isInitial) setLoading(true);
    const data = await db.getMessages();
    
    if (data.length > 0) {
      const latestMessage = data[0];
      if (lastIdRef.current && latestMessage.id !== lastIdRef.current) {
        setNewNotification(latestMessage);
        playNotificationSound();
        setTimeout(() => setNewNotification(null), 10000);
      }
      lastIdRef.current = latestMessage.id;
    }
    
    setMessages(data);
    setLoading(false);
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this message?')) {
      try {
        await db.deleteMessage(id);
        setMessages(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete the message. Please try again.");
      }
    }
  };

  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return messages.slice(start, start + ITEMS_PER_PAGE);
  }, [messages, currentPage]);

  if (loading && messages.length === 0) return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Synchronizing Inbox...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">General Inbox</h2>
          <p className="text-slate-500 text-sm">Real-time messages from visitors.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Active Monitoring</span>
        </div>
      </div>

      {newNotification && (
        <div className="fixed top-20 right-8 z-[100] w-80 bg-white p-6 rounded-3xl shadow-2xl border-2 border-indigo-500 animate-slide-down">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">📩</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">New Message!</h4>
                <p className="text-[10px] text-indigo-600 font-bold uppercase">Just Received</p>
              </div>
            </div>
            <button onClick={() => setNewNotification(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
          </div>
          <p className="text-xs text-slate-600 font-medium mb-1">{newNotification.name}</p>
          <p className="text-xs text-slate-400 line-clamp-2 italic">"{newNotification.message}"</p>
        </div>
      )}

      <div className="space-y-4">
        {paginatedMessages.map(m => (
          <div key={m.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-slide-down hover:border-indigo-100 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{m.name}</h4>
                  <a href={`mailto:${m.email}`} className="text-xs text-indigo-600 font-bold hover:underline">{m.email}</a>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(m.date).toLocaleDateString()}</span>
                <p className="text-[9px] text-slate-300 font-bold">{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MailOpen size={48} />
              </div>
              <p className="text-slate-700 text-sm leading-relaxed relative z-10 italic">"{m.message}"</p>
            </div>
            <div className="mt-6 flex justify-between items-center">
               <a href={`mailto:${m.email}`} className="text-xs font-bold bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Direct Reply</a>
               <button 
                  onClick={() => handleDeleteMessage(m.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Delete Conversation"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-20 text-center text-slate-400 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-bold text-slate-900">Inbox is empty.</p>
            <p className="text-xs mt-2">All caught up! No one has reached out yet.</p>
          </div>
        )}
      </div>

      {!loading && messages.length > 0 && (
        <Pagination
          totalItems={messages.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
