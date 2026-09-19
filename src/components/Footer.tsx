'use client';

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-rose-950 text-slate-300 border-t border-rose-900/60 mt-auto pb-16 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-rose-900/40">

          {/* Brand Info Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-900 to-rose-950 flex items-center justify-center text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40">
                <span className="text-xl">🥩</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">أبو هاشم</span>
                <span className="text-[11px] font-bold text-amber-300">للحوم والألبان والأجبان</span>
              </div>
            </div>
            <p className="text-xs text-rose-100/70 leading-relaxed max-w-sm font-medium">
              متجر إلكتروني حديث لأجود أنواع اللحوم البلدي الطازجة والألبان والأجبان اليومية بأعلى معايير النظافة والتغليف.
            </p>
          </div>

          {/* Categories Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-amber-300 mb-3 flex items-center gap-2">
              <span>أقسام المتجر</span>
            </h4>
            <ul className="text-xs space-y-2.5 text-rose-100/70 font-medium">
              <li className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🥩</span> اللحوم البلدية الطازجة
              </li>
              <li className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🥛</span> الألبان والقشطة الطبيعية
              </li>
              <li className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🧀</span> الأجبان البلدية والحلوم
              </li>
              <li className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🛒</span> المنتجات الغذائية والمكملات
              </li>
            </ul>
          </div>

          {/* Quality Guarantee Column */}
          <div className="space-y-3 bg-rose-900/30 p-4 rounded-2xl border border-rose-900/50">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ضمان الجودة والطزاجة</span>
            </h4>
            <p className="text-xs text-rose-100/70 leading-relaxed font-medium">
              جميع المنتجات بلدية ومجهزة يومياً وفق أرفع مستويات الصحة والتعقيم، وتصلكم بسيارات مجهزة للتبريد مباشرة إلى منازلكم.
            </p>
          </div>

        </div>

        {/* Bottom Rights & Developer Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-rose-100/60 gap-3">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر أبو هاشم.</p>

          <div className="flex items-center gap-1.5 font-bold text-slate-200 bg-rose-900/40 px-3.5 py-1.5 rounded-full border border-rose-800/40">
            <span>تم التطوير بواسطة</span>
            <span className="text-amber-300 font-black flex items-center gap-1">
              جعفر ماجد
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
