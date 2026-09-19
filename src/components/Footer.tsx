'use client';

import React from 'react';
import { Store, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">

          {/* Brand Info Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">أبو هاشم</span>
                <span className="text-[11px] font-bold text-emerald-400">للحوم والألبان والأجبان</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              متجر إلكتروني حديث لأجود أنواع اللحوم البلدي الطازجة والألبان والأجبان اليومية بأعلى معايير النظافة والتغليف.
            </p>
          </div>

          {/* Categories Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-extrabold text-white mb-3 flex items-center gap-2">
              <span>أقسام المتجر</span>
            </h4>
            <ul className="text-xs space-y-2.5 text-slate-400 font-medium">
              <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                <span>🥩</span> اللحوم البلدية الطازجة
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                <span>🥛</span> الألبان والقشطة الطبيعية
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                <span>🧀</span> الأجبان البلدية والحلوم
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                <span>🛒</span> المنتجات الغذائية والمكملات
              </li>
            </ul>
          </div>

          {/* Quality Guarantee Column */}
          <div className="space-y-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800/80">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ضمان الجودة والطزاجة</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              جميع المنتجات بلدية ومجهزة يومياً وفق أرفع مستويات الصحة والتعقيم، وتصلكم بسيارات مجهزة للتبريد مباشرة إلى منازلكم.
            </p>
          </div>

        </div>

        {/* Bottom Rights & Developer Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر أبو هاشم.</p>

          <div className="flex items-center gap-1.5 font-bold text-slate-300 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-800">
            <span>تم التطوير بواسطة</span>
            <span className="text-emerald-400 font-black flex items-center gap-1">
              جعفر ماجد
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
