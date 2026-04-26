
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onSuccess: () => void;
  onBack: () => void;
}

interface FormState {
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const SHIPPING_FEE = 10.00;

const Checkout: React.FC<CheckoutProps> = ({ items, onSuccess, onBack }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const subtotal = items.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0);
  const total = subtotal + SHIPPING_FEE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zip') {
      const formatted = value.replace(/\D/g, '').substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // PROD LOGIC: Call your backend to create a Stripe Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          shippingAddress: formData
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Could not reach the farm server.');
      }

      const { url } = await response.json();
      
      // Redirect user to the secure Stripe-hosted checkout page
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 py-10">
      {/* LEFT COL: SUMMARY */}
      <div className="lg:col-span-2 space-y-8">
        <button onClick={onBack} className="text-forest/60 font-black uppercase text-[10px] tracking-widest hover:text-forest flex items-center gap-2 transition-colors">
          ← Back to Shop
        </button>
        <h2 className="text-4xl font-serif-modern font-black italic text-forest">Order Summary</h2>
        <div className="space-y-4 bg-white/40 p-6 rounded-[2rem] border border-forest/5 shadow-sm">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center py-4 border-b border-forest/5 last:border-0">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                  <span className="absolute -top-2 -right-2 bg-forest text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {item.quantity}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-forest uppercase tracking-tight">{item.name}</h4>
                  <p className="text-xs text-stone-400 font-serif-modern italic">${item.priceNumber.toFixed(2)} each</p>
                </div>
              </div>
              <span className="font-black text-sm text-forest">${(item.priceNumber * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="pt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-serif-modern italic text-stone-500">Subtotal</span>
              <span className="font-black text-forest">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-serif-modern italic text-stone-500">Flat Rate Shipping</span>
              <span className="font-black text-forest">${SHIPPING_FEE.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-forest/10 flex justify-between items-center text-2xl">
            <span className="font-serif-modern italic text-stone-500">Total Due</span>
            <span className="font-black text-forest">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* RIGHT COL: FORM */}
      <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-forest/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 flex gap-3">
          <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">VISA</div>
          <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">MC</div>
          <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">AMEX</div>
        </div>
        
        <form onSubmit={handleStripeCheckout} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* SHIPPING ADDRESS */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forest border-b border-forest/10 pb-2">Shipping Information</h3>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="farmer@example.com" className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-all text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Street Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Farm Lane" className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:border-forest outline-none transition-all text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Norton" className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:border-forest outline-none transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="OH" maxLength={2} className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:border-forest outline-none transition-all text-sm uppercase" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Zip Code</label>
                <input required type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="44203" pattern="\d{5}" className="w-full px-4 py-3 rounded-xl border border-stone-100 focus:border-forest outline-none transition-all text-sm" />
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-forest border-b border-forest/10 pb-2">Secure Checkout</h3>
              
              <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <p className="text-[10px] text-stone-500 font-serif-modern italic leading-relaxed">
                  Clicking "Proceed to Stripe" will redirect you to a secure hosted payment page to enter your sensitive card details.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <p className="font-bold mb-1">Payment Error:</p>
                  <p>{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  disabled={processing}
                  type="submit" 
                  className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl
                    ${processing ? 'bg-stone-300 cursor-not-allowed scale-95' : 'bg-forest hover:bg-forest/90 hover:-translate-y-1 active:scale-95'}`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to Stripe...
                    </span>
                  ) : `Proceed to Stripe ($${total.toFixed(2)})`}
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-stone-100 flex flex-col items-center gap-2">
            <p className="text-[9px] text-center text-stone-300 font-typewriter uppercase tracking-widest max-w-xs leading-relaxed">
              Your transaction is secure and encrypted. We use Stripe to process payments safely.
            </p>
            <div className="flex gap-4 opacity-20 grayscale h-8 items-center">
              <img src="/assets/secure-lock.png" alt="Secure" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              <img src="/assets/secure-shield.png" alt="Shield" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              <img src="/assets/secure-check.png" alt="Check" className="h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
