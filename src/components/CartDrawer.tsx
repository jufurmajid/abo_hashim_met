'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10 rtl:pl-0 rtl:pr-0 sm:rtl:pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-up sm:animate-fade-in">

          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-white">سلة المشتريات</h2>
                <p className="text-xs text-emerald-200">
                  {totalItems} {totalItems === 1 ? 'منتج مختار' : 'منتجات مختارة'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 my-auto">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  استعرض قائمة المنتجات البلديّة الطازجة وأضف ما تحتاجه لسلة التسوق.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-3.5 items-center">
                  {/* Product Thumbnail */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate mb-0.5">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mb-2">
                      {product.price.toLocaleString('ar-IQ')} د.ع / {product.unit}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors cursor-pointer"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-900 min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-1.5 hover:bg-slate-200 text-slate-700 disabled:opacity-30 active:bg-slate-300 transition-colors cursor-pointer"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="حذف من السلة"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-left font-black text-emerald-700 text-sm shrink-0">
                    {(product.price * quantity).toLocaleString('ar-IQ')}
                    <span className="block text-[10px] font-bold text-slate-400">
                      د.ع
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-bold text-xs">المجموع الكلي</span>
                  <span className="text-[10px] text-slate-400 font-medium">شامل المنتجات المحددة</span>
                </div>
                <span className="text-2xl font-black text-emerald-800 tracking-tight">
                  {totalPrice.toLocaleString('ar-IQ')}{' '}
                  <span className="text-xs font-bold text-slate-500">د.ع</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>شراء سريع كضيف بدون الحاجة إلى إنشاء حساب</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>إتمام الطلب</span>
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
