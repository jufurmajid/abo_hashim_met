'use client';

import React from 'react';
import { ShoppingBag, Store, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Store className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                أبو هاشم
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span className="text-xs font-medium text-emerald-700">
                للحوم والألبان والأجبان
              </span>
            </div>
          </div>

          {/* Quick Contact & Cart Button */}
          <div className="flex items-center gap-3">
            <a
              href="tel:07700000000"
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>اتصل بنا</span>
            </a>

            <button
              onClick={onOpenCart}
              aria-label="فتح السلة"
              className="relative p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="hidden sm:inline text-sm font-bold">السلة</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
