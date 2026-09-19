'use client';

import React from 'react';
import { ShoppingCart, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-12 sm:py-16 md:py-20 my-4 sm:my-6 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-xl border border-slate-800">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 opacity-95"></div>

      {/* Decorative Radial glow behind hero text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>طازج كل يوم... يوصل لباب بيتك</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-5">
          متجر <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">أبو هاشم</span>
          <br className="hidden sm:inline" /> للحوم والألبان والأجبان
        </h1>

        {/* Subtitle / Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-8">
          أفخر أنواع اللحوم البلدي الطازجة المقطعة بعناية، مع تشكيلة يومية من الألبان والأجبان الطبيعية والمنتجات البلدية الموثوقة.
        </p>

        {/* Main CTA */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>تسوق الآن</span>
          </button>
        </div>

        {/* Key Features Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80 text-xs sm:text-sm font-medium">
          <div className="flex items-center justify-center gap-2.5 bg-slate-800/40 border border-slate-700/40 py-3 px-4 rounded-2xl backdrop-blur-xs text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>منتجات بلديّة 100% طازجة</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 bg-slate-800/40 border border-slate-700/40 py-3 px-4 rounded-2xl backdrop-blur-xs text-slate-200">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>توصيل سريع ومباشر</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 bg-slate-800/40 border border-slate-700/40 py-3 px-4 rounded-2xl backdrop-blur-xs text-slate-200">
            <Award className="w-4 h-4 text-teal-400 shrink-0" />
            <span>أعلى معايير الجودة والتغليف</span>
          </div>
        </div>

      </div>
    </section>
  );
};
