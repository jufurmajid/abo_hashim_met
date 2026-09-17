'use client';

import React from 'react';
import { Store } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">

          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black">أبو هاشم</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              متجر إلكتروني متصل ومجهز بأجود أنواع اللحوم البلدي الطازجة والألبان والأجبان يومياً بأعلى معايير الجودة والنظافة.
            </p>
          </div>

          {/* Quick Categories Column */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">أقسام المتجر</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="hover:text-emerald-400 transition-colors">اللحوم البلدية الطازجة</li>
              <li className="hover:text-emerald-400 transition-colors">الألبان الطبيعية والقشطة</li>
              <li className="hover:text-emerald-400 transition-colors">الأجبان المتنوعة</li>
              <li className="hover:text-emerald-400 transition-colors">المنتجات الغذائية والزبائن</li>
            </ul>
          </div>

          {/* Service Guarantee */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">ضمان الجودة</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              جميع منتجاتنا طازجة 100% ويتم تجهيزها يومياً وفق أعلى مستويات النظافة والتعقيم وضمان الرضا التام.
            </p>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر أبو هاشم.</p>

          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <span>تم التطوير بواسطة</span>
            <span className="font-extrabold text-emerald-400 hover:underline">جعفر ماجد</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
