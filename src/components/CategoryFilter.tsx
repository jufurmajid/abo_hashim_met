'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/sample-products';
import { CategoryId } from '@/types';
import { LayoutGrid, Utensils, Milk, ShoppingBag, Flame } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
  categoriesCount?: Record<string, number>;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="w-4 h-4" />,
  meats: <Utensils className="w-4 h-4" />,
  dairy: <Milk className="w-4 h-4" />,
  cheese: <Flame className="w-4 h-4" />,
  other: <ShoppingBag className="w-4 h-4" />,
};

const CATEGORY_EMOJIS: Record<string, string> = {
  all: '✨',
  meats: '🥩',
  dairy: '🥛',
  cheese: '🧀',
  other: '🛒',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoriesCount,
}) => {
  const allCategories = [
    { id: 'all', name: 'جميع المنتجات' },
    ...CATEGORIES,
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-2 sm:my-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max pb-1 px-1">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const emoji = CATEGORY_EMOJIS[cat.id] || '🛒';
          const count = categoriesCount ? categoriesCount[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId | 'all')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2.5 select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100/80 hover:text-emerald-700 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span className="text-sm sm:text-base">{emoji}</span>
              <span className="flex items-center gap-1.5">
                <span>{cat.name}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
