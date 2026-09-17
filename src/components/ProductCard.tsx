'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.isAvailable || product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Availability Badge */}
          {!product.isAvailable || product.stock <= 0 ? (
            <div className="absolute top-3 right-3 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>نفدت الكمية</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-emerald-600/90 text-white font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
              متوفر طازج
            </div>
          )}

          {/* Unit Badge */}
          <div className="absolute bottom-3 right-3 bg-slate-900/80 text-emerald-300 font-medium text-xs px-2.5 py-1 rounded-xl backdrop-blur-md">
            الوحدة: {product.unit}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-extrabold text-slate-900 text-lg mb-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 min-h-[32px] mb-4">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div>
          <span className="text-xs text-slate-400 block font-medium">السعر</span>
          <div className="text-emerald-700 font-black text-xl tracking-tight">
            {product.price.toLocaleString('ar-IQ')}{' '}
            <span className="text-xs font-bold text-slate-500">د.ع</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable || product.stock <= 0}
          className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            added
              ? 'bg-amber-500 text-slate-950'
              : !product.isAvailable || product.stock <= 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
          }`}
          aria-label={`أضف ${product.name} إلى السلة`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>تمت الإضافة</span>
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
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 my-6">
        <p className="text-slate-500 text-base font-semibold">
          لا توجد منتجات متاحة حالياً في هذا التصنيف.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
