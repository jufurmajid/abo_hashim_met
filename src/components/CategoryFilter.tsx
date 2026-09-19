'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/sample-products';
import { CategoryId } from '@/types';

interface CategoryFilterProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
  categoriesCount?: Record<string, number>;
}

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
    { id: 'all', name: 'الكل' },
    ...CATEGORIES,
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-2 sm:my-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max px-1">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const emoji = CATEGORY_EMOJIS[cat.id] || '🛒';
          const count = categoriesCount ? categoriesCount[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId | 'all')}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 select-none border ${
                isSelected
                  ? 'bg-rose-900 text-white border-rose-900 shadow-md shadow-rose-950/20 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-rose-900 border-slate-200/80 shadow-2xs'
              }`}
            >
              <span className="text-base sm:text-lg">{emoji}</span>
              <span className="flex items-center gap-1.5">
                <span>{cat.name}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isSelected
                        ? 'bg-amber-400 text-rose-950'
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
