'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ChevronRight, ChevronLeft, Sparkles, Percent, ShieldCheck, Clock } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

const BANNERS = [
  {
    id: 1,
    title: 'خصم خاص 15% على اللحوم البلدي',
    subtitle: 'لحوم عجل وغنم طازجة يومياً مقطعة حسب رغبتك ومغلفة تفريغ هواء للحفاظ على الطزاجة.',
    badge: '🔥 العرض الأكثر طلباً',
    code: 'ABOHASHIM15',
    gradient: 'from-rose-950 via-rose-900 to-rose-950',
    accentColor: 'text-amber-300',
    btnColor: 'bg-amber-400 text-rose-950 hover:bg-amber-300',
    emoji: '🥩',
  },
  {
    id: 2,
    title: 'تشكيلة الألبان والأجبان الطازجة',
    subtitle: 'قيمر، قشطة عربية، وجبن حلوم بلدي طازج يومياً من مزارعنا مباشرة لباب بيتك.',
    badge: '🥛 إنتاج اليوم الطازج',
    code: 'FRESHDAIRY',
    gradient: 'from-rose-900 via-rose-850 to-rose-950',
    accentColor: 'text-amber-300',
    btnColor: 'bg-white text-rose-950 hover:bg-slate-100',
    emoji: '🧀',
  },
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide];

  return (
    <section className="relative my-3 sm:my-5 mx-4 sm:mx-6 lg:mx-8">
      {/* Dynamic Slide Container */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${banner.gradient} text-white p-6 sm:p-10 shadow-xl border border-rose-900/40 transition-all duration-500`}>
        {/* Glow & Pattern overlays */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Content side */}
          <div className="flex-1 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-xs font-bold text-amber-300 mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{banner.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              {banner.title}
            </h1>

            <p className="text-slate-200 text-xs sm:text-base font-medium leading-relaxed mb-6">
              {banner.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer ${banner.btnColor}`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>اطلب الآن</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </button>

              <div className="bg-black/30 border border-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">كود الخصم:</span>
                <span className="font-mono font-bold text-amber-300 select-all">{banner.code}</span>
              </div>
            </div>
          </div>

          {/* Visual Emoji / Icon Illustration side */}
          <div className="shrink-0 flex items-center justify-center relative">
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-6xl sm:text-8xl shadow-2xl animate-pulse-glow">
              {banner.emoji}
            </div>
          </div>
        </div>

        {/* Carousel Controls & Indicators */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>جودة مضمونة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>توصيل سريع</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/30'
                  }`}
                  aria-label={`الشريحة ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
