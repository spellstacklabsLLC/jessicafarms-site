
import React, { useState, useEffect } from 'react';
import { Page, Product, CartItem } from './types';
import { PRODUCTS, INTRO_VIDEO, CONFIG } from './constants';
import GamesSection from './components/Games';
import Checkout from './components/Checkout';
import InquiryModal from './components/InquiryModal';
import ContactSection from './components/ContactSection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Shop);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCanceled, setOrderCanceled] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Product | null>(null);

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
    if ((currentPage === Page.Studio || currentPage === Page.Farm) && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-18004717987/SBohCOL8vK8cEKPjqIlD',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  }, [currentPage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
              setCurrentPage(Page.Farm);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-4 cursor-pointer group tilt-hover"
          >
            <div className="w-14 h-14 bg-white border-2 border-forest rounded-xl flex items-center justify-center shadow-md overflow-hidden p-2 relative">
               <img 
                 src="/assets/logo.png" 
                 alt="Jessica Farms Logo" 
                 className="w-full h-full object-contain" 
                 referrerPolicy="no-referrer" 
               />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none text-forest">Jessica Farms</h1>
              <p className="text-[10px] font-typewriter uppercase text-honey font-bold">Norton, Ohio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {CONFIG.enableStore && currentPage !== Page.Checkout && currentPage !== Page.Shop && cartCount > 0 && (
              <button 
                onClick={() => setCurrentPage(Page.Checkout)}
                className="flex items-center gap-2 bg-honey text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all"
              >
                🛒 {cartCount} Items
              </button>
            )}

            <button 
              className="lg:hidden p-3 text-forest bg-white rounded-xl border-2 border-forest/20 shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`
            fixed lg:static top-[88px] left-0 w-full lg:w-auto 
            bg-white lg:bg-transparent p-6 lg:p-0 border-b lg:border-0 border-forest/10
            flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4
            transition-all duration-300 transform z-[100]
            ${mobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible lg:translate-y-0 lg:visible lg:opacity-100'}
          `}>
            {CONFIG.enableStore && <NavLink page={Page.Shop} label="Shop" emoji="🛒" />}
            <NavLink page={Page.Farm} label="About" emoji="🏠" />
            <NavLink page={Page.Studio} label="Studio" emoji="🎥" />
            <NavLink page={Page.Play} label="Play" emoji="🎮" />
            <NavLink page={Page.Contact} label="Contact" emoji="📫" />
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-6">
        
        {currentPage === Page.Farm && (
          <div className="max-w-6xl mx-auto space-y-32 animate-in fade-in duration-700">
            {/* ABOUT HERO */}
            <section className="relative group overflow-hidden bg-white rounded-[3rem] border-2 border-forest/10 shadow-xl">
              <div className="grid lg:grid-cols-2 min-h-[550px]">
                <div className="relative border-b-2 lg:border-b-0 lg:border-r-2 border-forest/5 overflow-hidden">
                  <img 
                    src="/assets/farm-hero.jpg" 
                    alt="Norton Farm" 
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                  />
                </div>
                <div className="p-12 lg:p-20 flex flex-col justify-center space-y-8 bg-white">
                  <h2 className="text-5xl lg:text-8xl font-serif-modern font-black italic leading-none text-forest">
                    The Honey <br/> Life.
                  </h2>
                  <p className="text-2xl font-medium leading-relaxed text-stone-500 font-serif-modern italic">
                    "raising bees and crafting small-batch creamed honey with heart in our corner of Ohio."
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    {CONFIG.enableStore && (
                      <button onClick={()=>setCurrentPage(Page.Shop)} className="btn-honey px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white">Explore Shop</button>
                    )}
                    <button onClick={()=>setCurrentPage(Page.Studio)} className="tilt-hover bg-white hover:bg-forest/5 text-forest border-2 border-forest px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest">Farm Studio</button>
                  </div>
                </div>
              </div>
            </section>

            {/* FARM SECTIONS */}
            <div className="space-y-48">
              <section className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-4 border-b-2 border-honey pb-2">
                    <img src="/assets/honey-icon.png" alt="Honey" className="w-12 h-12 object-contain tilt-hover" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic text-forest">Norton Apiary</h3>
                  </div>
                  <p className="text-2xl text-stone-600 font-serif-modern leading-relaxed italic">
                    Our bees forage on local wildflowers, producing raw honey that we transform into silky creamed treats in a variety of seasonal flavors.
                  </p>
                </div>
                <div className="relative group tilt-hover cursor-pointer">
                  <div className="absolute -inset-2 bg-honey/10 rounded-[3rem] rotate-3 -z-10 transition-transform group-hover:rotate-6"></div>
                  <div className="rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                    <img src="/assets/apiary.jpg" alt="Apiary" className="w-full h-full object-cover" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {currentPage === Page.Shop && (
          <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-6 duration-500 space-y-12">
            {!CONFIG.enableStore ? (
              <div className="text-center py-20 space-y-8">
                <div className="w-48 h-48 mx-auto bg-honey/5 rounded-full flex items-center justify-center border-4 border-dashed border-honey/20">
                  <span className="text-8xl animate-bounce">📦</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-6xl font-serif-modern font-black italic text-forest">Market Stand <br/> Coming Soon</h2>
                  <p className="text-stone-400 font-serif-modern italic text-xl max-w-lg mx-auto">
                    We're currently preparing our seasonal harvest. Check back soon for Norton-grown creamed honey!
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentPage(Page.Contact)}
                  className="btn-honey px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl"
                >
                  Inquire Directly
                </button>
              </div>
            ) : (
              <>
                <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-forest/10 py-6 mb-12 -mx-6 px-6">
                  <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-3xl md:text-5xl font-serif-modern font-black italic text-forest leading-tight">Market Stand</h2>
                      <p className="text-stone-400 font-serif-modern italic text-sm md:text-lg">Freshly harvested in Norton, Ohio.</p>
                    </div>
                    {cartCount > 0 && (
                      <button 
                        onClick={() => setCurrentPage(Page.Checkout)}
                        className="flex items-center gap-2 bg-honey text-white px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all flex-shrink-0"
                      >
                        🛒 {cartCount} Items
                      </button>
                    )}
                  </div>
                </div>

                {/* FEATURED MARKET VIDEO */}
                <section className="mb-24 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-stone-900 aspect-video max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-1000 relative group">
                  <div className="absolute inset-0 bg-forest/20 group-hover:opacity-0 transition-opacity pointer-events-none z-10"></div>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${INTRO_VIDEO.id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`} 
                    title="Market Stand Experience" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full relative z-0"
                  />
                </section>

                <div className="bg-forest text-white p-8 rounded-[2rem] text-center max-w-4xl mx-auto shadow-xl border-4 border-honey/20 animate-in fade-in slide-in-from-top-4 duration-700">
                  <h3 className="text-2xl font-serif-modern font-black italic mb-2 uppercase tracking-tighter">Market Special</h3>
                  <p className="text-xl font-serif-modern italic opacity-90 leading-relaxed">
                    Mix & Match: <span className="text-honey font-black text-3xl mx-2">Any 3 for $24.99</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-widest mt-2 text-honey/60">Limited time harvest offer</p>
                </div>

                <section className="space-y-12">
                  <div className="flex items-center gap-6">
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-forest pr-4">From the Hive</h3>
                    <div className="flex-grow h-[1px] bg-forest/10"></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-10">
                    {PRODUCTS.map(product => (
                      <div key={product.id} className="group bg-white rounded-[2rem] border border-forest/5 shadow-md overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl">
                        <div className="aspect-square overflow-hidden bg-stone-50 relative">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-8 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-black text-lg uppercase tracking-tight text-forest">{product.name}</h4>
                            <span className="font-black text-xs text-honey bg-honey/5 px-3 py-1 rounded-full border border-honey/20">
                              {product.price}
                            </span>
                          </div>
                          <p className="text-sm text-stone-500 italic font-serif-modern leading-relaxed">{product.description}</p>
                          
                          <button 
                            onClick={() => addToCart(product)}
                            className="btn-honey w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 text-white"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
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
                  src={`https://www.youtube.com/embed/${INTRO_VIDEO.id}?autoplay=0&controls=1&modestbranding=1`} 
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
                  Watch as we transform raw nectar into our signature creamed flavors. We document the textures, the sounds, and the real-time progress of our small-batch farm.
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
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border-2 border-stone-100 rounded-lg flex items-center justify-center shadow-sm overflow-hidden p-1 relative">
              <img 
                src="/assets/logo.png" 
                alt="Jessica Farms Logo" 
                className="w-full h-full object-contain grayscale opacity-50 relative z-10" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }} 
              />
              <img 
                src="https://picsum.photos/seed/jessicafarms-footer/200/200" 
                alt="Farm Placeholder" 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 z-0" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-forest">Jessica Farms</h3>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            {CONFIG.enableStore && <button onClick={() => setCurrentPage(Page.Shop)} className="hover:text-forest transition-colors">Shop</button>}
            <button onClick={() => setCurrentPage(Page.Farm)} className="hover:text-forest transition-colors">About</button>
            <button onClick={() => setCurrentPage(Page.Studio)} className="hover:text-forest transition-colors">Studio</button>
            <button onClick={() => setCurrentPage(Page.Play)} className="hover:text-forest transition-colors">Play</button>
            <button onClick={() => setCurrentPage(Page.Contact)} className="hover:text-forest transition-colors">Contact</button>
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
