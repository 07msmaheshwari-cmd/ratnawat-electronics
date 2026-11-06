import React from 'react';
import { Smartphone, Tv, Wind, Headphones, Speaker, Flame, RefreshCw, Layers, LucideIcon } from 'lucide-react';
import { Category } from '../types';

interface CategoryChipsProps {
  categories: (Category & { productCount?: number })[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  mobiles: Smartphone,
  televisions: Tv,
  refrigerators: Layers,
  'washing-machines': RefreshCw,
  'air-conditioners': Wind,
  speakers: Speaker,
  'home-appliances': Flame,
  accessories: Headphones,
};

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
          selectedCategoryId === 'all'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
        }`}
      >
        <span>All Products</span>
      </button>

      {categories.map((cat) => {
        const IconComponent = iconMap[cat.id] || Layers;
        const isSelected = selectedCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.name}</span>
            {cat.productCount !== undefined && (
              <span className={`text-[10px] ml-0.5 opacity-80 font-mono`}>
                ({cat.productCount})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
