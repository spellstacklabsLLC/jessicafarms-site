
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getEnvVar } from '../env';

interface InquiryModalProps {
  product: Product | null;
  onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<{email?: string; message?: string}>({});

  useEffect(() => {
    if (product) {
      setMessage(`Hi Jessica! I'm interested in checking the current stock for ${product.name}. Please let me know if they are available for pickup in Norton.`);
    }
  }, [product]);

  const validate = () => {
    const newErrors: {email?: string; message?: string} = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!message || message.length < 10) newErrors.message = "Message must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    
    try {
      // Formspree submission
      const formspreeId = getEnvVar('VITE_FORMSPREE_ID') || 'your_formspree_id';
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          product: product ? product.name : 'General',
          _subject: `Koi Stock Inquiry: ${product?.name || 'General'}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry.');
      }

      setStatus('sent');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setEmail('');
      }, 3500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (!product && status !== 'sent' && status !== 'error') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-forest/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-cream w-full max-w-lg rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white border border-forest/5 flex items-center justify-center text-forest/40 hover:text-forest hover:rotate-90 transition-all z-10"
        >
          ✕
        </button>

        <div className="p-10 md:p-14 space-y-8">
          {status === 'sent' ? (
            <div className="text-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-32 h-32 mx-auto animate-bounce">
                <img src="/assets/pigeon.png" alt="Pigeon" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <h2 className="text-4xl font-serif-modern font-black italic text-forest">Note Sent!</h2>
              <p className="text-stone-500 font-serif-modern italic">Jessica will get back to you at <strong>{email}</strong> soon.</p>
              <div className="w-16 h-1 bg-honey mx-auto rounded-full"></div>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-20 space-y-6 animate-in shake duration-500">
              <div className="w-32 h-32 mx-auto">
                <img src="/assets/storm.png" alt="Storm" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <h2 className="text-4xl font-serif-modern font-black italic text-red-800">Mail Clogged</h2>
              <p className="text-stone-500 font-serif-modern italic">We couldn't connect to the farm server. Please try again or email directly.</p>
              <p className="text-[10px] font-black uppercase text-stone-300">jessica@jessicafarms.com</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-honey">
                  <img src="/assets/koi-icon.png" alt="Koi" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Koi Stock Inquiry</span>
                </div>
                <h2 className="text-4xl font-serif-modern font-black italic text-forest leading-tight">
                  Message <br/> the Farm
                </h2>
              </div>

              <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Your Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-6 py-4 rounded-2xl bg-white border-2 outline-none transition-all text-sm font-medium ${errors.email ? 'border-red-300 bg-red-50' : 'border-forest/5 focus:border-honey'}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase italic">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Your Message</label>
                  <textarea 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full px-6 py-4 rounded-2xl bg-white border-2 outline-none transition-all text-sm font-serif-modern italic resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-forest/5 focus:border-honey'}`}
                  />
                  {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase italic">{errors.message}</p>}
                </div>

                <div className="pt-4">
                  <button 
                    disabled={status === 'sending'}
                    className={`btn-honey w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-4 transition-all shadow-xl
                    ${status === 'sending' ? 'opacity-70 scale-95' : 'hover:-translate-y-1 hover:shadow-2xl'}`}
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sealing Envelope...
                      </>
                    ) : 'Send Message to Jessica'}
                  </button>
                </div>
              </form>

              <div className="pt-4 flex items-center justify-center gap-4 border-t border-forest/5 text-[9px] text-stone-300 uppercase tracking-widest font-typewriter">
                <span>Jessica@jessicafarms.com</span>
                <span className="opacity-50">•</span>
                <span>Norton, Ohio</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
