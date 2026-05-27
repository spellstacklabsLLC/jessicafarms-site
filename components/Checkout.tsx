import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onSuccess: () => void;
  onBack: () => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onSuccess, onBack, onUpdateQuantity }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBoxes = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0);
  const SHIPPING_FEE = 0.00;
  const total = subtotal + SHIPPING_FEE;
  const hasItems = totalBoxes > 0;

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
          items: items.map(i => ({
            id: i.id,
            quantity: i.quantity,
            name: i.name,
            description: i.description
          })),
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
    <div className="max-w-xl mx-auto py-10 px-4 font-sans antialiased text-stone-800">
      {/* Back button above card */}
      <div className="mb-6">
        <button onClick={onBack} className="text-forest/60 font-black uppercase text-[10px] tracking-widest hover:text-forest flex items-center gap-2 transition-colors">
          ← Back to Shop
        </button>
      </div>

      {/* Main Single Card Checkout Container */}
      <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-forest/10 relative overflow-hidden">
        {/* Abstract vintage lines or secure labels */}
        <div className="absolute top-0 right-0 p-6 flex gap-2">
          {/* <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">VISA</div>
          <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">MC</div>
          <div className="w-10 h-6 bg-stone-50 rounded-md border border-stone-100 flex items-center justify-center text-[8px] font-black opacity-40">AMEX</div> */}
        </div>

        <h2 className="text-2xl md:text-3xl font-serif-modern font-black italic text-forest uppercase tracking-tight mb-6">Order Summary</h2>

        <form onSubmit={handleStripeCheckout} className="space-y-6">
          {/* Cart items list */}
          <div className="space-y-4 bg-stone-50/50 p-4 md:p-5 rounded-[2rem] border border-forest/5 shadow-inner">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-3.5 border-b border-forest/5 last:border-0">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-xl shadow-sm bg-amber-500/10 border border-honey/10" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23d9a520" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-forest uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] text-amber-600 font-sans uppercase tracking-wider font-extrabold mt-0.5">
                      3-Jar Gift Box
                    </p>
                    
                    {/* Quantity adjustments */}
                    {onUpdateQuantity && (
                      <div className="flex items-center gap-2 mt-1.5 bg-stone-100 rounded-lg p-0.5 w-fit">
                        <button 
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-stone-200 text-stone-600 font-black flex items-center justify-center text-xs transition-colors shadow-sm select-none"
                        >
                          −
                        </button>
                        <span className="text-xs font-black px-1.5 min-w-4 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded bg-white hover:bg-stone-200 text-stone-600 font-black flex items-center justify-center text-xs transition-colors shadow-sm select-none"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[9px] font-black uppercase text-stone-300 block tracking-widest leading-none">Selected</span>
                  <span className="font-serif-modern text-xs text-stone-600 font-black italic block mt-1">{item.quantity} Box{item.quantity > 1 ? 'es' : ''}</span>
                </div>
              </div>
            ))}

            {/* Validation Banner */}
            <div className="pt-1">
              {totalBoxes === 0 ? (
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-[1.25rem] border border-amber-200/55 text-center font-black uppercase tracking-wider">
                  🛒 Your cart is empty. Please back up to select some honey!
                </div>
              ) : (
                <div className="p-3 bg-green-500/10 text-green-800 text-xs rounded-[1.25rem] border border-green-500/20 text-center font-black uppercase tracking-widest text-[9.5px]">
                  🎉 Box Complete! {totalBoxes} x 3-Jar Box{totalBoxes > 1 ? 'es' : ''} successfully packed.
                </div>
              )}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-2 px-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-serif-modern italic text-stone-500">Subtotal ({totalBoxes} x 3-Jar Box{totalBoxes > 1 ? 'es' : ''})</span>
              <span className="font-black text-forest">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-serif-modern italic text-stone-500">Shipping</span>
              <span className="font-black text-honey uppercase tracking-wider text-xs bg-honey/10 px-2.5 py-0.5 rounded-md">FREE</span>
            </div>

            <div className="pt-4 mt-2 border-t-2 border-forest/10 flex justify-between items-center text-2xl">
              <span className="font-serif-modern italic text-stone-500">Total Due</span>
              <span className="font-black text-forest">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure details reminder */}
          <div className="p-4 md:p-5 bg-stone-50/90 rounded-2xl border border-stone-300 shadow-sm">
            <div className="flex gap-3 items-center">
              <span className="text-lg select-none filter drop-shadow bg-stone-100 p-1.5 rounded-lg flex items-center justify-center">🛡️</span>
              <p className="text-xs text-stone-700 font-serif-modern italic leading-relaxed text-left font-medium">
                Shipping address, phone number, and payment details are collected securely by Stripe on the next step.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
              <p className="font-bold mb-1">Payment Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <div className="pt-2">
            <button 
              disabled={processing || !hasItems}
              type="submit" 
              className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl
                ${(processing || !hasItems) ? 'bg-stone-300 cursor-not-allowed scale-95' : 'bg-forest hover:bg-forest/90 hover:-translate-y-1 active:scale-95'}`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting to Stripe...
                </span>
              ) : !hasItems ? (
                "Cart is Empty"
              ) : (
                `Proceed to Stripe ($${total.toFixed(2)})`
              )}
            </button>
          </div>

          {/* Boutique Small-Batch Processing Notice */}
          <div className="text-center pt-3 pb-1">
          <p className="text-[13px] md:text-[14px] text-stone-600 font-serif-modern leading-relaxed tracking-wide">              ✦ Packed fresh in small batches. Ships within 7–10 business days. ✦
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col items-center gap-2">
            <p className="text-[10px] text-center text-stone-500 font-typewriter uppercase tracking-widest max-w-sm leading-relaxed font-semibold">
              {/* Your transaction is secure and encrypted. We trust Stripe to process payments safely. */}
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
