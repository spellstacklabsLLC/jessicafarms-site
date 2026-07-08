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
}

const Homepage: React.FC<HomepageProps> = ({ setCurrentPage, onInquireProduct }) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Take 3 popular products for featured display
  const featuredProducts = PRODUCTS.slice(0, 3);

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
            Our Whipped Creamed Favorites
          </h2>
          <p className="text-stone-500 font-serif-modern italic text-sm leading-relaxed">
            Unlike liquid honey, our creamed honeys are slowly spun at precise cool temperatures to develop an incredibly smooth, spreadable velvet texture. Try them in our signature 3-jar wood-crate bundle.
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
                  <span>Build custom box</span>
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
              {/* Our Passion, <br/> */}
The Farm            </h2>
            <div className="h-[2px] w-20 bg-[#d9a520]"></div>
            
            <div className="space-y-6 text-stone-600 font-serif-modern text-lg italic leading-relaxed">
              <p>
              At Jessica Farms, we produce raw honey and small-batch creamed honey from our hives in Norton, Ohio. We believe great honey speaks for itself, so we keep it simple—never overheating or over-processing it. We also enjoy sharing our passion for beekeeping through live observation hives and educational events, helping others discover the incredible world of honey bees.              </p>

           
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
