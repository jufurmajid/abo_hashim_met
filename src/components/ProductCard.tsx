'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = !product.isAvailable || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Availability Badge */}
          {isOutOfStock ? (
            <div className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-[11px] px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>غير متوفر</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-emerald-600/90 text-white font-bold text-[11px] px-3 py-1 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>متوفر طازج</span>
            </div>
          )}

          {/* Unit Badge */}
          <div className="absolute bottom-3 right-3 bg-slate-900/80 text-emerald-300 font-bold text-[11px] px-2.5 py-1 rounded-xl backdrop-blur-md shadow-xs">
            الوحدة: {product.unit}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-xs leading-relaxed line-clamp-2 min-h-[34px] mb-3 font-normal">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-1">
        <div>
          <span className="text-[10px] sm:text-xs text-slate-400 block font-semibold">السعر</span>
          <div className="text-emerald-700 font-black text-lg sm:text-xl tracking-tight">
            {product.price.toLocaleString('ar-IQ')}{' '}
            <span className="text-xs font-bold text-slate-500">د.ع</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-4 py-2.5 sm:px-4 sm:py-3 rounded-2xl font-bold text-xs sm:text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            added
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
          }`}
          aria-label={isOutOfStock ? 'غير متوفر' : `أضف ${product.name} إلى السلة`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>تمت الإضافة</span>
            </>
          ) : isOutOfStock ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>غير متوفر</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>أضف للسلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  onResetSearch?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onResetSearch }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 my-6 shadow-2xs max-w-xl mx-auto">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-1">
          لم نجد منتجات مطابقة لبحثك
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
          جرّب البحث باسم آخر أو استعرض أقسام المنتجات المختلفة.
        </p>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>عرض كل المنتجات</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
