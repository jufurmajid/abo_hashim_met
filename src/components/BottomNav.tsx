'use client';

import React from 'react';
import { Home, Grid, ShoppingBag, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface BottomNavProps {
  onOpenCart: () => void;
  onScrollToProducts: () => void;
  onHomeClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenCart,
  onScrollToProducts,
  onHomeClick,
}) => {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-2">
      <div className="grid grid-cols-4 items-center max-w-md mx-auto text-center">

        {/* Home Button */}
        <button
          onClick={onHomeClick}
          className="flex flex-col items-center justify-center py-1 text-rose-950 font-bold active:scale-95 transition-all cursor-pointer"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">الرئيسية</span>
        </button>

        {/* Categories Button */}
        <button
          onClick={onScrollToProducts}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-rose-950 font-medium active:scale-95 transition-all cursor-pointer"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">الأقسام</span>
        </button>

        {/* Cart Button with Live Item Count */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-slate-500 hover:text-rose-950 font-medium active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-rose-900" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-rose-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-rose-900">
            {totalItems > 0 ? `${totalPrice.toLocaleString('ar-IQ')} د.ع` : 'السلة'}
          </span>
        </button>

        {/* Phone Call Link */}
        <a
          href="tel:07700000000"
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-rose-950 font-medium active:scale-95 transition-all cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 mb-0.5 text-emerald-600" />
          <span className="text-[10px]">اتصال</span>
        </a>

      </div>
    </div>
  );
};
