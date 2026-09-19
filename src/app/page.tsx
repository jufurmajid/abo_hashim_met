'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { CartProvider, useCart } from '@/context/CartContext';
import { CategoryId, Product } from '@/types';
import { getProductRepository } from '@/lib/data/factory';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

function StoreApp() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { totalItems, totalPrice } = useCart();
  const productsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const activeProductRepo = getProductRepository();
        const all = await activeProductRepo.getAllProducts();
        setProducts(all);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter products by Category & Search Query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Compute product counts per category
  const categoriesCount = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetSearch = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 sm:pb-0">
      {/* Header with Search & Delivery Address */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={scrollToProducts}
      />

      {/* Hero Section Banner Carousel */}
      <Hero onExploreClick={scrollToProducts} />

      {/* Main Content Area */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
        ref={productsSectionRef}
      >
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>قائمة المنتجات الطازجة</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-rose-950 tracking-tight">
              {selectedCategory === 'all'
                ? 'جميع المنتجات المتوفرة'
                : selectedCategory === 'meats'
                ? '🥩 قسم اللحوم البلدية'
                : selectedCategory === 'dairy'
                ? '🥛 قسم الألبان الطازجة'
                : selectedCategory === 'cheese'
                ? '🧀 قسم الأجبان الممتازة'
                : '🛒 منتجات أخرى'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              اختر منتجاتك اليومية المجهزة طازجة وأضفها لسلة الشراء مباشرة.
            </p>
          </div>

          {searchQuery && (
            <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold self-start sm:self-auto">
              نتائج البحث عن: &ldquo;{searchQuery}&rdquo; ({filteredProducts.length})
            </div>
          )}
        </div>

        {/* Category Pill Tabs */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
          }}
          categoriesCount={categoriesCount}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-rose-900 mb-3" />
            <p className="text-sm font-bold text-slate-600">جاري تحميل المنتجات...</p>
          </div>
        ) : (
          /* Product Grid */
          <ProductGrid
            products={filteredProducts}
            onResetSearch={handleResetSearch}
          />
        )}
      </main>

      {/* Sticky Mobile Floating Cart bar (visible on mobile when cart has items) */}
      {totalItems > 0 && (
        <div className="fixed bottom-16 left-3 right-3 z-30 sm:hidden animate-slide-up">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white p-3 rounded-2xl shadow-xl border border-rose-800/60 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-400 text-rose-950 w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-xs">
                {totalItems}
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-amber-300">سلة المشتريات</span>
                <span className="text-xs font-black text-white">
                  {totalPrice.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold bg-white/10 px-2.5 py-1.5 rounded-xl text-white">
              <span>عرض السلة</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            </div>
          </button>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Android / Mobile */}
      <BottomNav
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToProducts={scrollToProducts}
        onHomeClick={() => {
          setSelectedCategory('all');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
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
