
import React, { useState, useEffect, useRef } from 'react';
import { Page, Product, CartItem } from './types';
import { PRODUCTS, INTRO_VIDEO, CONFIG, COMING_SOON_PRODUCTS } from './constants';
import GamesSection from './components/Games';
import Checkout from './components/Checkout';
import InquiryModal from './components/InquiryModal';
import ContactSection from './components/ContactSection';
import Homepage from './components/Homepage';
import { ShoppingCart, ChevronDown, Trash2, Volume2 } from 'lucide-react';

const BeeItem: React.FC<{ scale: number }> = ({ scale }) => {
  const [pos, setPos] = useState({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
  const [angle, setAngle] = useState(0);
  const [speed, setSpeed] = useState(3000);

  useEffect(() => {
    let active = true;
    let timerId: any = null;

    const fly = () => {
      if (!active) return;
      
      const isOffscreen = Math.random() < 0.22;
      let nextX = Math.random() * 80 + 10;
      let nextY = Math.random() * 80 + 10;

      if (isOffscreen) {
        const border = Math.floor(Math.random() * 4);
        if (border === 0) { nextX = -15; nextY = Math.random() * 120 - 10; }
        else if (border === 1) { nextX = 115; nextY = Math.random() * 120 - 10; }
        else if (border === 2) { nextX = Math.random() * 120 - 10; nextY = -15; }
        else { nextX = Math.random() * 120 - 10; nextY = 115; }
      }

      setPos((curr) => {
        const dx = nextX - curr.x;
        const dy = nextY - curr.y;
        const rad = Math.atan2(dy, dx);
        const deg = rad * (180 / Math.PI);
        setAngle(deg);
        return { x: nextX, y: nextY };
      });

      // Quick, organic darting movements (between 1.5s & 3.5s per leg)
      const nextSpeed = Math.random() * 2000 + 1500;
      setSpeed(nextSpeed);

      timerId = setTimeout(fly, nextSpeed);
    };

    const delay = Math.random() * 1500;
    const startTimer = setTimeout(fly, delay);

    return () => {
      active = false;
      clearTimeout(startTimer);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none transition-all ease-in-out select-none"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transitionDuration: `${speed}ms`,
        transform: `rotate(${angle}deg) scale(${scale})`,
        zIndex: scale < 0.75 ? 5 : 12,
      }}
    >
      {/* Layer 1: Medium drift (natural airy hover waves) */}
      <div className="bee-drift">
        {/* Layer 2: High frequency vibration buzz jitter */}
        <div className="bee-buzz">
          <svg width="45" height="35" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            {/* GRADIENTS & GLOW EFFECTS */}
            <defs>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.3" />
              </linearGradient>
              
              <radialGradient id="thoraxGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="70%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>
              
              <linearGradient id="abdomenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="30%" stopColor="#eab308" />
                <stop offset="65%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              
              <radialGradient id="pollenGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>

            {/* JOINTED LEGS */}
            {/* Front leg */}
            <path d="M 28 22 L 26 27 L 22 29" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Middle leg */}
            <path d="M 22 22 L 20 28 L 16 30" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hind leg with bright 3D yellow Pollen Basket (Corbicula) */}
            <g>
              <path d="M 15 22 L 12 29 L 8 31" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <ellipse cx="11" cy="27" rx="3.5" ry="2.5" transform="rotate(-15 11 27)" fill="url(#pollenGrad)" />
            </g>

            {/* ABDOMEN (Slightly tilted down toward the rear, tapered) */}
            {/* Tail stinger */}
            <path d="M 4 18 L 1 19 L 4 20 Z" fill="#000" />
            
            {/* Main Abdomen Body */}
            <ellipse cx="14" cy="19" rx="10.5" ry="7.5" transform="rotate(-5 14 19)" fill="url(#abdomenGrad)" />
            
            {/* Velvet-texture dark honeybee stripes */}
            <path d="M 7 15.5 Q 8 19 8 22.5 C 6.5 22 6 20 5.5 17.5 Z" fill="#1c1917" />
            <path d="M 11 13 Q 12.2 19 11.5 25 C 9.8 24.5 9.3 22 8.8 15 Z" fill="#1c1917" />
            <path d="M 15.5 12 Q 16.7 19 15.5 25.5 C 13.8 25 13.3 22.5 13.3 13.5 Z" fill="#1c1917" />
            <path d="M 20 12.5 Q 20.7 18 19.5 24.5 C 18.2 24 17.7 21.5 17.7 14 Z" fill="#1c1917" />

            {/* THORAX (Fluffy center chest with organic fuzzy edge details) */}
            <ellipse cx="24" cy="18" rx="7" ry="7" fill="url(#thoraxGrad)" />
            <ellipse cx="24" cy="18" rx="6.5" ry="6.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="1,1" strokeOpacity="0.8" />

            {/* HEAD */}
            <ellipse cx="32" cy="18" rx="4.5" ry="5.5" fill="#292524" />
            {/* Glossycompound black eye */}
            <ellipse cx="32.5" cy="16" rx="1.8" ry="2.8" fill="#0c0a09" transform="rotate(10 32.5 16)" />
            {/* Shiny highlight */}
            <circle cx="33.2" cy="14.8" r="0.6" fill="#ffffff" />

            {/* ANTENNAE */}
            <path d="M 34.5 14 Q 38.5 10 37 6" stroke="#0c0a09" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M 35 17 Q 39.2 18 39.5 22.2" stroke="#0c0a09" strokeWidth="0.95" strokeLinecap="round" fill="none" />

            {/* BACK/UNDER WING (High frequency flutter layer) */}
            <g className="bee-wing-bottom">
              <ellipse cx="22" cy="10" rx="9" ry="4" transform="rotate(-30 22 10)" fill="url(#wingGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.4" />
              <path d="M 15 13 C 18 10 23 8 28 7" stroke="rgba(115, 115, 115, 0.3)" strokeWidth="0.4" fill="none" />
              <path d="M 18 11.5 C 20 10 23 10 25 9.5" stroke="rgba(115, 115, 115, 0.25)" strokeWidth="0.3" fill="none" />
            </g>

            {/* FRONT/FORE WING (Larger, detailed venation lines + high rate flapping) */}
            <g className="bee-wing-top">
              <ellipse cx="24" cy="8" rx="11" ry="5" transform="rotate(-25 24 8)" fill="url(#wingGrad)" stroke="rgba(255,255,255,0.95)" strokeWidth="0.5" />
              <path d="M 15 12 C 19 8 25 5 31 5" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.45" fill="none" />
              <path d="M 19 10 C 23 8 27 7 31 7" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.35" fill="none" />
              <path d="M 24 7 Q 27 9 31 8" stroke="rgba(100, 100, 100, 0.35)" strokeWidth="0.3" fill="none" />
              <path d="M 17 9.5 Q 21.5 7.5 25 7" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.3" fill="none" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

const FlyingBees: React.FC = () => {
  const [faded, setFaded] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFaded(true);
    }, 5500); // start fading at 5.5s

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 6000); // remove fully at 6s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  const bees = [
    { id: 1, scale: 0.65 },
    { id: 2, scale: 0.8 },
    { id: 3, scale: 0.95 },
    { id: 4, scale: 1.15 }
  ];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-[5] transition-opacity duration-500 ${faded ? 'opacity-0' : 'opacity-100'}`}>
      <style>{`
        /* Slow layered airy wave-loop hovering */
        @keyframes hover-drift {
          0%, 100% { transform: translate(0, 0) rotate(-4deg); }
          33% { transform: translate(4px, -6px) rotate(3deg); }
          66% { transform: translate(-4px, 4px) rotate(-1deg); }
        }
        /* Intense high-frequency vibration jitter */
        @keyframes high-buzz {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-0.8px, 0.4px); }
          40% { transform: translate(0.8px, -0.6px); }
          60% { transform: translate(-0.4px, -0.4px); }
          80% { transform: translate(0.6px, 0.6px); }
        }
        /* Ultra fast wing flutter (mimicking visual overlap motion blur) */
        @keyframes flap-top {
          0%, 100% { transform: rotate(-25deg) scaleY(1); opacity: 0.95; }
          50% { transform: rotate(40deg) scaleY(0.12); opacity: 0.35; }
        }
        @keyframes flap-bottom {
          0%, 100% { transform: rotate(25deg) scaleY(1); opacity: 0.9; }
          50% { transform: rotate(-40deg) scaleY(0.12); opacity: 0.3; }
        }
        .bee-drift {
          animation: hover-drift 1.2s ease-in-out infinite;
        }
        .bee-buzz {
          animation: high-buzz 0.05s linear infinite;
        }
        .bee-wing-top {
          animation: flap-top 0.01s ease-in-out infinite;
          transform-origin: 24px 8px; /* Anchor precisely at the base connection on thorax */
        }
        .bee-wing-bottom {
          animation: flap-bottom 0.012s ease-in-out infinite;
          transform-origin: 22px 10px; /* Anchor precisely at the base connection on thorax */
        }
      `}</style>
      {bees.map(bee => (
        <BeeItem key={bee.id} scale={bee.scale} />
      ))}
    </div>
  );
};

const ShopFlybyBee: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // Start off-screen at left
  const [pos, setPos] = useState({ x: -15, y: 20 });
  const [angle, setAngle] = useState(10); // Tilted down slightly as it flies across

  useEffect(() => {
    // Trigger flying motion across screen immediately
    const moveTimer = setTimeout(() => {
      setPos({ x: 115, y: 32 });
    }, 50);

    // After 3 seconds, unmount the bee
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3050);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none transition-all select-none"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transitionDuration: '3000ms',
        transitionTimingFunction: 'linear',
        transform: `rotate(${angle}deg) scale(0.95)`,
        zIndex: 120, // Fly in front of content as a prominent landing effect
      }}
    >
      <div className="bee-drift">
        <div className="bee-buzz">
          <svg width="45" height="35" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <defs>
              <linearGradient id="wingGradShop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.3" />
              </linearGradient>
              <radialGradient id="thoraxGradShop" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="70%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>
              <linearGradient id="abdomenGradShop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="30%" stopColor="#eab308" />
                <stop offset="65%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              <radialGradient id="pollenGradShop" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>

            {/* Jointed legs */}
            <path d="M 28 22 L 26 27 L 22 29" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 22 22 L 20 28 L 16 30" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <g>
              <path d="M 15 22 L 12 29 L 8 31" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <ellipse cx="11" cy="27" rx="3.5" ry="2.5" transform="rotate(-15 11 27)" fill="url(#pollenGradShop)" />
            </g>

            {/* Abdomen */}
            <path d="M 4 18 L 1 19 L 4 20 Z" fill="#000" />
            <ellipse cx="14" cy="19" rx="10.5" ry="7.5" transform="rotate(-5 14 19)" fill="url(#abdomenGradShop)" />
            <path d="M 7 15.5 Q 8 19 8 22.5 C 6.5 22 6 20 5.5 17.5 Z" fill="#1c1917" />
            <path d="M 11 13 Q 12.2 19 11.5 25 C 9.8 24.5 9.3 22 8.8 15 Z" fill="#1c1917" />
            <path d="M 15.5 12 Q 16.7 19 15.5 25.5 C 13.8 25 13.3 22.5 13.3 13.5 Z" fill="#1c1917" />
            <path d="M 20 12.5 Q 20.7 18 19.5 24.5 C 18.2 24 17.7 21.5 17.7 14 Z" fill="#1c1917" />

            {/* Thorax */}
            <ellipse cx="24" cy="18" rx="7" ry="7" fill="url(#thoraxGradShop)" />
            <ellipse cx="24" cy="18" rx="6.5" ry="6.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="1,1" strokeOpacity="0.8" />

            {/* Head */}
            <ellipse cx="32" cy="18" rx="4.5" ry="5.5" fill="#292524" />
            <ellipse cx="32.5" cy="16" rx="1.8" ry="2.8" fill="#0c0a09" transform="rotate(10 32.5 16)" />
            <circle cx="33.2" cy="14.8" r="0.6" fill="#ffffff" />

            {/* Antennae */}
            <path d="M 34.5 14 Q 38.5 10 37 6" stroke="#0c0a09" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M 35 17 Q 39.2 18 39.5 22.2" stroke="#0c0a09" strokeWidth="0.95" strokeLinecap="round" fill="none" />

            {/* Back wing */}
            <g className="bee-wing-bottom">
              <ellipse cx="22" cy="10" rx="9" ry="4" transform="rotate(-30 22 10)" fill="url(#wingGradShop)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.4" />
              <path d="M 15 13 C 18 10 23 8 28 7" stroke="rgba(115, 115, 115, 0.3)" strokeWidth="0.4" fill="none" />
              <path d="M 18 11.5 C 20 10 23 10 25 9.5" stroke="rgba(115, 115, 115, 0.25)" strokeWidth="0.3" fill="none" />
            </g>

            {/* Front wing */}
            <g className="bee-wing-top">
              <ellipse cx="24" cy="8" rx="11" ry="5" transform="rotate(-25 24 8)" fill="url(#wingGradShop)" stroke="rgba(255,255,255,0.95)" strokeWidth="0.5" />
              <path d="M 15 12 C 19 8 25 5 31 5" stroke="rgba(100, 100, 100, 0.4)" strokeWidth="0.45" fill="none" />
              <path d="M 19 10 C 23 8 27 7 31 7" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.35" fill="none" />
              <path d="M 24 7 Q 27 9 31 8" stroke="rgba(100, 100, 100, 0.35)" strokeWidth="0.3" fill="none" />
              <path d="M 17 9.5 Q 21.5 7.5 25 7" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="0.3" fill="none" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Product | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [lastAddedName, setLastAddedName] = useState('');
  const [tvOn, setTvOn] = useState(true);
  const [tvWarmingUp, setTvWarmingUp] = useState(true);
  const [tvVolume, setTvVolume] = useState(0);
  const [hasShopBeeFlown, setHasShopBeeFlown] = useState(false);
  const [audioOverlayDismissed, setAudioOverlayDismissed] = useState(false);
  const [dismissingAudioOverlay, setDismissingAudioOverlay] = useState(false);
  
  const tvIframeRef = useRef<HTMLIFrameElement>(null);

  const handleActivateAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDismissingAudioOverlay(true);
    setTimeout(() => {
      setTvVolume(1);
      setAudioOverlayDismissed(true);
      setDismissingAudioOverlay(false);
    }, 350);
  };
  
  // Custom 3-Jar Box states
  const [selectedFlavor, setSelectedFlavor] = useState<Product>(PRODUCTS[0]);
  const [bundleSlots, setBundleSlots] = useState<(Product | null)[]>([null, null, null]);
  const [boxPopupExpanded, setBoxPopupExpanded] = useState(false);

  const addToBundleSlots = (product: Product) => {
    const firstEmptyIndex = bundleSlots.findIndex(slot => slot === null);
    if (firstEmptyIndex !== -1) {
      const updatedSlots = [...bundleSlots];
      updatedSlots[firstEmptyIndex] = product;
      setBundleSlots(updatedSlots);
    } else {
      // If already full, replace the last slot to sustain smooth assembly
      const updatedSlots = [...bundleSlots];
      updatedSlots[2] = product;
      setBundleSlots(updatedSlots);
    }
    setBoxPopupExpanded(true);
  };

  const removeFromBundleSlot = (index: number) => {
    const updatedSlots = [...bundleSlots];
    updatedSlots[index] = null;
    setBundleSlots(updatedSlots);
  };

  const clearBundleSlots = () => {
    setBundleSlots([null, null, null]);
  };

  const addCustomBoxToCart = () => {
    const filledSlots = bundleSlots.filter((slot): slot is Product => slot !== null);
    if (filledSlots.length !== 3) return;

    const sortedIds = filledSlots.map(f => f.id).sort();
    const bundleKey = `bundle-${sortedIds.join('-')}`;

    const countMap: Record<string, number> = {};
    filledSlots.forEach(slot => {
      countMap[slot.name] = (countMap[slot.name] || 0) + 1;
    });
    const subdescription = Object.entries(countMap)
      .map(([name, qty]) => `${qty}x ${name.replace(' Creamed Honey', '').replace(' Honey Chilli Infusion', '')}`)
      .join(', ');

    const customBoxProduct: Product = {
      id: bundleKey,
      name: 'Mix & Match 3-Jar Gilded Box',
      price: '$34.99',
      priceNumber: 34.99,
      description: `Premium woodcrate bundle with: ${subdescription}.`,
      category: 'hive',
      imageUrl: '/assets/custom-bundle.png', // Fallback vector will trigger on error
    };

    addToCart(customBoxProduct);
    clearBundleSlots();
  };

  // TV warmup timer that handles initial load and manual toggle-on cycles
  useEffect(() => {
    let timer: any;
    if (tvOn && tvWarmingUp) {
      timer = setTimeout(() => {
        setTvWarmingUp(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [tvOn, tvWarmingUp]);

  // Audio mute/unmute communication with YouTube iframe API via postMessage
  useEffect(() => {
    if (tvOn && !tvWarmingUp && tvIframeRef.current) {
      try {
        if (tvVolume > 0) {
          tvIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'unMute',
              args: [],
            }),
            '*'
          );
          tvIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'setVolume',
              args: [100],
            }),
            '*'
          );
        } else {
          tvIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'mute',
              args: [],
            }),
            '*'
          );
        }
      } catch (e) {
        console.error('Error post-messaging YouTube player:', e);
      }
    }
  }, [tvVolume, tvOn, tvWarmingUp]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setOrderComplete(true);
      setCart([]); // Clear cart on success
      // Remove the query param from URL without refreshing
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (query.get('canceled')) {
      setOrderCanceled(true);
      // Remove the query param from URL without refreshing
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Page Visit Conversion
    if ((currentPage === Page.Studio || currentPage === Page.Shop) && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-18004717987/SBohCOL8vK8cEKPjqIlD',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  }, [currentPage]);

  const addToCart = (product: Product) => {
    setLastAddedName(product.name);
    setShowAddedToast(true);
    setTimeout(() => {
      setShowAddedToast(false);
    }, 3500);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateToHomeSection = (sectionId: string) => {
    setCurrentPage(Page.Home);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  const NavLink = ({ page, label, emoji }: { page: Page, label: string, emoji: string }) => (
    <button 
      onClick={() => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className={`tilt-hover px-6 py-2 flex items-center gap-2 rounded-lg transition-all ${
        currentPage === page 
          ? 'nav-link-active font-black shadow-lg' 
          : 'text-stone-500 hover:text-forest font-bold uppercase tracking-widest text-xs'
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-honey selection:text-white">
      {currentPage === Page.Home && <FlyingBees />}
      
      <InquiryModal product={activeInquiry} onClose={() => setActiveInquiry(null)} />

      {/* STRIPE NOTIFICATIONS */}
      {orderComplete && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md px-6 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-forest text-white p-6 rounded-[2rem] shadow-2xl border-4 border-white flex items-center gap-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🍯</div>
            <div className="flex-1">
              <h4 className="font-black uppercase text-xs tracking-widest mb-1">Order Confirmed!</h4>
              <p className="text-[10px] font-serif-modern italic opacity-80 leading-relaxed">Thank you for supporting Jessica Farms. We'll start prepping your order in Norton immediately.</p>
            </div>
            <button onClick={() => setOrderComplete(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
          </div>
        </div>
      )}

      {orderCanceled && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md px-6 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-red-600 text-white p-6 rounded-[2rem] shadow-2xl border-4 border-white flex items-center gap-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🐝</div>
            <div className="flex-1">
              <h4 className="font-black uppercase text-xs tracking-widest mb-1">Order Canceled</h4>
              <p className="text-[10px] font-serif-modern italic opacity-80 leading-relaxed">No worries! Your cart is still waiting for you if you change your mind.</p>
            </div>
            <button onClick={() => setOrderCanceled(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
          </div>
        </div>
      )}

      {/* CLEAN NAV BAR */}
      <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled || mobileMenuOpen ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm border-b border-forest/10' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div 
            onClick={() => {
              setCurrentPage(Page.Home);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-4 cursor-pointer group tilt-hover"
          >
            <div className="w-16 h-16 bg-transparent flex items-center justify-center overflow-hidden relative">
               <img 
                 src="/assets/logo.png" 
                 alt="Jessica Farms Logo" 
                 className="w-full h-full object-contain" 
                 referrerPolicy="no-referrer" 
               />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none text-forest">Jessica Farms</h1>
              <p className="text-xs font-typewriter uppercase text-honey font-bold tracking-wider mt-1">Norton, Ohio</p>
            </div>
          </div>

          {/* CENTER & RIGHT NAVIGATION MODULE */}
          <div className="flex items-center gap-4 lg:gap-6">
            <nav className={`
              fixed lg:static top-[88px] left-0 w-full lg:w-auto 
              bg-white lg:bg-transparent p-6 lg:p-0 border-b lg:border-0 border-forest/10
              flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4
              transition-all duration-300 transform z-[100]
              ${mobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible lg:translate-y-0 lg:visible lg:opacity-100'}
            `}>
              <NavLink page={Page.Home} label="Home" emoji="🏡" />
              {CONFIG.enableStore && <NavLink page={Page.Shop} label="Shop" emoji="🛒" />}
              {CONFIG.enableStudio && <NavLink page={Page.Studio} label="Studio" emoji="🎥" />}
              {CONFIG.enablePlay && <NavLink page={Page.Play} label="Play" emoji="🎮" />}
              <NavLink page={Page.Contact} label="Contact" emoji="📫" />
            </nav>

            {/* DECREASED VISUAL DOMINANCE CART BUTTON */}
            {CONFIG.enableStore && currentPage !== Page.Checkout && cartCount > 0 && (
              <button 
                onClick={() => {
                  setCurrentPage(Page.Checkout);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 bg-[#1a4332] hover:bg-[#20533e] text-[#fdfcf8] border-2 border-[#d9a520]/80 px-3.5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-200 active:scale-95 group shadow-sm shrink-0"
              >
                <span>🛒 Cart ({cartCount})</span>
              </button>
            )}

            <button 
              className="lg:hidden p-3 text-forest bg-white rounded-xl border-2 border-forest/20 shadow-sm shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-6">
        
        {currentPage === Page.Home && (
          <div className="animate-in fade-in duration-700">
            <Homepage 
              setCurrentPage={setCurrentPage} 
              onInquireProduct={(product) => setActiveInquiry(product)} 
            />
          </div>
        )}

        {currentPage === Page.Shop && (
          <div className="animate-in fade-in duration-1000 space-y-12 scroll-smooth">
            <style>{`
              @keyframes honeyGlow {
                0%, 100% { opacity: 0.15; transform: scale(1) translate(0px, 0px); }
                50% { opacity: 0.35; transform: scale(1.12) translate(10px, -10px); }
              }
              @keyframes floatSlow {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(1.5deg); }
              }
              @keyframes particleFloat {
                0% { transform: translateY(120px) scale(0.6) rotate(0deg); opacity: 0; }
                40% { opacity: 0.5; }
                90% { opacity: 0.2; }
                100% { transform: translateY(-160px) scale(1.3) rotate(360deg); opacity: 0; }
              }
              .animate-glow-pulse {
                animation: honeyGlow 10s ease-in-out infinite;
              }
              .animate-float-slow {
                animation: floatSlow 7s ease-in-out infinite;
              }
              .particle-gold {
                animation: particleFloat 12s ease-in-out infinite;
              }

              /* Dedicated Breakpoint for widths below 700px (covering 480px-700px range) */
              @media (max-width: 700px) {
                .vintage-tv-section-container {
                  display: flex !important;
                  flex-direction: column !important;
                  height: auto !important;
                  min-height: unset !important;
                  padding: 1.5rem 1rem !important;
                  border-radius: 1.5rem !important;
                  overflow: visible !important;
                }
                .vintage-tv-grid-layout {
                  display: flex !important;
                  flex-direction: column !important;
                  gap: 1.5rem !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  transform: none !important;
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  bottom: auto !important;
                }
                .retro-tv-left-column {
                  width: 100% !important;
                  max-width: min(92vw, 440px) !important;
                  margin: 0 auto !important;
                  transform: none !important;
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  bottom: auto !important;
                }
                .retro-tv-cabinet {
                  transform: none !important;
                  margin: 0 auto !important;
                  max-width: 100% !important;
                  border-radius: 1.5rem !important;
                  padding: 0.75rem !important;
                }
                /* Prevent antennae and shadow from scaling incorrectly on mobile */
                .retro-tv-antennae {
                  margin-bottom: 0.5rem !important;
                  transform: scale(0.8) !important;
                  transform-origin: bottom center !important;
                  max-width: 100% !important;
                }
                .retro-tv-shadow-stand {
                  margin-top: 0.25rem !important;
                  transform: none !important;
                  width: 80% !important;
                }
                /* Help the explainer flyer flow cleanly */
                .vintage-tv-right-column {
                  width: 100% !important;
                  max-width: min(92vw, 440px) !important;
                  margin: 0 auto !important;
                  transform: none !important;
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  bottom: auto !important;
                  border-radius: 1.5rem !important;
                  padding: 1.25rem !important;
                }
                /* Make product card margin-top responsive so it never collides with the TV */
                .vintage-tv-product-section {
                  margin-top: 3.5rem !important;
                  border-radius: 1.5rem !important;
                  padding: 1.25rem !important;
                }
                /* Overall layout safety checks */
                body, html, #root {
                  overflow-x: hidden !important;
                }
                .scroll-smooth {
                  overflow-x: hidden !important;
                  overflow-y: visible !important;
                }
                /* Hide huge blurred lighting rings to avoid side-scrolling */
                .vintage-tv-section-container .blur-3xl {
                  display: none !important;
                }
              }

              /* Dedicated Breakpoint around 640px for robust mobile transition and spacing */
              @media (max-width: 640px) {
                .vintage-tv-section-container {
                  padding: 1.25rem 0.75rem !important;
                  border-radius: 1.25rem !important;
                }
                .retro-tv-left-column, .vintage-tv-right-column {
                  max-width: min(92vw, 410px) !important;
                }
                .vintage-tv-product-section {
                  margin-top: 3rem !important;
                  border-radius: 1.25rem !important;
                  padding: 1.25rem !important;
                }
              }

              /* Dedicated Breakpoint around 600px */
              @media (max-width: 600px) {
                .retro-tv-left-column, .vintage-tv-right-column {
                  max-width: min(92vw, 390px) !important;
                }
                .vintage-tv-right-column h4 {
                  font-size: 1.4rem !important;
                }
                .vintage-tv-right-column span.text-5xl {
                  font-size: 2.25rem !important;
                }
                .vintage-tv-product-section {
                  margin-top: 2.5rem !important;
                }
              }

              /* Dedicated Breakpoint at 575px and below */
              @media (max-width: 575px) {
                .retro-tv-left-column, .vintage-tv-right-column {
                  max-width: min(92vw, 370px) !important;
                }
              }

              /* Compact sizing for mobile screens (430px, 390px, 375px) */
              @media (max-width: 430px) {
                .vintage-tv-section-container {
                  padding: 1rem 0.5rem !important;
                }
                .retro-tv-left-column, .vintage-tv-right-column {
                  max-width: min(94vw, 340px) !important;
                }
                .vintage-tv-right-column {
                  padding: 1.25rem !important;
                }
                .vintage-tv-right-column h4 {
                  font-size: 1.25rem !important;
                }
                .vintage-tv-right-column span.text-5xl {
                  font-size: 2rem !important;
                }
                .vintage-tv-product-section {
                  margin-top: 2rem !important;
                  padding: 1rem !important;
                }
              }

              @media (max-width: 375px) {
                .retro-tv-left-column, .vintage-tv-right-column {
                  max-width: min(95vw, 310px) !important;
                }
                .vintage-tv-right-column h4 {
                  font-size: 1.15rem !important;
                }
                .vintage-tv-right-column span.text-5xl {
                  font-size: 1.75rem !important;
                }
              }
            `}</style>

            {/* STICKY FLOATING SHOPPING CART FAST CHECKOUT */}
            {CONFIG.enableStore && currentPage !== Page.Checkout && cartCount > 0 && (
              <div className={`fixed z-[130] font-sans antialiased animate-in fade-in duration-300 right-6 transition-all duration-300 ${
                bundleSlots.some(s => s !== null) 
                  ? boxPopupExpanded 
                    ? 'bottom-[370px]' 
                    : 'bottom-[76px]' 
                  : 'bottom-6'
              }`}>
                <button
                  onClick={() => {
                    setCurrentPage(Page.Checkout);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 bg-[#1a4332] hover:bg-[#20533e] text-white border-2 border-[#d9a520] rounded-full p-3.5 px-5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <div className="relative">
                    <ShoppingCart className="w-4.5 h-4.5 text-[#d9a520] group-hover:scale-110" />
                    <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] bg-[#d9a520] text-[#1a4332] rounded-full flex items-center justify-center text-[9px] font-black border border-[#100c0a] px-0.5 shadow-md">
                      {cartCount}
                    </span>
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[8px] font-black uppercase tracking-wider text-[#d9a520] block">Checkout</span>
                    <span className="text-[9.5px] font-bold text-stone-200 block mt-0.5">View Cart ➔</span>
                  </div>
                </button>
              </div>
            )}

            {/* FLOATING ACTION TOAST */}
            {showAddedToast && (
              <div className="fixed bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 z-[150] w-[90%] max-w-sm px-6 animate-bounce">
                <div className="bg-[#1a4332] text-[#fdfcf8] p-5 rounded-[2rem] shadow-2xl border-4 border-[#d9a520] flex items-center gap-4">
                  <span className="text-2xl">🍯</span>
                  <div className="flex-1">
                    <h5 className="font-black uppercase text-[10px] tracking-widest text-[#d9a520]">Added to Jar Collection!</h5>
                    <p className="text-[11px] font-serif-modern italic opacity-90 leading-normal">{lastAddedName} is in your cart.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentPage(Page.Checkout)} 
                    className="bg-[#d9a520] text-[#1a4332] px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-[#c4951b] transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}

            {/* FLOATING BOX BUILDER POP-UP */}
            {bundleSlots.some(s => s !== null) && (
              <div className="fixed bottom-6 right-6 z-[140] w-[340px] max-w-[calc(100vw-2rem)] font-sans antialiased">
                {boxPopupExpanded ? (
                  /* EXPANDED PANEL VIEW */
                  <div className="bg-[#100c0acc]/90 backdrop-blur-md border-2 border-[#d9a520]/70 text-white rounded-[2rem] p-5 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d9a520] leading-none text-left">Mix & Match</h5>
                          <p className="text-[8px] uppercase tracking-wider text-stone-400 mt-0.5 font-mono text-left">3-Jar Gift Box</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <button 
                          onClick={() => setBoxPopupExpanded(false)} 
                          className="flex items-center gap-1 bg-white/5 hover:bg-white/12 text-stone-400 hover:text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                          title="Minimize Panel"
                        >
                          <ChevronDown className="w-3 h-3 text-[#d9a520]" />
                          <span>Minimize</span>
                        </button>
                        <button 
                          onClick={clearBundleSlots} 
                          className="flex items-center gap-1 bg-red-950/20 hover:bg-red-900/40 text-red-500 hover:text-red-400 px-2 py-1 rounded-full text-[9px] font-bold uppercase transition-all shadow-sm"
                          title="Clear Box"
                        >
                          <Trash2 className="w-3 h-3 text-red-450" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>

                    {/* Stated Price Info */}
                    <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5 flex justify-between items-center text-left">
                      <div>
                        <span className="text-[7.5px] uppercase font-black text-[#d9a520] tracking-widest block leading-none">SPECIAL COMBINATION OFFER</span>
                        <span className="text-[11px] font-bold font-serif-modern italic text-stone-200 mt-1 block">Any 3 flavors for only $34.99!</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-500 block leading-none">$34.99</span>
                        <span className="text-[6.5px] font-mono text-stone-400 uppercase tracking-widest block mt-0.5">Free Shipping</span>
                      </div>
                    </div>

                    {/* Visual 3 Compartments inside POPUP */}
                    <div className="grid grid-cols-3 gap-3 py-1">
                      {bundleSlots.map((slot, index) => {
                        return (
                          <div 
                            key={index} 
                            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 relative transition-all duration-300 shadow-sm
                              ${slot 
                                ? 'bg-amber-950/45 border-[#d9a520]/60 shadow-inner' 
                                : 'bg-white/5 border-dashed border-white/10 hover:border-white/20'
                              }`}
                          >
                            {slot ? (
                              <>
                                <button 
                                  onClick={() => removeFromBundleSlot(index)} 
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-950/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[8px] font-black transition-colors z-10 shadow"
                                  title="Remove"
                                >
                                  ✕
                                </button>
                                <span className="text-sm select-none mb-1">🍯</span>
                                <div className="text-center w-full px-0.5">
                                  <span className="text-[7.5px] block font-black uppercase text-stone-100 truncate leading-none">
                                    {slot.name.replace(' Creamed Honey', '').replace(' Honey Chilli Infusion', '')}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center w-full text-center p-1 opacity-55">
                                <span className="text-[#d9a520]/75 font-mono text-sm leading-none font-bold">+</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA button inside POPUP */}
                    <div>
                      {bundleSlots.filter(s => s !== null).length === 3 ? (
                        <button 
                          onClick={() => {
                            addCustomBoxToCart();
                            setBoxPopupExpanded(false);
                          }}
                          className="w-full bg-[#d9a520] hover:bg-[#c4951b] text-[#1a4332] font-black text-[9px] uppercase tracking-[0.2em] py-3.5 rounded-xl shadow-lg transition-all duration-300 active:scale-95 animate-pulse"
                        >
                          📥 Add Completed Box • $34.99
                        </button>
                      ) : (
                        <div className="text-center py-2.5 bg-white/5 rounded-xl text-stone-400 font-serif-modern text-[8.5px] italic">
                          Choose {3 - bundleSlots.filter(s => s !== null).length} more to lock in gift pack!
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  /* MINIMIZED COMPACT VIEW */
                  <button 
                    onClick={() => setBoxPopupExpanded(true)}
                    className="w-full bg-[#100c0acc]/90 backdrop-blur-md border-2 border-[#d9a520]/70 hover:border-[#d9a520] text-white rounded-full p-3 px-4 shadow-2xl flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer active:scale-95 animate-in fade-in zoom-in-95 hover:bg-[#15110fe6]"
                  >
                    <div className="flex items-center gap-3">
                      {/* Box progress icon wrapper */}
                      <div className="relative">
                        <span className="text-xl block">📦</span>
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-[#100c0a] rounded-full flex items-center justify-center text-[8px] font-black border border-[#100c0a]">
                          {bundleSlots.filter(s => s !== null).length}
                        </div>
                      </div>

                      <div className="text-left leading-none space-y-0.5">
                        <div className="text-[8.5px] font-black uppercase tracking-wider text-[#d9a520]">My Gift Box</div>
                        <div className="text-[7.5px] text-stone-400 font-mono uppercase tracking-widest font-black">
                          {bundleSlots.filter(s => s !== null).length}/3 Jars Added
                        </div>
                      </div>
                    </div>

                    {/* Compact 3-Slot Fills representation */}
                    <div className="flex gap-1 items-center justify-end bg-black/40 px-2 py-1 rounded-full border border-white/5">
                      {bundleSlots.map((slot, sIdx) => {
                        const isFilled = slot !== null;
                        return (
                          <div 
                            key={sIdx} 
                            className={`w-3.5 h-3.5 rounded-full transition-all duration-300
                              ${isFilled 
                                ? 'bg-amber-500 ring-2 ring-[#d9a520]/40 animate-pulse' 
                                : 'bg-stone-800'
                              }`}
                          />
                        );
                      })}
                    </div>
                  </button>
                )}
              </div>
            )}

            {!CONFIG.enableStore ? (
              <div className="text-center py-24 space-y-8 max-w-lg mx-auto bg-white/40 p-12 rounded-[3.5rem] border-2 border-forest/5 shadow-2xl">
                <div className="w-48 h-48 mx-auto bg-honey/10 rounded-full flex items-center justify-center border-4 border-dashed border-honey/40">
                  <span className="text-8xl animate-pulse">🍯</span>
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-honey">ESTABLISHED 2024</span>
                  <h2 className="text-5xl font-serif-modern font-black italic text-forest">Honey Stand<br/>Coming Soon</h2>
                  <p className="text-stone-500 font-serif-modern italic text-lg leading-relaxed">
                    We're spinning our hives with love. Check back soon for Norton-grown creamed honey!
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentPage(Page.Contact)}
                  className="btn-honey px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
                >
                  Inquire Directly
                </button>
              </div>
            ) : (
              <>
                {/* VINTAGE RETRO TV SHOWCASE CENTERPIECE AT TOP */}
                <section className="vintage-tv-section-container relative overflow-visible bg-gradient-to-br from-[#1a4332] via-[#102d21] to-[#0a1f16] rounded-[2.5rem] text-[#fdfcf8] shadow-3xl border-4 border-[#d9a520]/25 p-5 md:p-7 lg:p-10 flex flex-col items-center space-y-4 pb-12 md:pb-16 lg:pb-24">
                  
                  {/* Subtle retro retro grain overlay */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-[radial-gradient(#d9a520_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Slow floating light particles */}
                  <div className="absolute inset-x-0 bottom-0 top-1/2 overflow-hidden pointer-events-none z-10">
                    <div className="absolute left-[8%] bottom-4 w-3 h-3 bg-[#d9a520]/30 rounded-full particle-gold" style={{ animationDelay: '0s', animationDuration: '9s' }}></div>
                    <div className="absolute left-[20%] bottom-8 w-2 h-2 bg-yellow-400/40 rounded-full particle-gold" style={{ animationDelay: '2.5s', animationDuration: '12s' }}></div>
                    <div className="absolute left-[45%] bottom-2 w-4 h-4 bg-[#d9a520]/20 rounded-full particle-gold" style={{ animationDelay: '1s', animationDuration: '14s' }}></div>
                    <div className="absolute left-[65%] bottom-1 w-2 h-2 bg-yellow-300/30 rounded-full particle-gold" style={{ animationDelay: '4.5s', animationDuration: '10s' }}></div>
                    <div className="absolute left-[82%] bottom-6 w-3 h-3 bg-[#d9a520]/40 rounded-full particle-gold" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
                    <div className="absolute left-[92%] bottom-3 w-4 h-4 bg-yellow-500/10 rounded-full particle-gold" style={{ animationDelay: '6s', animationDuration: '15s' }}></div>
                  </div>

                  {/* Soft Warm Ambient Lighting Rings */}
                  <div className="absolute right-1/4 top-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-r from-[#d9a520]/15 to-amber-600/5 rounded-full blur-3xl animate-glow-pulse pointer-events-none z-0"></div>

                  {/* SIDE-BY-SIDE INTEGRATED GRID LAYOUT */}
                  <div className="vintage-tv-grid-layout w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 items-center relative z-20">
                    
                    {/* LEFT COLUMN: RETRO TV (Col-span 7) - Elegant size scale */}
                    <div className="retro-tv-left-column col-span-12 lg:col-span-7 relative w-full max-w-full lg:max-w-[760px] mx-auto flex flex-col items-center">
                      
                      {/* ANTENNAE (Rabbit ears) */}
                      <div className="retro-tv-antennae relative w-48 h-10 mb-0 lg:-mb-2 flex justify-between px-8 pointer-events-none z-15 lg:scale-75">
                        {/* Left ear */}
                        <div className="w-1 h-14 bg-gradient-to-t from-[#8a7251]/80 to-stone-400 origin-bottom transform -rotate-[35deg] rounded-full shadow-md">
                          <div className="w-2.5 h-2.5 bg-[#8a7251] rounded-full -mt-1.5 -ml-0.5"></div>
                        </div>
                        {/* Right ear */}
                        <div className="w-1 h-14 bg-gradient-to-t from-[#8a7251]/80 to-stone-400 origin-bottom transform rotate-[35deg] rounded-full shadow-md">
                          <div className="w-2.5 h-2.5 bg-[#8a7251] rounded-full -mt-1.5 -ml-0.5"></div>
                        </div>
                        {/* Base */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-stone-900 rounded-full border border-stone-850"></div>
                      </div>

                      {/* MAIN RETRO TV CABINET */}
                      <div className="retro-tv-cabinet w-full max-w-full bg-gradient-to-b from-[#38230f] via-[#4f3115] to-[#251608] rounded-[2.5rem] p-4 shadow-3xl border-4 border-[#613e1c] relative grid grid-cols-12 gap-3 items-stretch shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
                        
                        <div className="absolute top-1 inset-x-10 h-1 bg-white/10 rounded-full blur-[2px] pointer-events-none"></div>
                        
                        {/* SCREEN (Cols 1 to 10) */}
                        <div className="col-span-12 md:col-span-10 bg-stone-950 p-2.5 md:p-3.5 rounded-3xl border-4 border-stone-850 shadow-[inset_0_8px_20px_rgba(0,0,0,0.95)] relative flex flex-col items-stretch justify-center w-full">
                          
                          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-xl z-25"></div>
                          <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.14] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.7)_100%)]"></div>
                          
                          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-black relative z-10 border border-stone-900 shadow-inner">
                            {/* Always render iframe if TV is on */}
                            {tvOn && (
                              <iframe 
                                ref={tvIframeRef}
                                id="retro-tv-player"
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${INTRO_VIDEO.id}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`} 
                                title="Jessica Farms Vintage Broadcast" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                              />
                            )}

                            {/* Cinematic Retro TV OSD Audio Overlay */}
                            {tvOn && !tvWarmingUp && tvVolume === 0 && !audioOverlayDismissed && (
                              <div 
                                onClick={handleActivateAudio}
                                className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[280px] bg-[#0c1310ec] border-2 border-[#d9a520]/45 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.85),_0_0_15px_rgba(217,165,32,0.15)] flex flex-col items-center justify-center cursor-pointer select-none backdrop-blur-md z-25 transition-all duration-300 ease-out hover:border-[#d9a520] hover:scale-102 hover:shadow-[0_15px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(217,165,32,0.25)] ${
                                  dismissingAudioOverlay ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 animate-osd-glow'
                                }`}
                              >
                                {/* Style tag container for custom embedded CRT OSD animations */}
                                <style>{`
                                  @keyframes osd-glow-pulse {
                                    0%, 100% { border-color: rgba(217,165,32,0.45); box-shadow: 0 10px 35px rgba(0,0,0,0.85), 0 0 12px rgba(217,165,32,0.1); }
                                    50% { border-color: rgba(217,165,32,0.8); box-shadow: 0 10px 35px rgba(0,0,0,0.85), 0 0 20px rgba(217,165,32,0.25); }
                                  }
                                  @keyframes neon-amber-flicker {
                                    0%, 100% { opacity: 0.95; filter: drop-shadow(0 0 4px rgba(217,165,32,0.85)); }
                                    45% { opacity: 0.8; filter: drop-shadow(0 0 2px rgba(217,165,32,0.55)); }
                                    50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(217,165,32,1)); }
                                    85% { opacity: 0.9; filter: drop-shadow(0 0 4px rgba(217,165,32,0.75)); }
                                  }
                                  @keyframes speaker-breathing {
                                    0%, 100% { transform: scale(1); opacity: 0.85; }
                                    50% { transform: scale(1.1); opacity: 1; }
                                  }
                                  @keyframes live-indicator-pulse {
                                    0%, 100% { transform: scale(1); opacity: 0.4; filter: drop-shadow(0 0 1px rgba(239,68,68,0.3)); }
                                    50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 5px rgba(239,68,68,0.95)); }
                                  }
                                  .animate-osd-glow {
                                    animation: osd-glow-pulse 3s ease-in-out infinite;
                                  }
                                  .animate-neon-flicker {
                                    animation: neon-amber-flicker 4.2s ease-in-out infinite;
                                  }
                                  .animate-speaker {
                                    animation: speaker-breathing 1.8s ease-in-out infinite;
                                  }
                                  .animate-live-pulse {
                                    animation: live-indicator-pulse 1.4s ease-in-out infinite;
                                  }
                                  .crt-osd-shimmer {
                                    position: relative;
                                    overflow: hidden;
                                  }
                                  .crt-osd-shimmer::before {
                                    content: '';
                                    position: absolute;
                                    top: 0; left: 0; right: 0; bottom: 0;
                                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05));
                                    background-size: 100% 4px, 3px 100%;
                                    pointer-events: none;
                                    opacity: 0.12;
                                  }
                                `}</style>
                                
                                {/* Inner decorative frame layout */}
                                <div className="w-full h-full crt-osd-shimmer flex flex-col items-center">
                                  {/* Top micro tag */}
                                  <div className="flex items-center gap-1.5 justify-center mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-live-pulse"></span>
                                    <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#d9a520] font-black uppercase mb-0.5 animate-neon-flicker">
                                      BROADCAST AUDIO AVAILABLE
                                    </span>
                                  </div>

                                  {/* Main Row: Speaker Icon & CTA */}
                                  <div className="flex items-center gap-2 my-1 bg-black/45 px-3 py-1.5 rounded-xl border border-white/5 w-full justify-center">
                                    <div className="text-amber-500 flex items-center justify-center animate-speaker">
                                      <Volume2 className="w-4.5 h-4.5 text-[#d9a520] drop-shadow-[0_0_3px_rgba(217,165,32,0.4)]" />
                                    </div>
                                    
                                    <span className="text-[11px] font-sans font-black tracking-widest text-[#fdfcf8] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                                      Tap for Sound
                                    </span>
                                    
                                    {/* Glow indicator bulb */}
                                    <div className="w-2 h-2 rounded-full bg-[#d9a520] animate-neon-flicker shadow-[0_0_8px_rgba(217,165,32,0.9)]"></div>
                                  </div>

                                  {/* Minimal luxury subtext */}
                                  <span className="text-[8px] tracking-wide text-stone-300 font-serif-modern italic font-bold">
                                    Enable immersive farm audio
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Visual CRT Warmup Overlay covering the iframe */}
                            <div className={`absolute inset-0 bg-[#111] flex flex-col items-center justify-center overflow-hidden select-none font-sans z-20 transition-opacity duration-1000 ease-out ${
                              tvOn && tvWarmingUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                            }`}>
                              <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.95)_100%)]"></div>
                              <div className="absolute inset-0 bg-[#ea580c]/5 mix-blend-color-dodge animate-pulse"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-amber-500/20 blur-2xl animate-ping duration-1000"></div>
                              <div className="text-stone-400 font-mono text-[8px] tracking-widest text-center uppercase space-y-1.5 z-10 animate-pulse">
                                <span className="text-base block animate-bounce">📺</span>
                                <div className="font-extrabold text-[#d9a520]">Warming Up Tube...</div>
                                <div className="text-[6.5px] text-[#d9a520]/60 normal-case italic font-serif-modern">Heating up cathode rays for Norton broadcast</div>
                              </div>
                            </div>

                            {/* System Power Off screen overlay */}
                            {!tvOn && (
                              <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center overflow-hidden select-none font-sans z-30 transition-all duration-500">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-neutral-300 pointer-events-none opacity-30 shadow-[0_0_10px_rgba(255,255,255,0.8)] filter blur-[1px] animate-out duration-1000 zoom-out-50"></div>
                                <div className="absolute inset-0 opacity-[0.22] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.9)_100%)]"></div>
                                <div className="text-[#d9a520]/45 font-mono text-[8px] tracking-widest text-center uppercase space-y-1 z-10">
                                  <span className="text-base block animate-bounce">📺</span>
                                  <div className="font-extrabold pb-1">System Power Off</div>
                                  <div className="text-[6px] tracking-normal">Turn dial knob or toggle down power switcher</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* VINTAGE CONTROL PANEL - REDUCED TO POWER ONLY */}
                        <div className="hidden md:flex md:col-span-2 bg-gradient-to-b from-stone-900 to-stone-950 p-3 text-center rounded-2xl border-2 border-stone-800 flex-col justify-around items-center font-mono space-y-5">
                          
                          {/* Aesthetic Vintage Ventilation Gaps */}
                          <div className="w-full px-2 space-y-1.5">
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                          </div>

                          {/* SINGLE POWER ROCKER SWITCH WITH BULB MARK */}
                          <div className="flex flex-col items-center space-y-3.5">
                            <div className="flex items-center gap-2">
                              {/* Glowing state neon bulb */}
                              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${tvOn ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.95)]' : tvWarmingUp ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.85)] animate-pulse' : 'bg-stone-850'}`}></div>
                              
                              <div 
                                onClick={() => {
                                  if (tvOn || tvWarmingUp) {
                                    setTvOn(false);
                                    setTvWarmingUp(false);
                                  } else {
                                    setTvOn(true);
                                    setTvWarmingUp(true);
                                  }
                                }}
                                className="w-5.5 h-9 bg-[#111111] border border-stone-700 rounded-md p-0.5 flex flex-col justify-between items-center cursor-pointer relative shadow-inner"
                                title="Toggle TV Power"
                              >
                                <div className="absolute top-1 bottom-1 w-[0.5px] bg-stone-900"></div>
                                <div 
                                  className={`w-3.5 h-3.5 rounded bg-gradient-to-b from-stone-300 via-stone-100 to-stone-450 shadow-md border border-stone-500 transition-all duration-300 z-10 ${
                                    tvOn || tvWarmingUp ? 'translate-y-0' : 'translate-y-4.5'
                                  }`}
                                ></div>
                              </div>
                            </div>
                            <span className="text-[5px] font-mono tracking-widest text-[#d9a520] font-black uppercase leading-none">POWER</span>
                          </div>

                          {/* PHYSICAL AUDIO ROCKER SWITCH */}
                          <div className="flex flex-col items-center space-y-3.5">
                            <div className="flex items-center gap-2">
                              {/* Glowing green audio state bulb */}
                              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${tvOn && tvVolume > 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.95)]' : 'bg-stone-850'}`}></div>
                              
                              <div 
                                onClick={() => {
                                  setTvVolume(prev => {
                                    const nextVol = prev === 0 ? 1 : 0;
                                    if (nextVol > 0) {
                                      setAudioOverlayDismissed(true);
                                    } else {
                                      setAudioOverlayDismissed(false);
                                    }
                                    return nextVol;
                                  });
                                }}
                                className="w-5.5 h-9 bg-[#111111] border border-stone-700 rounded-md p-0.5 flex flex-col justify-between items-center cursor-pointer relative shadow-inner"
                                title="Toggle Sound"
                              >
                                <div className="absolute top-1 bottom-1 w-[0.5px] bg-stone-900"></div>
                                <div 
                                  className={`w-3.5 h-3.5 rounded bg-gradient-to-b from-stone-300 via-stone-100 to-stone-450 shadow-md border border-stone-500 transition-all duration-300 z-10 ${
                                    tvVolume > 0 ? 'translate-y-0' : 'translate-y-4.5'
                                  }`}
                                ></div>
                              </div>
                            </div>
                            <span className="text-[5px] font-mono tracking-widest text-[#d9a520] font-black uppercase leading-none">AUDIO</span>
                          </div>

                          {/* Bottom Decorative Lines */}
                          <div className="w-full px-2 space-y-1.5">
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                            <div className="h-[1.5px] bg-stone-800 w-full opacity-60 rounded-full"></div>
                          </div>

                        </div>
                      </div>

                      {/* Shadow stand decoration */}
                      <div className="retro-tv-shadow-stand w-[85%] h-5 bg-stone-950/55 blur-md rounded-full mt-1 lg:-mt-2"></div>
                    </div>

                    {/* RIGHT COLUMN: SLEEK MIX & MATCH FLYER EXPLAINER COLUMN (Col-span 5) */}
                    <div className="vintage-tv-right-column col-span-12 lg:col-span-5 relative w-full mt-8 lg:mt-0 self-auto lg:self-stretch bg-[#0a1612]/95 border border-[#d9a520]/45 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between text-white backdrop-blur-md h-auto transition-all duration-500 lg:hover:scale-105 hover:shadow-[0_25px_60px_rgba(217,165,32,0.25)] hover:border-[#d9a520]/80 ease-out z-10 lg:hover:z-20 max-w-[480px] lg:max-w-none mx-auto space-y-4">
                      
                      {/* Premium Placeholder Image from Custom-Bundle */}
                      <div className="relative w-full h-48 md:h-52 rounded-2xl overflow-hidden border-2 border-[#d9a520]/50 bg-black/10 shadow-2xl transition-all duration-300 group-hover:border-[#d9a520] select-none">
                        <img 
                          src="/assets/custom-bundle.png" 
                          alt="Mix & Match 3-Jar Box" 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-105 contrast-105 saturate-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/honeybox/400/300';
                          }}
                        />
                      </div>

                      {/* Premium Header */}
                      <div className="text-center pt-1 pb-3 border-b border-dashed border-[#d9a520]/20">
                        <h4 className="font-serif-modern text-2xl md:text-3xl font-black text-[#d9a520] uppercase leading-none tracking-wider italic">
                          Mix & Match 3-Jar Box
                        </h4>
                        <p className="text-[12px] text-stone-300 font-serif-modern italic mt-1.5 leading-none">Choose any three premium flavors below</p>
                      </div>

                      {/* Prominent Pricing Container */}
                      <div className="bg-gradient-to-r from-amber-500/15 via-[#d9a520]/10 to-amber-600/5 border border-[#d9a520]/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden flex-grow my-2">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-[#d9a520]/10 rounded-full blur-xl"></div>
                        <div className="text-[10px] font-black text-[#d9a520] uppercase tracking-[0.2em] leading-none mb-2 text-center font-sans">
                          CRAFT YOUR 3-JAR BOX
                        </div>
                        <div className="flex items-center justify-center gap-5 mt-2">
                          <span className="text-5xl font-black text-[#d9a520] tracking-tight font-serif-modern italic leading-none">$34.99</span>
                          <div className="h-9 w-[1px] bg-stone-700/60"></div>
                          <div className="text-left leading-none">
                            <span className="text-xs tracking-widest font-extrabold text-[#d9a520] uppercase font-sans block">FREE SHIPPING</span>
                            <span className="text-[9.5px] text-stone-300 block mt-1.5 font-serif-modern italic font-bold">Directly from our hive in Norton</span>
                          </div>
                        </div>
                      </div>

                    </div>
                    
                  </div>

                </section>

                {/* THE JESSICA FARMS FLAVOR VAULT & TASTING ROOM */}
                <section className="vintage-tv-product-section bg-stone-50 rounded-[2.5rem] border border-stone-200 p-6 md:p-8 space-y-6 mt-8 md:mt-12 lg:mt-16">
                  
                  {/* Grid header (Fully centered for a balanced look right under the TV showcase) */}
                  <div className="flex flex-col justify-center items-center text-center gap-3 border-b border-stone-200 pb-6 w-full max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9a520] bg-[#1a4332]/5 border border-[#d9a520]/25 px-3.5 py-1.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-[#d9a520] rounded-full animate-ping text-[8px]"></span>
                      Micro-Batch Store
                    </div>
                    <h5 className="text-4xl md:text-5xl font-serif-modern font-black text-forest italic leading-none tracking-tight">The Market Stand</h5>
                    <p className="text-stone-500 font-serif-modern italic text-xs mt-1">Select from our small-batch whipped creamed honeys below to fill your custom box</p>
                  </div>

                  {/* Flavor Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCTS.map((flavor) => {
                      const theme = {
                        h1: { hoverBorder: 'hover:border-amber-600/50' },
                        h2: { hoverBorder: 'hover:border-yellow-950/50' },
                        h3: { hoverBorder: 'hover:border-rose-500/50' },
                        h4: { hoverBorder: 'hover:border-yellow-500/50' },
                        h5: { hoverBorder: 'hover:border-red-650/50' },
                        h6: { hoverBorder: 'hover:border-orange-500/50' },
                        h7: { hoverBorder: 'hover:border-amber-950/50' },
                      }[flavor.id as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'h7'] || { hoverBorder: 'hover:border-honey/50' };

                      return (
                        <div 
                           key={flavor.id} 
                           className={`group bg-[#fdfcf8] rounded-[2.5rem] p-6 border border-stone-200/80 shadow-md ${theme.hoverBorder} hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
                        >
                          <div className="space-y-3">
                            {/* Small stylized placeholder flavor photo */}
                            <div className="w-full aspect-[4/3] rounded-[1.8rem] bg-stone-100 overflow-hidden border border-stone-200/60 relative mb-4 shadow-sm group-hover:shadow-md transition-all duration-305">
                              {/* Soft warm light overlay color blend */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-[#d9a520]/5 to-transparent mix-blend-multiply z-10 pointer-events-none"></div>
                              <img 
                                src={flavor.imageUrl} 
                                alt={flavor.name}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                                onError={(e) => {
                                  // Fallback dynamic seeded picsum image
                                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jessica-${flavor.id}/500/375`;
                                }}
                              />
                            </div>

                            <div>
                              <h6 className="font-serif-modern font-black text-lg text-forest group-hover:text-honey transition-colors leading-tight">{flavor.name}</h6>
                              <div className="h-[2px] w-8 bg-amber-500/20 my-1.5"></div>
                            </div>
                            <p className="text-xs text-stone-500 font-serif-modern leading-relaxed italic">{flavor.description}</p>
                          </div>

                          {/* Control actions */}
                          <div className="mt-6 pt-4 border-t border-stone-100/70 flex flex-col gap-2">
                            <button 
                              onClick={() => {
                                addToBundleSlots(flavor);
                              }}
                              className="w-full text-xs bg-[#1a4332] hover:bg-[#123023] text-white font-black py-3.5 rounded-xl uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>Add to Box</span>
                            </button>
                            <p className="text-[10px] text-stone-400 font-serif-modern italic text-center mt-1 select-none tracking-wide">
                              Small-batch handcrafted honey.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {currentPage === Page.Studio && (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-700 space-y-24">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-forest text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-lg">
                <span className="animate-pulse">●</span> LIVE FROM NORTON
              </div>
              <h2 className="text-6xl md:text-8xl font-serif-modern font-black italic text-forest leading-none">Jessica Farms Studio</h2>
              <p className="text-2xl text-stone-400 font-serif-modern italic leading-relaxed">
                Documenting the rhythm of farm life, from hive checks to the harvest.
              </p>
              <div className="h-[2px] w-24 bg-honey mx-auto"></div>
            </div>

            <section className="bg-stone-900 rounded-[3rem] p-4 md:p-10 shadow-3xl border-8 border-forest/5 tilt-hover">
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl relative group">
                <iframe 
                  width="100%" height="100%" 
                  src={`https://www.youtube.com/embed/${INTRO_VIDEO.id}?autoplay=0&controls=1&modestbranding=1&showinfo=0&iv_load_policy=3`} 
                  title={INTRO_VIDEO.title} frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                  className="opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="pt-12 px-6 grid lg:grid-cols-3 gap-12 text-left">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-4xl font-serif-modern font-black italic text-white uppercase tracking-tight">{INTRO_VIDEO.title}</h3>
                  <p className="text-xl text-stone-300 font-serif-modern italic leading-relaxed">
                    Captured directly on our farm in Norton, Ohio. We show the real work that goes into every jar — raising the bees, tending the land, and the quiet moments in between.
                  </p>
                </div>
                <div className="flex items-center justify-center lg:justify-end">
                  <a href="https://www.youtube.com/@JessicaFarmsStudio" target="_blank" className="btn-honey px-12 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl text-white">
                    Subscribe Now
                  </a>
                </div>
              </div>
            </section>

            {/* FARM LIFE FOCUS */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 p-8">
                <h4 className="text-4xl font-serif-modern font-black italic text-forest uppercase">Raising the Hive</h4>
                <p className="text-xl text-stone-600 font-serif-modern italic leading-relaxed">
                  The Studio is where I share the process of beekeeping. From spring splits to winter prep, you get a front-row seat to the seasonal pulse of the Norton apiary. It's about more than just honey; it's about the connection to the land and the creatures that sustain it.
                </p>
              </div>
              <div className="bg-honey/10 rounded-[3rem] p-12 space-y-6 flex flex-col justify-center border-2 border-honey/20">
                <h4 className="text-3xl font-black uppercase tracking-tighter italic text-forest">Behind the Scenes</h4>
                <p className="text-lg text-stone-500 font-serif-modern italic italic leading-relaxed">
                  Watch as we transform pure nectar into our signature creamed flavors. We document the textures, the sounds, and the real-time progress of our small-batch farm.
                </p>
              </div>
            </div>

            <section className="bg-forest text-white rounded-[3rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
               <p className="text-4xl md:text-6xl font-serif-modern font-bold italic leading-tight max-w-4xl mx-auto relative z-10 drop-shadow-md">
                 "Some videos are documentary. <br/> Some are imagined. <br/> All of it is grounded in care, curiosity, and craft."
               </p>
               <div className="flex flex-col items-center gap-4 relative z-10 pt-4">
                 <div className="h-[1px] w-20 bg-honey/50"></div>
                 <span className="text-[12px] font-typewriter uppercase tracking-[0.5em] text-honey font-black">Norton Studio Universe</span>
               </div>
            </section>
          </div>
        )}

        {currentPage === Page.Play && (
          <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-6xl font-serif-modern font-black italic text-forest uppercase tracking-tighter">BEE BLASTER</h2>
              <p className="text-xl text-stone-400 font-serif-modern italic">Defend the apiary! Blast the invasive flowers in this Asteroids-style adventure.</p>
            </div>
            <GamesSection />
          </div>
        )}

        {currentPage === Page.Contact && (
          <div className="animate-in fade-in duration-700">
            <ContactSection />
          </div>
        )}

        {currentPage === Page.Checkout && !orderComplete && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <Checkout 
              items={cart} 
              onBack={() => setCurrentPage(Page.Shop)} 
              onUpdateQuantity={(productId, newQty) => {
                setCart(prev => 
                  prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item)
                      .filter(item => item.quantity > 0)
                );
              }}
              onSuccess={() => {
                setOrderComplete(true);
                setCart([]);
              }}
            />
          </div>
        )}

        {orderComplete && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-700 pt-10">
            <div className="w-32 h-32 mx-auto">
              <img src="/assets/tractor.png" alt="Tractor" className="w-full h-full object-contain" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
            <h2 className="text-6xl font-serif-modern font-black italic text-forest">Harvest Complete!</h2>
            <p className="text-2xl text-stone-500 font-serif-modern italic">Your payment was successful. We're packing your farm goods with care in Norton, OH.</p>
            <button 
              onClick={() => {
                setOrderComplete(false);
                setCurrentPage(Page.Shop);
              }}
              className="btn-honey px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl"
            >
              Back to Market
            </button>
          </div>
        )}
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="bg-white border-t border-stone-100 py-16 px-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-transparent flex items-center justify-center overflow-hidden relative">
              <img 
                src="/assets/logo.png" 
                alt="Jessica Farms Logo" 
                className="w-full h-full object-contain grayscale opacity-60 relative z-10 hover:opacity-100 hover:scale-105 transition-all duration-300" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }} 
              />
            </div>
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-forest">Jessica Farms</h3>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            <button onClick={() => { setCurrentPage(Page.Home); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-forest transition-colors">Home</button>
            {CONFIG.enableStore && <button onClick={() => { setCurrentPage(Page.Shop); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-forest transition-colors">Shop</button>}
            <button onClick={() => navigateToHomeSection('markets')} className="hover:text-forest transition-colors">Markets</button>
            {CONFIG.enableEducation && <button onClick={() => navigateToHomeSection('education')} className="hover:text-forest transition-colors">Educational Events</button>}
            <button onClick={() => { setCurrentPage(Page.Contact); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-forest transition-colors">Contact</button>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-forest transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-forest transition-colors">Facebook</a>
          </nav>

          <div className="h-[1px] w-20 bg-stone-100"></div>

          <div className="flex flex-col gap-2 items-center">
            <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">Norton, Ohio</p>
            <p className="text-[9px] font-typewriter text-stone-300 uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Jessica Farms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
