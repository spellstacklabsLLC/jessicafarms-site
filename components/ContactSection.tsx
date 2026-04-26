
import React, { useState } from 'react';
import { getEnvVar } from '../env';

const ContactSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Hi Jessica! I had a quick question about the farm...');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; message?: string } = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!message || message.length < 5) newErrors.message = "Message is a bit too short!";
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
          _subject: 'New Farm Inquiry from JessicaFarms.com'
        }),
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
        setMessage('Hi Jessica! I had a quick question about the farm...');
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT SIDE: INFO */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-serif-modern font-black italic text-forest leading-none">
              Get in <br/> Touch.
            </h2>
            <p className="text-xl text-stone-500 font-serif-modern italic leading-relaxed max-w-md">
              Whether you're looking for honey, koi, or just want to say hi, we'd love to hear from you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="group flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border-2 border-forest/5 shadow-sm hover:border-honey transition-all">
              <div className="w-16 h-16 bg-honey/10 rounded-2xl flex items-center justify-center p-4 group-hover:scale-110 transition-transform">
                <img src="/assets/phone-icon.png" alt="Phone" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Call or Text</p>
                <a href="tel:3309620989" className="text-3xl font-black text-forest hover:text-honey transition-colors tracking-tight">
                  330.962.0989
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border-2 border-forest/5 shadow-sm">
              <div className="w-16 h-16 bg-forest/5 rounded-2xl flex items-center justify-center p-4">
                <img src="/assets/location-icon.png" alt="Location" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Our Location</p>
                <p className="text-xl font-serif-modern font-black italic text-forest">
                  Norton, Ohio
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 opacity-40">
            <div className="flex gap-4 grayscale h-10 items-center">
              <img src="/assets/honey-icon.png" alt="Honey" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              <img src="/assets/logo.png" alt="Bee" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              <img src="/assets/wheat-icon.png" alt="Wheat" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border-2 border-forest/5 relative overflow-hidden">
          {status === 'sent' ? (
            <div className="text-center py-20 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-32 h-32 mx-auto animate-bounce">
                <img src="/assets/envelope.png" alt="Envelope" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
              <h2 className="text-4xl font-serif-modern font-black italic text-forest">Message Sent!</h2>
              <p className="text-stone-500 font-serif-modern italic">Jessica will get back to you soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-[10px] font-black uppercase tracking-widest text-honey border-b border-honey"
              >
                Send another?
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forest border-b border-forest/10 pb-2 mb-6">Send us a Note</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Your Email</label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className={`w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 outline-none transition-all text-sm font-medium ${errors.email ? 'border-red-300' : 'border-transparent focus:border-honey focus:bg-white'}`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase italic px-2">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`w-full px-6 py-4 rounded-2xl bg-stone-50 border-2 outline-none transition-all text-sm font-serif-modern italic resize-none ${errors.message ? 'border-red-300' : 'border-transparent focus:border-honey focus:bg-white'}`}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase italic px-2">{errors.message}</p>}
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={status === 'sending'}
                      type="submit" 
                      className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl transition-all
                        ${status === 'sending' ? 'bg-stone-300 cursor-not-allowed' : 'bg-forest hover:bg-forest/90 hover:-translate-y-1 active:scale-95'}`}
                    >
                      {status === 'sending' ? 'Sealing Envelope...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <p className="text-[10px] text-center text-red-500 font-black uppercase">
                  Could not reach the farm server. Try calling!
                </p>
              )}

              <p className="text-center text-[9px] text-stone-300 uppercase tracking-widest font-typewriter leading-relaxed">
                Messages go directly to Jessica's inbox <br/> in Norton, Ohio.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactSection;
