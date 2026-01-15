
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../services/db';
import { ServiceInquiry, InquiryMessage, InquiryStatus, UserRole } from '../types';
import { Trash2, ExternalLink } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ServiceInquiry | null>(null);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedInquiry) {
      fetchMessages(selectedInquiry.id);
      const interval = setInterval(() => fetchMessages(selectedInquiry.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedInquiry?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInquiries = async () => {
    const data = await db.getServiceInquiries();
    setInquiries(data);
    setLoading(false);
  };

  const fetchMessages = async (inquiryId: string) => {
    const data = await db.getInquiryMessages(inquiryId);
    setMessages(prev => prev.length !== data.length ? data : prev);
  };

  const handleSelectInquiry = async (si: ServiceInquiry) => {
    setSelectedInquiry(si);
    fetchMessages(si.id);
  };

  const handleUpdateStatus = async (status: InquiryStatus) => {
    if (!selectedInquiry) return;
    await db.updateServiceInquiryStatus(selectedInquiry.id, status);
    setSelectedInquiry({...selectedInquiry, status});
    fetchInquiries();
  };

  const handleDeleteInquiry = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently remove this service order inquiry? All related messages will be lost.')) {
      try {
        await db.deleteInquiry(id);
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setInquiries(prev => prev.filter(si => si.id !== id));
      } catch (err) {
        console.error("Delete inquiry failed:", err);
        alert("Failed to delete the inquiry.");
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;
    
    const savedUser = localStorage.getItem('devport_session_user');
    const admin = savedUser ? JSON.parse(savedUser) : null;
    if (!admin) return;

    const msg: InquiryMessage = {
      id: Math.random().toString(36).substr(2, 9),
      inquiryId: selectedInquiry.id,
      senderId: admin.id,
      senderName: admin.name,
      senderRole: UserRole.ADMIN,
      text: replyText,
      createdAt: new Date().toISOString()
    };

    try {
      await db.addInquiryMessage(msg);
      setReplyText('');
      await fetchMessages(selectedInquiry.id);
    } catch (err) {
      alert("Error sending message");
    }
  };

  const getStatusColor = (status: InquiryStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-slate-100 text-slate-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  if (loading && inquiries.length === 0) return <div className="p-20 text-center text-slate-400">Loading inquiries...</div>;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* List Column */}
      <div className={`col-span-1 space-y-4 ${selectedInquiry ? 'hidden md:block' : 'col-span-3'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Service Orders</h2>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">Real-time</span>
        </div>
        <div className="grid gap-3">
          {inquiries.map(si => (
            <div 
              key={si.id} 
              onClick={() => handleSelectInquiry(si)}
              className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-300 relative group ${
                selectedInquiry?.id === si.id 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' 
                  : 'bg-white border-slate-100 hover:border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg ${
                  selectedInquiry?.id === si.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {si.serviceTitle}
                </span>
                <button 
                  onClick={(e) => handleDeleteInquiry(e, si.id)}
                  className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedInquiry?.id === si.id ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 text-slate-300 hover:text-red-500'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h4 className="font-black text-lg truncate mb-1">{si.clientName}</h4>
              <div className="flex justify-between items-center">
                <p className={`text-[10px] font-bold ${selectedInquiry?.id === si.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {new Date(si.createdAt).toLocaleDateString()}
                </p>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                  selectedInquiry?.id === si.id ? 'bg-white/10 text-white' : getStatusColor(si.status)
                }`}>
                  {si.status}
                </span>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && <div className="p-20 text-center text-slate-400 bg-white rounded-[40px] border border-dashed border-slate-100">No active orders found.</div>}
        </div>
      </div>

      {/* Detail Column (Chat Interface) */}
      {selectedInquiry ? (
        <div className="col-span-2 bg-white rounded-[40px] shadow-sm border border-slate-100 flex flex-col h-[750px] animate-slide-down overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-6">
              <button onClick={() => setSelectedInquiry(null)} className="md:hidden w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100">&larr;</button>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{selectedInquiry.clientName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{selectedInquiry.clientEmail}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <select 
                value={selectedInquiry.status} 
                onChange={(e) => handleUpdateStatus(e.target.value as InquiryStatus)}
                className="text-xs font-black bg-white border border-slate-200 px-5 py-3 rounded-2xl outline-none focus:ring-4 ring-indigo-50 cursor-pointer shadow-sm appearance-none"
              >
                <option value="pending">PENDING</option>
                <option value="accepted">ACCEPTED</option>
                <option value="in-progress">IN-PROGRESS</option>
                <option value="completed">COMPLETED</option>
                <option value="rejected">REJECTED</option>
              </select>
              <button 
                onClick={(e) => handleDeleteInquiry(e, selectedInquiry.id)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Delete Order"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 mb-10 relative">
              <div className="absolute top-8 right-8 text-indigo-100">
                <ExternalLink size={48} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.25em]">Project Objective</p>
              </div>
              <p className="text-slate-700 text-lg italic leading-relaxed font-medium">"{selectedInquiry.message}"</p>
            </div>

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.senderRole === UserRole.ADMIN ? 'justify-end' : 'justify-start'} animate-slide-down`}>
                <div className={`max-w-[80%] p-6 rounded-[32px] shadow-sm ${
                  m.senderRole === UserRole.ADMIN 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed font-bold">{m.text}</p>
                  <div className={`text-[8px] mt-3 font-black opacity-30 text-right uppercase tracking-tighter`}>
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendReply} className="p-8 border-t border-slate-50 bg-white">
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                value={replyText} 
                onChange={e => setReplyText(e.target.value)}
                placeholder="Secure message to client..."
                className="flex-1 px-8 py-5 rounded-[24px] bg-slate-50 border-none focus:bg-white focus:ring-4 ring-indigo-600/10 outline-none transition-all shadow-inner font-bold text-slate-700"
              />
              <button 
                type="submit" 
                disabled={!replyText.trim()} 
                className="bg-indigo-600 text-white w-16 h-16 rounded-[24px] flex items-center justify-center font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
              >
                <svg className="w-8 h-8 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="col-span-2 hidden md:flex items-center justify-center bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400">
           <div className="text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">💬</div>
             <p className="font-black text-slate-900 text-xl">Collaboration Hub</p>
             <p className="text-sm mt-2">Select a client inquiry from the left to start communication.</p>
           </div>
        </div>
      )}
    </div>
  );
};
