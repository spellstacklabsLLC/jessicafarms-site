import React, { useState } from 'react';
import { Page, Product } from '../types';
import { PRODUCTS, MARKET_SCHEDULE, CONFIG } from '../constants';
import { 
  ArrowRight, 
  Youtube, 
  MapPin, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Star, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface HomepageProps {
  setCurrentPage: (page: Page) => void;
  onInquireProduct?: (product: Product) => void;
  onShopHotHoney?: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ setCurrentPage, onInquireProduct, onShopHotHoney }) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Take 3 popular products for featured display
  const featuredProducts = PRODUCTS.slice(0, 3);

  const handleShopHotHoney = () => {
    if (onShopHotHoney) {
      onShopHotHoney();
    } else {
      setCurrentPage(Page.Shop);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const reviews = [
    {
      name: "Arthur Pendelton",
      location: "Norton, OH",
      rating: 5,
      text: "The Cinnamon Creamed Honey is an absolute masterpiece. We spread it on sourdough every Saturday morning after buying a jar at the town square market. Authentic and local!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Clara Vance",
      location: "Medina, OH",
      rating: 5,
      text: "Jessica Farms has the friendliest stand. The live observation hive was a massive hit with my kids, and the Strawberry Creamed Honey is out of this world.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      name: "Devon Miller",
      location: "Akron, OH",
      rating: 5,
      text: "Pure, delicious honey, and a wonderful family behind it. Following their YouTube channel makes you appreciate the incredible effort and care that goes into every single bottle.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120"
    }
  ];

  return (
    <div className="space-y-28 md:space-y-36 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-[3rem] overflow-hidden bg-stone-950 text-white min-h-[600px] md:min-h-[700px] flex items-center shadow-3xl border-4 border-forest/10 mx-auto max-w-6xl">
        {/* Background Image with Ambient Overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/farm-hero.jpg" 
            alt="Norton Farm Apiary" 
            className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-110 saturate-75 scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122e22] via-[#1a4332]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl px-8 md:px-16 lg:px-24 py-16 md:py-24 space-y-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#d9a520]/25 text-[#fdfcf8] border border-[#d9a520]/40 rounded-full text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d9a520] animate-pulse" />
            Pure Handcrafted Harvest
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif-modern font-black italic tracking-tight leading-[1.05] text-[#fdfcf8] drop-shadow-md">
              Small-Batch Honey <br/>
              <span className="text-[#d9a520]">from Norton, Ohio</span>
            </h1>
            <p className="text-stone-200 text-lg md:text-2xl font-serif-modern italic max-w-2xl leading-relaxed opacity-95">
              Welcome to Jessica Farms, a family-run apiary dedicated to raising healthy honey bees, crafting premium creamed honeys, and sharing the wonder of the hive.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => {
                setCurrentPage(Page.Shop);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-honey px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2 group transition-all"
            >
              <span>Shop Honey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => scrollToSection('markets')}
              className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-[#fdfcf8] px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Upcoming Markets
            </button>

            <button 
              onClick={() => scrollToSection('youtube')}
              className="bg-[#1a4332]/50 hover:bg-[#1a4332] border border-[#d9a520]/30 hover:border-[#d9a520] text-[#fdfcf8] px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
              Watch Studio
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED HOT HONEY SECTION */}
      <section className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#1b120c] via-[#241710] to-[#120a06] text-[#fdfcf8] shadow-3xl border-4 border-[#d9a520]/30 mx-auto max-w-6xl p-8 md:p-12 lg:p-16">
        {/* Ambient Warm Golden & Pepper Glow Effects */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#d9a520]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-red-650/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Product Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden border-2 border-[#d9a520]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group bg-stone-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none"></div>
              <img 
                src="/assets/hot-honey.jpg" 
                alt="Jessica Farms Hot Honey" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-105 contrast-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'assets/hothoneypromo2.png';
                }}
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#d9a520] text-[#1a4332] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  Sweet Heat
                </span>
              </div>
            </div>
          </div>

          {/* Product Information & Order CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#d9a520]/15 text-[#d9a520] border border-[#d9a520]/30 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
              <Sparkles className="w-3.5 h-3.5 text-[#d9a520]" />
              Featured Release
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif-modern font-black italic tracking-tight leading-tight text-[#fdfcf8]">
                Jessica Farms Hot Honey
              </h2>
              <p className="text-stone-300 text-base md:text-xl font-serif-modern italic leading-relaxed">
                Made with real honey, habanero & ghost peppers.
              </p>
              <p className="text-[#d9a520] text-lg md:text-2xl font-serif-modern font-black italic">
                Sweet heat with a serious kick.
              </p>
            </div>

            {/* Direct Shop CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6">
              <button 
                onClick={handleShopHotHoney}
                className="bg-[#d9a520] hover:bg-[#c4951b] text-[#1a4332] px-8 py-4.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2.5 group transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span>Shop Hot Honey</span>
                <ArrowRight className="w-4 h-4 text-[#1a4332] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9a520] bg-[#1a4332]/5 border border-[#d9a520]/25 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-[#d9a520]" />
            From the Hive to Your Table
          </div>
          <h2 className="text-4xl md:text-5xl font-serif-modern font-black text-forest italic leading-none tracking-tight">
            Our Creamed Honey Favorites
          </h2>
          <p className="text-stone-500 font-serif-modern italic text-sm leading-relaxed">
            Unlike liquid honey, our creamed honeys are slowly spun at precise cool temperatures to develop an incredibly smooth, spreadable velvet texture. Handcrafted in small batches in Norton, Ohio.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((flavor) => (
            <div 
              key={flavor.id} 
              className="group bg-white rounded-[2.5rem] p-6 border border-stone-200/80 shadow-md hover:border-[#d9a520]/45 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="w-full aspect-[4/3] rounded-[1.8rem] bg-stone-100 overflow-hidden border border-stone-200/60 relative mb-4 shadow-sm group-hover:shadow-md transition-all duration-305">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#d9a520]/5 to-transparent mix-blend-multiply z-10 pointer-events-none"></div>
                  <img 
                    src={flavor.imageUrl} 
                    alt={flavor.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jessica-${flavor.id}/500/375`;
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-serif-modern font-black text-xl text-forest group-hover:text-[#d9a520] transition-colors leading-tight">
                    {flavor.name}
                  </h3>
                  <div className="h-[2px] w-8 bg-amber-500/20 my-2"></div>
                  <p className="text-xs text-stone-500 font-serif-modern leading-relaxed italic">
                    {flavor.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setCurrentPage(Page.Shop);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-xs bg-[#1a4332] hover:bg-[#123023] text-white font-black py-4 rounded-xl uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Shop Flavors • $10</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View Shop Call to Action */}
        <div className="text-center pt-4">
          <button 
            onClick={() => {
              setCurrentPage(Page.Shop);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-transparent hover:bg-forest/5 text-forest border-2 border-forest/80 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <span>Browse Full Market Stand</span>
            <ChevronRight className="w-4 h-4 text-[#d9a520]" />
          </button>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="bg-white border-y border-stone-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9a520] bg-[#1a4332]/5 px-3 py-1 rounded-full">
              Established in Norton, Ohio
            </div>
            <h2 className="text-4xl md:text-6xl font-serif-modern font-black italic text-forest leading-none uppercase tracking-tight">
              Our Passion, <br/>
              Our Apiary.
            </h2>
            <div className="h-[2px] w-20 bg-[#d9a520]"></div>
            
            <div className="space-y-6 text-stone-600 font-serif-modern text-lg italic leading-relaxed">
              <p>
                At Jessica Farms, beekeeping is more than a trade—it's our way of honoring the intricate and vital rhythm of nature. Nestled in our sunny pocket of Norton, Ohio, we watch our hives thrive on a vibrant palette of local wildflower clover, goldenrod, and basswood blooms.
              </p>
              <p>
                We believe that pure, raw honey shouldn't be over-processed, boiled, or stripped of its natural beneficial pollens. That is why we harvest with extreme patience and whip our creamed honeys using cold-churn methods to preserve absolute flavor purity.
              </p>
              <p>
                Beyond creating elegant products, we are deeply committed to community education. Through live observation hives and behind-the-scenes sharing, we hope to foster deep curiosity and love for these magnificent pollinators.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-12 gap-4 relative">
            <div className="absolute -inset-4 bg-[#d9a520]/5 rounded-[3.5rem] -rotate-2 -z-10"></div>
            
            <div className="col-span-8 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="/assets/apiary.jpg" 
                alt="Working in the Apiary" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>

            <div className="col-span-4 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative aspect-[3/4] mt-12 transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="/assets/farm-hero.jpg" 
                alt="Jessica Farms Fields" 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400';
                }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. FOLLOW OUR JOURNEY (YOUTUBE FEATURE) */}
      <section id="youtube" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="bg-stone-900 rounded-[3.5rem] p-8 md:p-14 border border-stone-800 shadow-3xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d9a520]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* YouTube Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-red-600/20 text-red-500 border border-red-600/35 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Youtube className="w-4.5 h-4.5 fill-red-500" />
                Jessica Farms Studio
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif-modern font-black italic tracking-tight leading-tight uppercase">
                  Follow Our Journey
                </h2>
                <p className="text-stone-300 font-serif-modern italic text-lg leading-relaxed">
                  We document the beautiful, raw reality of small-batch farm life. Subscribe to peek behind the veil of our Norton apiary and follow our farm projects.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d9a520]">What We Feature:</h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-serif-modern italic text-stone-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Honey Harvests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Swarm Captures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Queen Rearing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Hive Inspections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Farm Restoration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#d9a520] shrink-0" />
                    <span>Flavor Testing</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <a 
                  href="https://www.youtube.com/@JessicaFarmsStudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-black px-10 py-5 rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  <span>Subscribe on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* Video Preview */}
            <div className="lg:col-span-7">
              <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border-4 border-stone-800 shadow-2xl relative group cursor-pointer">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/YU3XNKGCLeg?autoplay=0&controls=1&modestbranding=1" 
                  title="Jessica Farms Feature Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. UPCOMING MARKETS SECTION */}
      <section id="markets" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9a520] bg-[#1a4332]/5 px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#d9a520]" />
                Support Local Agriculture
              </div>
              <h2 className="text-4xl md:text-5xl font-serif-modern font-black text-forest italic leading-none tracking-tight">
                Upcoming Farmers Markets
              </h2>
              <p className="text-stone-500 font-serif-modern italic text-sm">
                Come taste our micro-batch creamed honeys in person and talk bees with us!
              </p>
            </div>

            <button 
              onClick={() => setShowFullSchedule(true)}
              className="bg-transparent hover:bg-forest/5 text-forest border-2 border-forest px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#d9a520]" />
              <span>View Full Schedule</span>
            </button>
          </div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKET_SCHEDULE.map((market, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#d9a520]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-forest/5 text-forest rounded-2xl flex items-center justify-center text-lg shadow-inner">
                    🎪
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif-modern font-black text-lg text-forest leading-tight group-hover:text-[#d9a520]">
                      {market.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#d9a520] font-black uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>{market.day}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-serif-modern italic text-stone-500 leading-relaxed">
                    {market.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                  <div className="flex items-start gap-1.5 text-stone-600">
                    <MapPin className="w-4.5 h-4.5 text-[#d9a520] shrink-0 mt-0.5" />
                    <span className="text-[10px] font-serif-modern italic font-semibold leading-normal">{market.location}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider pl-6">
                    {market.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDUCATIONAL BEE EXPERIENCES */}
      {CONFIG.enableEducation && (
        <section id="education" className="bg-gradient-to-br from-[#1a4332] to-[#122e22] text-[#fdfcf8] rounded-[3.5rem] overflow-hidden max-w-6xl mx-auto shadow-3xl border border-white/5 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d9a520]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid lg:grid-cols-2">
            {/* Slogan and details */}
            <div className="p-8 md:p-16 lg:p-20 space-y-8 flex flex-col justify-center text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#d9a520]/25 text-[#fdfcf8] border border-[#d9a520]/40 rounded-full text-[10px] font-black uppercase tracking-widest self-start">
                <BookOpen className="w-4 h-4 text-[#d9a520]" />
                Fostering Curious Minds
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-serif-modern font-black italic tracking-tight leading-none uppercase text-[#fdfcf8]">
                  Educational <br/>
                  Bee Experiences
                </h2>
                <p className="text-stone-200 text-lg md:text-xl font-serif-modern italic leading-relaxed opacity-90">
                  Witness the secret world of the honey bee through our safe, portable live observation hive. We bring educational demonstrations directly to your community.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d9a520]">Perfect for:</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-serif-modern italic text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[#d9a520] text-sm">🎒</span> Schools & STEM Classes
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d9a520] text-sm">🍂</span> Fall & Harvest Festivals
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d9a520] text-sm">👵</span> Nursing Homes & Centers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d9a520] text-sm">🌼</span> Community & Green Events
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => {
                    setCurrentPage(Page.Contact);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-honey px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl"
                >
                  Book a Demonstration
                </button>
              </div>
            </div>

            {/* Visual element / Graphic overlay */}
            <div className="relative border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden min-h-[300px] lg:min-h-[500px]">
              <img 
                src="/assets/apiary.jpg" 
                alt="Jessica Farms Live Observation Demonstration" 
                className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-75"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800';
                }}
              />
              {/* Observation Hive overlay box */}
              <div className="absolute bottom-6 left-6 right-6 bg-stone-900/90 backdrop-blur-md border border-stone-800 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d9a520]">
                  <Info className="w-3.5 h-3.5 text-[#d9a520]" />
                  Portable Observation Hive
                </div>
                <p className="text-[11px] font-serif-modern italic text-stone-300 leading-relaxed">
                  Our custom-built wood and safety-glass enclosure allows curious observers to spot the queen bee, watch active foraging dances, and explore honeycomb honey-storing cells from mere inches away—completely risk-free!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* INTEGRATED MARKET SCHEDULE MODAL */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
          <div className="bg-[#fdfcf8] rounded-[2.5rem] border-4 border-forest/10 p-8 md:p-10 max-w-2xl w-full shadow-3xl text-stone-800 space-y-6 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowFullSchedule(false)}
              className="absolute top-6 right-8 text-stone-400 hover:text-stone-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#d9a520]">Jessica Farms</span>
              <h3 className="text-3xl md:text-4xl font-serif-modern font-black text-forest italic leading-none">
                Farmers Market Calendar
              </h3>
              <p className="text-xs text-stone-500 font-serif-modern italic">
                Support your local beekeeper! We setup our vintage handcrafted stands weekly.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {MARKET_SCHEDULE.map((market, idx) => (
                <div key={idx} className="p-4 bg-stone-50 border border-stone-200/60 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-serif-modern font-black text-base text-forest">
                      {market.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-[#d9a520]" />
                      <span>{market.location}</span>
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <div className="text-xs font-black text-[#d9a520] uppercase tracking-wider">
                      {market.day}
                    </div>
                    <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider mt-0.5">
                      {market.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button 
                onClick={() => setShowFullSchedule(false)}
                className="bg-[#1a4332] hover:bg-[#123023] text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-md cursor-pointer"
              >
                Close Calendar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Homepage;
