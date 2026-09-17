'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/sample-products';
import { CategoryId } from '@/types';

interface CategoryFilterProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (category: CategoryId | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = [
    { id: 'all', name: 'الكل' },
    ...CATEGORIES,
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max pb-1 px-1">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as CategoryId | 'all')}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-emerald-700 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
