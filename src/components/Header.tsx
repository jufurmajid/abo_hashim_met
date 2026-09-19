'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, X, Store, Sparkles, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  searchQuery = '',
  onSearchChange,
}) => {
  const { totalItems } = useCart();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xs transition-all">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
        <span>لحوم بلدية طازجة وألبان يومية - توصيل سريع لموقعك</span>
        <span className="hidden md:inline-block w-1 h-1 rounded-full bg-emerald-400 opacity-60"></span>
        <span className="hidden md:inline text-amber-300 font-bold">بدون الحاجة لإنشاء حساب!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* Logo & Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group hover:scale-105 transition-transform cursor-pointer">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  أبو هاشم
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 tracking-wide mt-0.5">
                للحوم والألبان والأجبان
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="ابحث عن لحم عجل، جبن، حليب، دجاج..."
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-2xl pl-10 pr-10 py-2.5 sm:py-3 border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden font-medium placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
                    aria-label="مسح البحث"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Action Icons & Mobile Search Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            {onSearchChange && (
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                aria-label="فتح البحث"
                className="md:hidden p-2.5 rounded-2xl bg-slate-100/80 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            )}

            {/* Direct Phone Link */}
            <a
              href="tel:07700000000"
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3.5 py-2.5 rounded-2xl transition-all border border-slate-200/60"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>اتصال مباشر</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="فتح السلة"
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm"
            >
              <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">السلة</span>
              {totalItems > 0 ? (
                <span className="bg-amber-400 text-slate-950 font-black text-xs min-w-[22px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-emerald-600 shadow-xs">
                  {totalItems}
                </span>
              ) : (
                <span className="hidden sm:inline-block text-emerald-200 text-xs font-normal">
                  (0)
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Input Expanded Bar */}
        {isMobileSearchOpen && onSearchChange && (
          <div className="md:hidden pb-3 pt-1 animate-fade-in">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                placeholder="ابحث عن منتج بالاسم..."
                className="w-full bg-slate-100 text-slate-900 text-xs rounded-xl pl-9 pr-9 py-2.5 border border-emerald-400 focus:outline-hidden font-medium placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
