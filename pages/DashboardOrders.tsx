
import React, { useState, useEffect, useRef } from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';
import { User, ServiceInquiry, InquiryMessage, InquiryStatus, UserRole } from '../types';
import { db } from '../services/db';

export const DashboardOrders: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<ServiceInquiry[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ServiceInquiry | null>(null);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchOrders();
    // Refresh order list status every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      fetchMessages(selectedOrder.id);
      // Real-time polling for messages every 3 seconds
      const interval = setInterval(() => fetchMessages(selectedOrder.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedOrder?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOrders = async () => {
    const data = await db.getServiceInquiriesByClient(user.id);
    setOrders(data);
  };

  const fetchMessages = async (inquiryId: string) => {
    const data = await db.getInquiryMessages(inquiryId);
    // Only update state if length changed to prevent unnecessary re-renders
    setMessages(prev => prev.length !== data.length ? data : prev);
  };

  const handleSelectOrder = (order: ServiceInquiry) => {
    setSelectedOrder(order);
    fetchMessages(order.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !replyText.trim()) return;
    setSendingMessage(true);
    const msg: InquiryMessage = {
      id: Math.random().toString(36).substr(2, 9),
      inquiryId: selectedOrder.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: UserRole.USER,
      text: replyText,
      createdAt: new Date().toISOString()
    };
    try {
      await db.addInquiryMessage(msg);
      setReplyText('');
      await fetchMessages(selectedOrder.id);
    } catch (err) {
      alert("Failed to send message.");
    } finally {
      setSendingMessage(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Service Orders</h2>
        {selectedOrder && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Chat Active</span>
          </div>
        )}
      </div>

      {selectedOrder ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[650px] animate-slide-down">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <button onClick={() => setSelectedOrder(null)} className="text-sm font-bold text-indigo-600 mb-1 flex items-center gap-1 hover:underline">
                &larr; Back to List
              </button>
              <h3 className="text-xl font-bold text-slate-900">{selectedOrder.serviceTitle}</h3>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Initial Inquiry Message</p>
              <p className="text-slate-600 italic leading-relaxed text-sm">"{selectedOrder.message}"</p>
            </div>
            
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.senderRole === UserRole.ADMIN ? 'justify-start' : 'justify-end'} animate-slide-down`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  m.senderRole === UserRole.ADMIN 
                    ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100'
                }`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <div className={`text-[9px] mt-2 font-medium opacity-50 ${m.senderRole === UserRole.ADMIN ? 'text-slate-400' : 'text-indigo-100'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 bg-white">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={replyText} 
                onChange={e => setReplyText(e.target.value)} 
                placeholder="Type your message to the developer..." 
                className="flex-1 px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 ring-indigo-500 outline-none transition text-sm shadow-inner" 
              />
              <button 
                type="submit" 
                disabled={sendingMessage || !replyText.trim()} 
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition active:scale-95 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map(o => (
            <div key={o.id} onClick={() => handleSelectOrder(o)} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">📦</div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{o.serviceTitle}</h4>
                    <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(o.status)}`}>{o.status}</span>
                  <span className="text-slate-300 group-hover:text-indigo-400 transition-colors font-bold">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <div className="text-4xl mb-4">📭</div>
              <p className="font-medium">You haven't ordered any services yet.</p>
              {/* Link component usage corrected by adding import above */}
              <Link to="/services" className="text-indigo-600 font-bold mt-2 inline-block">Browse Services</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
