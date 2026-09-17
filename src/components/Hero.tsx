'use client';

import React from 'react';
import { ArrowDown, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden py-12 md:py-20 rounded-b-3xl shadow-lg">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-200 mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>جودة بلديّة طازجة يومياً</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          متجر <span className="text-amber-400">أبو هاشم</span> للحوم والألبان
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100 font-normal leading-relaxed mb-8">
          اطلب أفخر وأجود أنواع اللحوم الطازجة، الألبان والمنتجات البلدية، والأجبان اليومية المقرمشة بتوصيل سريع ومباشر إلى باب منزلكم.
        </p>

        {/* Call to action button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base sm:text-lg px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>تصفح المنتجات</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Features highlights */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-emerald-700/50 text-xs sm:text-sm text-emerald-100 font-medium">
          <div className="flex items-center justify-center gap-2 bg-emerald-950/30 py-2.5 px-3 rounded-xl backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>منتجات بلدية 100%</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-emerald-950/30 py-2.5 px-3 rounded-xl backdrop-blur-xs">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>توصيل سريع ومباشر</span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-emerald-950/30 py-2.5 px-3 rounded-xl backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>طلب سهّل بدون حساب</span>
          </div>
        </div>

      </div>
    </div>
  );
};
