'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
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

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">

          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="font-bold text-lg text-white">سلة المشتريات</h2>
                <p className="text-xs text-emerald-200">
                  {totalItems} {totalItems === 1 ? 'منتج' : 'منتجات'} في السلة
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 mb-4" />
                <p className="font-bold text-slate-700 text-lg mb-1">سلتك فارغة</p>
                <p className="text-xs text-slate-400">تصفح المنتجات وأضف ما تحتاجه للسلة</p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 items-center">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 mb-2">
                      {product.price.toLocaleString('ar-IQ')} د.ع / {product.unit}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-700 active:bg-slate-300 transition-colors cursor-pointer"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-slate-800">
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

                  {/* Item Subtotal */}
                  <div className="text-left font-black text-emerald-700 text-sm shrink-0">
                    {(product.price * quantity).toLocaleString('ar-IQ')}
                    <span className="block text-[10px] font-normal text-slate-400">
                      د.ع
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 font-medium text-sm">المجموع الإجمالي</span>
                <span className="text-2xl font-black text-emerald-800 tracking-tight">
                  {totalPrice.toLocaleString('ar-IQ')}{' '}
                  <span className="text-xs font-bold text-slate-500">د.ع</span>
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
