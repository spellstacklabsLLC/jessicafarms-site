import React, { useState, useEffect } from 'react';
import {
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Package,
  Truck,
  Sparkles,
  Store,
  ArrowDown,
  ExternalLink
} from 'lucide-react';

interface WholesaleOrderProps {
  onBackToSite?: () => void;
}

const BOTTLES_PER_CASE = 20;
const PRICE_PER_CASE = 160.00; // $160 for case of 20 bottles ($8.00/bottle)
const PRICE_PER_PAIL = 280.00; // $280 for 42 lb food service pail

export const WholesaleOrder: React.FC<WholesaleOrderProps> = ({ onBackToSite }) => {
  const [cases, setCases] = useState<number>(0);
  const [pails, setPails] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const [flyerError, setFlyerError] = useState(false);
  const [pailError, setPailError] = useState(false);
  const [bottleCaseError, setBottleCaseError] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    cases?: string | null;
    pails?: string | null;
  }>({});

  const totalBottles = cases * BOTTLES_PER_CASE;
  const casesSubtotal = cases * PRICE_PER_CASE;
  const pailsSubtotal = pails * PRICE_PER_PAIL;
  const grandTotal = casesSubtotal + pailsSubtotal;
  const totalItemsCount = cases + pails;

  useEffect(() => {
    // Keep unlisted wholesale page out of search crawler indices
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
        pails: params.get('pails'),
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

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItemsCount < 1) {
      setErrorMessage('Please add at least 1 case or 1 food service pail to proceed.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/create-wholesale-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cases,
          pails,
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
        throw new Error('No checkout URL received from server.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Checkout error. Please try again.');
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setOrderSuccess(false);
    setOrderCanceled(false);
    setCases(0);
    setPails(0);
    setErrorMessage(null);
    window.history.replaceState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderSuccess) {
    const successCases = Number(successDetails.cases || 0);
    const successPails = Number(successDetails.pails || 0);

    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 py-16 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-forest/10 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#d9a520]">Jessica Farms Apiary</span>
            <h1 className="text-2xl sm:text-3xl font-serif-modern font-black italic text-forest mt-1">Wholesale Order Confirmed</h1>
            <p className="text-xs text-stone-500 mt-2">
              Thank you for your partnership! A receipt, order invoice, and tracking confirmation have been sent to your email.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 text-xs space-y-2.5 text-stone-700 border border-stone-200/80 text-left">
            <div className="font-bold text-forest uppercase tracking-wider text-[10px] border-b border-stone-200 pb-1.5">
              Order Summary
            </div>

            {successCases > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Hot Honey Case (20 Bottles)</span>
                <span className="font-bold text-stone-900">{successCases} Case{successCases > 1 ? 's' : ''} (${(successCases * PRICE_PER_CASE).toFixed(2)})</span>
              </div>
            )}

            {successPails > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-stone-600">42 lb Food Service Pail</span>
                <span className="font-bold text-stone-900">{successPails} Pail{successPails > 1 ? 's' : ''} (${(successPails * PRICE_PER_PAIL).toFixed(2)})</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-stone-200">
              <span className="text-stone-600 font-medium">Shipping</span>
              <span className="font-bold text-emerald-700 uppercase tracking-wide text-[11px]">Free Shipping</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-forest hover:bg-forest/90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Place Another Order
            </button>
            {onBackToSite && (
              <button
                onClick={onBackToSite}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors cursor-pointer"
              >
                Return to Jessica Farms
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif-modern text-xl font-black italic text-forest">Jessica Farms</span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-black uppercase tracking-widest text-[#d9a520]">Wholesale</span>
          </div>

          {onBackToSite && (
            <button
              onClick={onBackToSite}
              className="text-xs font-black uppercase tracking-wider text-forest/70 hover:text-forest flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Site
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-10 px-4">
        {/* Title & Free Shipping Highlight Banner */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d9a520] block">
                Direct Apiary Wholesale
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif-modern font-black italic text-forest uppercase tracking-tight">
                Wholesale Portal
              </h1>
              <p className="text-sm text-stone-600 mt-1 font-serif-modern italic">
                Direct pricing for retail stockists, specialty grocers, pizzerias & restaurant kitchens.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-4 py-2.5 rounded-2xl shadow-sm self-start sm:self-auto">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-700 leading-none">Complimentary</span>
                <span className="text-xs font-bold text-emerald-900">Free Shipping on All Wholesale</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hot Honey Panoramic Hero Promo Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#d9a520] bg-[#1c130d] shadow-xl mb-8 group">
          {/* Main Panoramic Graphic */}
          <div className="relative w-full overflow-hidden bg-[#1c130d]">
            <img
              src="/assets/hothoney-banner.png"
              alt="Jessica Farms Hot Honey — Sweet. Heat. From Our Hives to Your Kitchen."
              className="w-full h-auto block object-contain transition-transform duration-700 group-hover:scale-[1.008]"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/HHpromo22.png';
              }}
            />
          </div>

          {/* Integrated Quick-Action Bar */}
          <div className="bg-[#170f0a] border-t border-[#d9a520]/30 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                <Sparkles className="w-3 h-3 text-[#d9a520]" /> Norton, Ohio Apiary
              </span>
              <p className="text-xs text-stone-300 font-serif-modern italic hidden md:block">
                {/* Pure wildflower honey, habanero & ghost peppers · Cases of 20 & 42 lb foodservice pails */}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free Shipping
              </span>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('wholesale-products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d9a520] hover:bg-[#b8860b] text-[#1c130d] font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                <span>Shop Wholesale</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {orderCanceled && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Checkout was canceled. Adjust your quantities and proceed whenever you are ready.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form id="wholesale-products" onSubmit={handleStripeCheckout} className="space-y-6">
          {/* PRODUCT OPTION 1: Case of 20 Bottles */}
          <div className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-md ${cases > 0 ? 'border-forest/20 shadow-lg ring-1 ring-forest/10' : 'border-stone-200 opacity-80'}`}>
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-amber-200 shadow-sm shrink-0 bg-amber-50 flex items-center justify-center relative">
                {bottleCaseError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-amber-50 text-center text-amber-800">
                    <Package className="w-7 h-7 text-amber-700 mb-1" />
                    <span className="text-[9px] font-bold">20 BOTTLES</span>
                    <span className="text-[8px] text-amber-700">Case Pack</span>
                  </div>
                ) : (
                  <img
                  src="/assets/hothoneypromo2.png"
                  alt="Jessica Farms Hot Honey — Case of 20 Bottles"
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                  onError={() => setBottleCaseError(true)}
                />
                )}
                <div className="absolute top-0 right-0 bg-[#d9a520] text-forest text-[8px] font-black px-1.5 py-0.5 rounded-bl shadow-xs">
                  20 PK
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    Case Pack (20 Bottles)
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Free Shipping
                  </span>
                </div>

                <h2 className="font-serif-modern font-black text-xl text-forest leading-snug">
                  Jessica Farms Hot Honey — Case of 20
                </h2>

                <p className="text-xs text-stone-500 font-serif-modern italic mt-0.5">
                  20 individual 12 oz squeeze bottles · Ideal for retail shelves, gift shops & kitchen drizzle stations.
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-forest font-serif-modern">${PRICE_PER_CASE.toFixed(0)}</span>
                  <span className="text-xs font-semibold text-stone-500">per case</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    $8.00 / bottle
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <span className="sm:hidden text-xs font-bold text-stone-600">Cases:</span>
                <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-2xl border border-stone-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setCases((prev) => Math.max(prev - 1, 0))}
                    disabled={cases <= 0}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-stone-200 active:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-base text-forest">{cases}</span>
                  <button
                    type="button"
                    onClick={() => setCases((prev) => Math.min(prev + 1, 200))}
                    className="w-9 h-9 rounded-xl bg-forest hover:bg-forest/90 active:bg-forest text-white flex items-center justify-center font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {cases > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
                <span>{cases} case{cases > 1 ? 's' : ''} ({totalBottles} bottles total)</span>
                <span className="font-bold text-stone-800">${casesSubtotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* PRODUCT OPTION 2: 42 lb Food Service Pail using /assets/foodpail.png */}
          <div className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all shadow-md ${pails > 0 ? 'border-forest/20 shadow-lg ring-1 ring-forest/10' : 'border-stone-200'}`}>
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-amber-200 shadow-sm shrink-0 bg-stone-50 flex items-center justify-center relative">
                {pailError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-amber-50 text-center text-amber-800">
                    <Package className="w-7 h-7 text-amber-700 mb-1" />
                    <span className="text-[9px] font-bold">42 LB PAIL</span>
                    <span className="text-[8px] text-amber-700">Food Service</span>
                  </div>
                ) : (
                  <img
                    src="/assets/foodpail.png"
                    alt="Jessica Farms 42-Pound Hot Honey Food Service Pail"
                    className="w-full h-full object-contain p-1"
                    loading="lazy"
                    onError={() => setPailError(true)}
                  />
                )}
                <div className="absolute top-0 right-0 bg-[#d9a520] text-forest text-[8px] font-black px-1.5 py-0.5 rounded-bl shadow-xs">
                  42 LB
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Store className="w-3 h-3 text-amber-700" /> Restaurant & Food Service
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Free Shipping
                  </span>
                </div>

                <h2 className="font-serif-modern font-black text-xl text-forest leading-snug">
                  42-Pound Food Service Pail
                </h2>

                <p className="text-xs text-stone-500 font-serif-modern italic mt-0.5">
                  Heavy-duty 42 lb food-grade bucket with airtight resealable lid · Perfect for pizzerias, drizzle stations, bakeries & commercial kitchens.
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-forest font-serif-modern">${PRICE_PER_PAIL.toFixed(0)}</span>
                  <span className="text-xs font-semibold text-stone-500">per 42 lb pail</span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ~ $6.67 / lb
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <span className="sm:hidden text-xs font-bold text-stone-600">Pails:</span>
                <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-2xl border border-stone-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setPails((prev) => Math.max(prev - 1, 0))}
                    disabled={pails <= 0}
                    className="w-9 h-9 rounded-xl bg-white hover:bg-stone-200 active:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-stone-700 font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-base text-forest">{pails}</span>
                  <button
                    type="button"
                    onClick={() => setPails((prev) => Math.min(prev + 1, 50))}
                    className="w-9 h-9 rounded-xl bg-forest hover:bg-forest/90 active:bg-forest text-white flex items-center justify-center font-black transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {pails > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
                <span>{pails} pail{pails > 1 ? 's' : ''} ({pails * 42} lbs total)</span>
                <span className="font-bold text-stone-800">${pailsSubtotal.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Pricing & Checkout Summary Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest/15 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-serif-modern text-lg font-black italic text-forest">Order Breakdown</span>
              <span className="text-xs font-semibold text-stone-500">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected</span>
            </div>

            <div className="space-y-2.5 text-xs text-stone-600">
              {cases > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-serif-modern italic text-stone-600">
                    Hot Honey Case (20 Bottles) × {cases}
                  </span>
                  <span className="font-bold text-stone-900">${casesSubtotal.toFixed(2)}</span>
                </div>
              )}

              {pails > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-serif-modern italic text-stone-600">
                    42 lb Food Service Pail × {pails}
                  </span>
                  <span className="font-bold text-stone-900">${pailsSubtotal.toFixed(2)}</span>
                </div>
              )}

              {totalItemsCount === 0 && (
                <div className="text-stone-400 italic font-serif-modern py-1">
                  Select at least one case or pail above to view subtotal.
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                <span className="font-serif-modern italic text-stone-600 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Standard Shipping
                </span>
                <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  FREE SHIPPING
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-forest/10">
                <div>
                  <span className="font-serif-modern text-lg font-black italic text-forest block">Total Due</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Includes Free Shipping</span>
                </div>
                <span className="font-black text-3xl text-forest">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Seamless Stripe Address & Payment Guarantee */}
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 flex items-start gap-3 text-stone-600">
              <ShieldCheck className="w-5 h-5 text-[#d9a520] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-stone-800">
                  Seamless & Secure Checkout on Stripe
                </p>
                <p className="text-[11px] font-serif-modern italic text-stone-500 leading-relaxed">
                  Your contact details, business delivery address, and payment are collected securely via Stripe. Free shipping is automatically applied. No account required.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || totalItemsCount < 1}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-xl flex items-center justify-center gap-2 bg-[#d9a520] hover:bg-[#b8860b] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {totalItemsCount < 1
                      ? 'Select Items to Checkout'
                      : `Proceed to Stripe Checkout • $${grandTotal.toFixed(2)} (Free Shipping)`}
                  </span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-wider pt-1">
              Norton, Ohio Apiary · Direct Small-Batch Hive Harvest · Guaranteed Authentic Raw Honey
            </p>
          </div>
        </form>

        {/* Rebuilt Promotional Flyer Section using /assets/wholesalepromo.png */}
        <section className="mt-14 pt-10 border-t border-stone-200 text-center">
          <div className="max-w-[750px] mx-auto px-2 sm:px-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#d9a520] block mb-1">
              Foodservice & Retail Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-modern font-black italic text-forest uppercase tracking-tight">
              Why Choose Jessica Farms Hot Honey?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-serif-modern italic max-w-xl mx-auto leading-relaxed">
              Handcrafted in Norton, Ohio with pure wildflower honey, habaneros, and ghost peppers. Built for high-volume commercial kitchens and eye-catching retail counters.
            </p>

            {/* Direct, clean, accessible link opening full-resolution graphic in a new tab */}
            <div className="mt-6">
              <a
                href="/assets/wholesalepromo.png"
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[750px] w-full mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d9a520] bg-white shadow-md hover:shadow-xl transition-all duration-300 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a520] focus-visible:ring-offset-2 group text-left cursor-pointer"
                title="Click to view full-size Jessica Farms Hot Honey promotional flyer in new tab"
              >
                {flyerError ? (
                  <div className="p-8 sm:p-12 text-center bg-stone-50 border border-[#d9a520] rounded-2xl sm:rounded-3xl">
                    <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <p className="font-serif-modern text-lg font-bold text-stone-800">
                      Wholesale Promotional Flyer
                    </p>
                    <p className="text-xs text-stone-500 mt-1 mb-4">
                      Unable to preview image inline. Click below to view the graphic directly.
                    </p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                      Open Full Flyer (/assets/wholesalepromo.png)
                    </span>
                  </div>
                ) : (
                  <div>
                    <img
                      src="/assets/wholesalepromo.png"
                      alt="Jessica Farms Hot Honey Wholesale & Foodservice Promotional Guide"
                      className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.008] border-0 outline-none"
                      loading="lazy"
                      onError={() => setFlyerError(true)}
                    />
                    {/* Visual action bar indicating new-tab link */}
                    <div className="bg-[#1c130d] text-white px-4 sm:px-6 py-3 flex items-center justify-between text-xs border-t border-[#d9a520]/30">
                      <div className="flex items-center gap-2 text-amber-200">
                        <ExternalLink className="w-4 h-4 text-[#d9a520] shrink-0" />
                        <span className="font-semibold">Click to open full-resolution flyer in a new tab</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#d9a520] group-hover:text-amber-300 transition-colors">
                        View Full Size ↗
                      </span>
                    </div>
                  </div>
                )}
              </a>
            </div>

            <p className="text-[11px] text-stone-500 mt-3 font-serif-modern italic">
              Click the graphic above to open and examine full-size bottle specs, case breakdowns, and foodservice info in a new tab.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WholesaleOrder;
