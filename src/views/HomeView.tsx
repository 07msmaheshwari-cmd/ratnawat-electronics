import React, { useState } from 'react';
import { Search, Flame, Sparkles, TrendingUp, ArrowRight, ShieldCheck, Truck, Headphones, Wrench, Smartphone, Tv, Wind, Layers, RefreshCw, Speaker } from 'lucide-react';
import { Product, Category, Offer, StoreInfo } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FestivalBanner } from '../components/FestivalBanner';

interface HomeViewProps {
  products: Product[];
  categories: (Category & { productCount?: number })[];
  offers: Offer[];
  storeInfo: StoreInfo;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onViewOffers: () => void;
  onSearch: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  offers,
  storeInfo,
  onSelectProduct,
  onSelectCategory,
  onViewOffers,
  onSearch,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  // Grouped products
  const featuredProducts = products.filter((p) => p.tags?.includes('featured')).slice(0, 6);
  const bestsellers = products.filter((p) => p.tags?.includes('bestseller')).slice(0, 4);
  const latestArrivals = products.filter((p) => p.tags?.includes('latest')).slice(0, 4);
  const festivalProducts = products.filter((p) => p.tags?.includes('festival_offer')).slice(0, 4);

  // Fallback to general list if specific tag lists are empty
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers : products.slice(2, 6);
  const displayLatest = latestArrivals.length > 0 ? latestArrivals : products.slice(0, 4);

  return (
    <div className="space-y-7 pb-16">
      {/* Search Bar (Top prominent search) */}
      <section className="pt-1">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Smart TVs, 5G Mobiles, Inverter ACs, Refrigerators..."
            className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      {/* Hero Promotional Festival Banner */}
      <section>
        <FestivalBanner offers={offers} onViewOffers={onViewOffers} />
      </section>

      {/* Product Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs text-slate-500">Genuine electronics across all home needs</p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Category Tiles Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
          {categories.map((cat) => {
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 transition-all text-center cursor-pointer shadow-2xs"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center mb-1.5 transition-colors">
                  {cat.id === 'mobiles' && <Smartphone className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'televisions' && <Tv className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'refrigerators' && <Layers className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'washing-machines' && <RefreshCw className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'air-conditioners' && <Wind className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'speakers' && <Speaker className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'home-appliances' && <Flame className="w-5 h-5 stroke-[1.8]" />}
                  {cat.id === 'accessories' && <Headphones className="w-5 h-5 stroke-[1.8]" />}
                </div>
                <span className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-600 truncate w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {cat.productCount ?? 0} items
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Special Festival Offers Strip (If any) */}
      {festivalProducts.length > 0 && (
        <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Festival Dhamaka Deals
                </h2>
                <p className="text-xs text-amber-800 font-medium">Extra savings on popular models this season</p>
              </div>
            </div>
            <button
              onClick={onViewOffers}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 inline-flex items-center gap-1 bg-amber-200/60 px-3 py-1.5 rounded-lg"
            >
              <span>All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {festivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeInfo={storeInfo}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Featured Electronics
            </h2>
            <p className="text-xs text-slate-500">Handpicked top-rated appliances & gadgets</p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {displayFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeInfo={storeInfo}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Best-Selling Products */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-rose-50 text-rose-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Best-Selling in Store
              </h2>
              <p className="text-xs text-slate-500">Most trusted by customers in our area</p>
            </div>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {displayBestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeInfo={storeInfo}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Latest Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Latest Arrivals
            </h2>
            <p className="text-xs text-slate-500">Fresh stock from Samsung, LG, Daikin, OnePlus</p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Browse New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {displayLatest.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeInfo={storeInfo}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Trust & Local Showroom Guarantees Strip */}
      <section className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl">
        <div className="text-center max-w-lg mx-auto mb-6">
          <h3 className="text-base sm:text-lg font-bold tracking-tight">
            Why Choose RATNAWAT ELECTRONICS?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Serving our local community for over 15 years with honesty, genuine brands, and personal care.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <ShieldCheck className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-100">100% Genuine Brands</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Direct authorized dealer billing with warranty</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Truck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-100">Same-Day Safe Delivery</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Careful doorstep delivery across the tehsil</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Wrench className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-100">Installation Help</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Free technician setup for TVs & ACs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Headphones className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-100">Village Support</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Always here in the main bazaar for service</div>
          </div>
        </div>
      </section>
    </div>
  );
};
