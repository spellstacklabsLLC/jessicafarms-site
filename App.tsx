import React, { useState, useEffect } from 'react';
import { Page, Product, CartItem } from './types';
import { PRODUCTS, INTRO_VIDEO, CONFIG } from './constants';
import GamesSection from './components/Games';
import Checkout from './components/Checkout';
import InquiryModal from './components/InquiryModal';
import ContactSection from './components/ContactSection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Farm);
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
                 className="w-full h-full object-contain relative z-10" 
                 referrerPolicy="no-referrer" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).style.opacity = '0';
                 }} 
               />
               <img 
                 src="https://picsum.photos/seed/jessicafarms-logo/200/200" 
                 alt="Farm Placeholder" 
                 className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" 
                 referrerPolicy="no-referrer" 
               />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none text-forest">Jessica Farms</h1>
              <p className="text-[10px] font-typewriter uppercase text-honey font-bold">Norton, Ohio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {CONFIG.enableStore && currentPage !== Page.Checkout && cartCount > 0 && (
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
            <NavLink page={Page.Farm} label="Farm" emoji="🏠" />
            {CONFIG.enableStore && <NavLink page={Page.Shop} label="Shop" emoji="🛒" />}
            <NavLink page={Page.Studio} label="Studio" emoji="🎥" />
            <NavLink page={Page.Play} label="Play" emoji="🎮" />
            <NavLink page={Page.Contact} label="Contact" emoji="📫" />
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-6">
        
        {currentPage === Page.Farm && (
          <div className="max-w-6xl mx-auto space-y-32 animate-in fade-in duration-700">
            {/* HERO */}
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
                    "raising bees, koi, and healthy plants with heart in our corner of Ohio."
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
                    Our bees forage on local wildflowers, producing raw honey that captures the essence of our hometown.
                  </p>
                </div>
                <div className="relative group tilt-hover cursor-pointer">
                  <div className="absolute -inset-2 bg-honey/10 rounded-[3rem] rotate-3 -z-10 transition-transform group-hover:rotate-6"></div>
                  <div className="rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                    <img src="/assets/apiary.jpg" alt="Apiary" className="w-full h-full object-cover" />
                  </div>
                </div>
              </section>

              <section className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="lg:order-2 space-y-8">
                   <div className="inline-flex items-center gap-4 border-b-2 border-forest pb-2">
                    <img src="/assets/koi-icon.png" alt="Koi" className="w-12 h-12 object-contain tilt-hover" referrerPolicy="no-referrer" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic text-forest">Ornamental Koi</h3>
                  </div>
                  <p className="text-2xl text-stone-600 font-serif-modern leading-relaxed italic">
                    Transform your pond into a sanctuary with our vibrant, healthy, hand-selected varieties.
                  </p>
                  {CONFIG.enableStore && (
                    <button onClick={()=>setCurrentPage(Page.Shop)} className="btn-honey px-8 py-4 rounded-xl text-[10px] text-white font-black uppercase">View Selection</button>
                  )}
                </div>
                <div className="lg:order-1 relative group tilt-hover cursor-pointer">
                  <div className="absolute -inset-2 bg-forest/5 rounded-[3rem] -rotate-3 -z-10 transition-transform group-hover:-rotate-6"></div>
                  <div className="rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                    <img src="/assets/koi-pond.jpg" alt="Koi" className="w-full h-full object-cover" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {currentPage === Page.Shop && (
          <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-6 duration-500 space-y-24">
            {!CONFIG.enableStore ? (
              <div className="text-center py-20 space-y-8">
                <div className="w-48 h-48 mx-auto bg-honey/5 rounded-full flex items-center justify-center border-4 border-dashed border-honey/20">
                  <span className="text-8xl animate-bounce">📦</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-6xl font-serif-modern font-black italic text-forest">Market Stand <br/> Coming Soon</h2>
                  <p className="text-stone-400 font-serif-modern italic text-xl max-w-lg mx-auto">
                    We're currently preparing our seasonal harvest. Check back soon for Norton-grown honey, koi, and plants!
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
                <div className="text-center space-y-4">
                  <h2 className="text-6xl font-serif-modern font-black italic text-forest">Market Stand</h2>
                  <p className="text-stone-400 font-serif-modern italic text-xl">Freshly harvested in Norton, Ohio.</p>
                </div>
                {['bees', 'koi', 'plants', 'apparel'].map((cat) => (
                  <section key={cat} className="space-y-12">
                    <div className="flex items-center gap-6">
                      <h3 className="text-3xl font-black uppercase tracking-tighter italic text-forest pr-4">{cat}</h3>
                      <div className="flex-grow h-[1px] bg-forest/10"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                      {PRODUCTS.filter(p => p.category === cat).map(product => (
                        <div key={product.id} className="group bg-white rounded-[2rem] border border-forest/5 shadow-md overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl">
                          <div className="aspect-square overflow-hidden bg-stone-50 relative">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
                            {cat === 'koi' && (
                              <div className="absolute top-4 right-4 bg-forest/80 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                Inquiry Only
                              </div>
                            )}
                          </div>
                          <div className="p-8 space-y-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-lg uppercase tracking-tight text-forest">{product.name}</h4>
                              <span className="font-black text-xs text-honey bg-honey/5 px-3 py-1 rounded-full border border-honey/20">
                                {cat === 'koi' ? 'Variable' : product.price}
                              </span>
                            </div>
                            <p className="text-sm text-stone-500 italic font-serif-modern leading-relaxed">{product.description}</p>
                            
                            {cat === 'koi' ? (
                              <button 
                                onClick={() => setActiveInquiry(product)}
                                className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 text-forest border-2 border-forest hover:bg-forest hover:text-white transition-all shadow-md active:scale-95"
                              >
                                Check Stock
                              </button>
                            ) : (
                              <button 
                                onClick={() => addToCart(product)}
                                className="btn-honey w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 text-white"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
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
                Real life, imagined worlds, and everything between.
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
              <div className="pt-12 px-6 grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-4xl font-serif-modern font-black italic text-white uppercase tracking-tight">{INTRO_VIDEO.title}</h3>
                  <p className="text-xl text-stone-300 font-serif-modern italic leading-relaxed">
                    We share a living Ohio farm alongside original music, surreal animation, and cinematic Shorts — blending real animals, real work, and fictional worlds into one evolving universe.
                  </p>
                </div>
                <div className="flex items-center justify-center lg:justify-end">
                  <a href="https://www.youtube.com/@JessicaFarmsStudio" target="_blank" className="btn-honey px-12 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl text-white">
                    Subscribe Now
                  </a>
                </div>
              </div>
            </section>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Bernie in the Woods", emoji: "🐺", desc: "Quiet forest walks, eerie moments, and daily adventures with our rescue dog." },
                { title: "Impossible Machines", emoji: "🚜", desc: "Hyper-real farm machines that process things a little too far. Surreal mechanics." },
                { title: "Farmyard Friends", emoji: "🐱", desc: "Small, peaceful moments from an imagined farm world centered on our real animals." },
                { title: "The Cat World", emoji: "🎶", desc: "Original music films and animated stories set in a surreal cat universe." },
                { title: "Apiary growth", emoji: "🐝", desc: "Hive checks and seasonal farm work. The pulse of the honey harvest." },
                { title: "Documentary", emoji: "🌾", desc: "Real farm life. Animals, land, and the slow work of building something real." }
              ].map((chapter, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border-2 border-forest/5 shadow-md flex flex-col gap-4 group hover:border-honey transition-all hover:shadow-xl tilt-hover">
                   <span className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all">{chapter.emoji}</span>
                   <h4 className="text-xl font-black uppercase tracking-tight text-forest italic">{chapter.title}</h4>
                   <p className="text-sm text-stone-500 font-serif-modern italic leading-relaxed">{chapter.desc}</p>
                </div>
              ))}
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
                setCurrentPage(Page.Farm);
              }}
              className="btn-honey px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl"
            >
              Back to the Farm
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
            <button onClick={() => setCurrentPage(Page.Farm)} className="hover:text-forest transition-colors">Farm</button>
            {CONFIG.enableStore && <button onClick={() => setCurrentPage(Page.Shop)} className="hover:text-forest transition-colors">Shop</button>}
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