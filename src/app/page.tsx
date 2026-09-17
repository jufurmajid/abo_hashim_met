'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { CategoryId, Product } from '@/types';
import { getProductRepository } from '@/lib/data/factory';

function StoreApp() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const productsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      const activeProductRepo = getProductRepository();
      const all = await activeProductRepo.getAllProducts();
      setProducts(all);
    }
    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <Hero onExploreClick={scrollToProducts} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={productsSectionRef}>

        {/* Section Heading & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              المنتجات المتاحة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر منتجاتك المفضلة وأضفها للسلة بسهولة
            </p>
          </div>
        </div>

        {/* Category Selector Tabs */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Cards Grid */}
        <ProductGrid products={filteredProducts} />

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Guest Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}
