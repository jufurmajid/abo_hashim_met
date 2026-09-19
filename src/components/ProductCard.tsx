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
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-36 sm:h-48 md:h-52 bg-slate-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Availability / Fresh Badge */}
          {isOutOfStock ? (
            <div className="absolute top-2 right-2 bg-red-600/90 text-white font-bold text-[9px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3 h-3" />
              <span>غير متوفر</span>
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-rose-900/90 text-amber-300 font-bold text-[9px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1 border border-rose-800/40">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
              <span>بلدي طازج</span>
            </div>
          )}

          {/* Unit Tag Badge */}
          <div className="absolute bottom-2 right-2 bg-slate-900/80 text-slate-200 font-bold text-[9px] sm:text-[11px] px-2 py-0.5 rounded-lg backdrop-blur-md shadow-xs">
            {product.unit}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4">
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-base mb-1 line-clamp-1 group-hover:text-rose-900 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed line-clamp-2 min-h-[30px] sm:min-h-[36px] mb-2 font-normal">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 flex items-center justify-between border-t border-slate-100/80 mt-1">
        <div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 block font-semibold">السعر</span>
          <div className="text-rose-900 font-black text-sm sm:text-lg tracking-tight">
            {product.price.toLocaleString('ar-IQ')}{' '}
            <span className="text-[10px] sm:text-xs font-bold text-slate-500">د.ع</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            added
              ? 'bg-amber-400 text-rose-950 shadow-md shadow-amber-400/20'
              : isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-rose-900 hover:bg-rose-950 text-white shadow-md shadow-rose-950/20'
          }`}
          aria-label={isOutOfStock ? 'غير متوفر' : `أضف ${product.name} إلى السلة`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-rose-950" />
              <span className="hidden sm:inline text-rose-950">تمت الإضافة</span>
            </>
          ) : isOutOfStock ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">غير متوفر</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">أضف</span>
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
      <div className="text-center py-12 sm:py-16 px-6 bg-white rounded-3xl border border-slate-200/80 my-6 shadow-2xs max-w-xl mx-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-900">
          <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
          لم نجد منتجات مطابقة لبحثك
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
          جرّب البحث باسم آخر أو استعرض أقسام المنتجات المختلفة.
        </p>
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>عرض كل المنتجات</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 py-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
