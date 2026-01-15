
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../services/db';
import { Service, ServiceInquiry } from '../types';
import { LocationContext } from '../App';
import { convertPrice } from '../services/location';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const geo = useContext(LocationContext);
  
  // Inquiry form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check for logged in user to auto-fill
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('devport_session_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setForm(f => ({ ...f, name: parsed.name, email: parsed.email }));
    }

    const fetchServices = async () => {
      try {
        const data = await db.getServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setSending(true);
    try {
      const inquiry: ServiceInquiry = {
        id: Math.random().toString(36).substr(2, 9),
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        clientName: form.name,
        clientEmail: form.email,
        clientId: user?.id,
        message: form.message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await db.addServiceInquiry(inquiry);
      setSuccess(true);
      setForm({ name: user?.name || '', email: user?.email || '', message: '' });
      setTimeout(() => {
        setSuccess(false);
        setSelectedService(null);
      }, 3000);
    } catch (err: any) {
      alert(`Failed to send inquiry: ${err.message || "Unknown error"}.`);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-indigo-600">Loading Professional Services...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Quotes Available</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mb-4">Precision Engineering.</h1>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Scalable solutions tailored to your unique business logic, delivered by a certified B.Sc Graduate.
          </p>
          
          {geo && (
            <div className={`mt-8 p-4 border rounded-2xl inline-flex items-center gap-3 animate-slide-down ${geo.countryCode === 'BD' ? 'bg-green-50 border-green-100' : 'bg-indigo-50 border-indigo-100'}`}>
              <span className="text-xl">{geo.countryCode === 'BD' ? '🇧🇩' : '📍'}</span>
              <p className={`text-sm font-bold ${geo.countryCode === 'BD' ? 'text-green-800' : 'text-indigo-700'}`}>
                Detected: <span className="underline">{geo.country}</span>. 
                {geo.currency !== 'USD' ? ` Showing local prices in ${geo.currency} (${geo.currencySymbol}).` : ' Prices shown in USD.'}
              </p>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => {
            const localPrice = geo && geo.currency !== 'USD' 
              ? convertPrice(service.price, geo.exchangeRate, geo.currencySymbol) 
              : null;

            return (
              <div key={service.id} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:rotate-6 transition-transform relative z-10">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <div className="mb-10 flex-1">
                  <div className="flex flex-col gap-1 mb-6">
                    <span className="text-indigo-600 font-black text-3xl">{service.price}</span>
                    {localPrice && (
                      <div className={`mt-2 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl w-fit ${geo?.countryCode === 'BD' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                        <span className="opacity-70">Estimated:</span> 
                        <span className="text-base">{localPrice}</span>
                        <span className="text-[10px] opacity-60 uppercase tracking-tighter">{geo?.currency}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {service.features.map(f => (
                      <div key={f} className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                        <div className="w-5 h-5 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                          <svg className="w-3 h-3 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedService(service)}
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition shadow-xl shadow-slate-100 active:scale-95"
                >
                  Request Consultation
                </button>
              </div>
            );
          })}
        </div>

        {/* Inquiry Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden relative animate-slide-down">
              <button onClick={() => setSelectedService(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-12">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-[32px] flex items-center justify-center text-green-600 text-5xl mx-auto mb-8 animate-bounce">✓</div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">Slot Reserved!</h3>
                    <p className="text-slate-500 text-lg">I have received your inquiry for <b>{selectedService.title}</b>. Checking availability...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-3xl font-black text-slate-900">Hire for {selectedService.title}</h3>
                      {geo?.countryCode === 'BD' && (
                        <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-lg uppercase">BD Priority Support</span>
                      )}
                    </div>
                    <p className="text-slate-400 font-medium mb-10 uppercase tracking-widest text-[10px]">Direct Channel to Developer</p>
                    
                    <form onSubmit={handleOrder} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Your Name</label>
                          <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition shadow-inner" placeholder="Eman Haque" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Email</label>
                          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition shadow-inner" placeholder="client@corp.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Project Logic & Scope</label>
                        <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-2 ring-transparent focus:ring-indigo-600/20 outline-none transition shadow-inner" placeholder="Brief me on the requirements..." />
                      </div>
                      <button type="submit" disabled={sending} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-2xl shadow-indigo-200">
                        {sending ? 'Transmitting Data...' : 'Confirm Inquiry'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
