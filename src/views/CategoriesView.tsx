import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';
import { Product, Category, StoreInfo } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategoryChips } from '../components/CategoryChips';

interface CategoriesViewProps {
  products: Product[];
  categories: (Category & { productCount?: number })[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  storeInfo: StoreInfo;
  onSelectProduct: (product: Product) => void;
  initialSearchQuery?: string;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  categories,
  selectedCategoryId,
  onSelectCategory,
  storeInfo,
  onSelectProduct,
  initialSearchQuery = '',
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'discount'>('default');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategoryId !== 'all') {
      list = list.filter((p) => p.categoryId.toLowerCase() === selectedCategoryId.toLowerCase());
    }

    // In Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return list;
  }, [products, selectedCategoryId, inStockOnly, search, sortBy]);

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-5 pb-16">
      {/* Header & Category Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {selectedCategoryObj ? selectedCategoryObj.name : 'All Electronics Catalog'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {selectedCategoryObj?.description || 'Browse complete showroom stock with transparent local prices and warranties'}
        </p>
      </div>

      {/* Category Chips Bar */}
      <CategoryChips
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
      />

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model, brand, spec..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* In Stock Only Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`h-10 px-3 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              inStockOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-slate-300'}`} />
            <span>In Stock Only</span>
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 px-3 pr-8 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs"
          >
            <option value="default">Sort: Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>

      {/* Result Count and Applied Filter Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> products
          {selectedCategoryId !== 'all' && (
            <span> in <span className="text-slate-900 font-semibold">{selectedCategoryObj?.name}</span></span>
          )}
        </div>

        {(selectedCategoryId !== 'all' || search || inStockOnly || sortBy !== 'default') && (
          <button
            onClick={() => {
              onSelectCategory('all');
              setSearch('');
              setInStockOnly(false);
              setSortBy('default');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeInfo={storeInfo}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <PackageX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No electronics found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            We couldn't find any products matching your current category or search criteria.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setSearch('');
              setInStockOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};
