import React, { useState, useEffect } from 'react';
import { Minus, Plus, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface WholesaleOrderProps {
  onBackToSite?: () => void;
}

const JARS_PER_CASE = 20;
const PRICE_PER_CASE = 139.80; // 20 * $6.99

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export const WholesaleOrder: React.FC<WholesaleOrderProps> = ({ onBackToSite }) => {
  const [cases, setCases] = useState<number>(1);
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [aptSuite, setAptSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('OH');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    cases?: string | null;
    jars?: string | null;
    business?: string | null;
  }>({});

  const totalJars = cases * JARS_PER_CASE;
  const total = cases * PRICE_PER_CASE;

  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setOrderSuccess(true);
      setSuccessDetails({
        cases: params.get('cases'),
        jars: params.get('jars'),
        business: params.get('business'),
      });
      window.history.replaceState({}, '', window.location.pathname + '?success=true');
    }

    if (params.get('canceled') === 'true') {
      setOrderCanceled(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      const tag = document.querySelector('meta[name="robots"]');
      if (tag) {
        tag.removeAttribute('content');
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!businessName.trim()) {
      setErrorMessage('Business name is required.');
      return;
    }
    if (!contactName.trim()) {
      setErrorMessage('Contact person name is required.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('A valid email address is required for your Stripe invoice.');
      return;
    }
    if (!street.trim()) {
      setErrorMessage('Street address is required for shipping.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('City is required for shipping.');
      return;
    }
    if (!state.trim()) {
      setErrorMessage('State is required for shipping.');
      return;
    }
    if (!zip.trim() || zip.trim().length < 5) {
      setErrorMessage('A valid 5-digit ZIP code is required.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/create-wholesale-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cases,
          businessName: businessName.trim(),
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          taxId: taxId.trim(),
          shippingAddress: {
            street: street.trim(),
            aptSuite: aptSuite.trim(),
            city: city.trim(),
            state: state.trim(),
            zip: zip.trim(),
          },
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize checkout.');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Checkout error. Please try again.');
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setOrderSuccess(false);
    setOrderCanceled(false);
    setCases(1);
    setBusinessName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setStreet('');
    setAptSuite('');
    setCity('');
    setState('OH');
    setZip('');
    setNotes('');
    setErrorMessage(null);
    window.history.replaceState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-lg text-center space-y-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Order Confirmed</h1>
            <p className="text-sm text-stone-500 mt-1">
              {successDetails.business ? `Thank you, ${successDetails.business}.` : 'Thank you for your order.'} A receipt was sent to your email.
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 text-xs space-y-2 text-stone-700 border border-stone-200">
            <div className="flex justify-between">
              <span className="text-stone-500">Item</span>
              <span className="font-semibold">Hot Honey (20 Jars / Case)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Quantity</span>
              <span className="font-semibold">{successDetails.cases || '1'} Cases ({successDetails.jars || '20'} Jars)</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 bg-[#1a4332] hover:bg-[#20533e] text-white font-semibold text-sm rounded-xl transition-colors"
          >
            New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-16">
      {/* Clean Minimal Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#1a4332]">Jessica Farms</span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">Wholesale</span>
          </div>

          {onBackToSite && (
            <button
              onClick={onBackToSite}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a4332]">Wholesale Case Order</h1>
          <p className="text-sm text-stone-500 mt-1">Direct case orders for retail stockists.</p>
        </div>

        {orderCanceled && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Order checkout canceled.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-6 items-start">
          {/* Main Info */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Product & Quantity Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/hot-honey.jpg"
                  alt="Hot Honey"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'assets/hothoneypromo2.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-stone-900 text-base">Hot Honey (12oz)</h2>
                  <p className="text-xs text-stone-500">20 jars per case · $6.99/jar</p>
                  <p className="text-sm font-semibold text-[#1a4332] mt-0.5">$139.80 / case</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <span className="text-sm font-medium text-stone-700">Quantity (Cases)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCases((prev) => Math.max(prev - 1, 1))}
                    disabled={cases <= 1}
                    className="w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-100 active:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-base text-stone-900">{cases}</span>
                  <button
                    type="button"
                    onClick={() => setCases((prev) => Math.min(prev + 1, 100))}
                    className="w-9 h-9 rounded-lg bg-[#1a4332] hover:bg-[#20533e] active:bg-[#16382a] text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Business & Contact */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Contact Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Store or Market name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Buyer or Manager"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@business.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Shipping Address</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Main St"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Suite / Unit (Optional)</label>
                  <input
                    type="text"
                    value={aptSuite}
                    onChange={(e) => setAptSuite(e.target.value)}
                    placeholder="Suite, Dock, or Unit"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-stone-600 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-stone-600 mb-1">State *</label>
                    <select
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none bg-white font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select State</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-stone-600 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="44281"
                      className="w-full px-3 py-2.5 text-center font-bold rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Receiving hours or special instructions"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm focus:border-[#1a4332] focus:ring-1 focus:ring-[#1a4332] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-5 md:sticky md:top-20 space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Summary</h3>

              <div className="space-y-2.5 text-sm text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>{cases} {cases === 1 ? 'Case' : 'Cases'} ({totalJars} jars)</span>
                  <span className="font-semibold text-stone-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-stone-900 text-base">Total</span>
                <span className="font-bold text-2xl text-[#1a4332]">${total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#1a4332] hover:bg-[#20533e] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Checkout (${total.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default WholesaleOrder;
