import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { CategoriesView } from './views/CategoriesView';
import { OffersView } from './views/OffersView';
import { ContactView } from './views/ContactView';
import { AdminDashboard } from './views/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product, Category, Offer, StoreInfo } from './types';
import { api } from './services/api';
import { initialData } from './data/initialData';
import { MessageCircle, Phone, RefreshCw } from 'lucide-react';
import { createGeneralWhatsAppUrl, createCallUrl } from './utils/whatsapp';

export default function App() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(initialData.storeInfo);
  const [categories, setCategories] = useState<(Category & { productCount?: number })[]>(initialData.categories);
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [offers, setOffers] = useState<Offer[]>(initialData.offers);

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load live data from backend
  const loadData = async () => {
    try {
      const [fetchedStore, fetchedCats, fetchedProds, fetchedOffers] = await Promise.all([
        api.getStoreInfo().catch(() => initialData.storeInfo),
        api.getCategories().catch(() => initialData.categories),
        api.getProducts().catch(() => initialData.products),
        api.getOffers().catch(() => initialData.offers)
      ]);

      setStoreInfo(fetchedStore);
      setCategories(fetchedCats);
      setProducts(fetchedProds);
      setOffers(fetchedOffers);
    } catch (err) {
      console.warn('Using local catalog fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check if owner session already exists
    api.verifyAdminSession().then((isValid) => {
      setIsAdminLoggedIn(isValid);
    });
  }, []);

  const handleSelectCategoryFromHome = (catId: string) => {
    setSelectedCategoryId(catId);
    setCategorySearchQuery('');
    setCurrentTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHome = (query: string) => {
    setCategorySearchQuery(query);
    setSelectedCategoryId('all');
    setCurrentTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeOfferCount = offers.filter((o) => o.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        storeInfo={storeInfo}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => {
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Page Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <span className="text-xs font-semibold text-slate-500">Loading RATNAWAT Showroom...</span>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                products={products}
                categories={categories}
                offers={offers}
                storeInfo={storeInfo}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onSelectCategory={handleSelectCategoryFromHome}
                onViewOffers={() => {
                  setCurrentTab('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSearch={handleSearchFromHome}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesView
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => setSelectedCategoryId(id)}
                storeInfo={storeInfo}
                onSelectProduct={(p) => setSelectedProduct(p)}
                initialSearchQuery={categorySearchQuery}
              />
            )}

            {currentTab === 'offers' && (
              <OffersView
                offers={offers}
                products={products}
                storeInfo={storeInfo}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {currentTab === 'contact' && (
              <ContactView storeInfo={storeInfo} />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                products={products}
                categories={categories}
                offers={offers}
                storeInfo={storeInfo}
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginSuccess={() => {
                  setIsAdminLoggedIn(true);
                  loadData();
                }}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  setCurrentTab('home');
                }}
                onRefreshData={loadData}
                onBackToStore={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Quick WhatsApp Button on Mobile when not in admin */}
      {currentTab !== 'admin' && (
        <aside aria-label="Quick contact" className="fixed bottom-20 right-4 z-30 flex flex-col gap-2">
          <a
            href={createGeneralWhatsAppUrl(storeInfo)}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with Showroom on WhatsApp"
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          </a>
        </aside>
      )}

      {/* Dedicated Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        storeInfo={storeInfo}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeOfferCount={activeOfferCount}
      />
    </div>
  );
}
