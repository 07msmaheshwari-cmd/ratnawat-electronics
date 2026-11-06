import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Plus, Edit2, Trash2, CheckCircle2, 
  XCircle, Image as ImageIcon, Tag, Store, Layers, Save, RefreshCw, 
  ArrowLeft, Upload, AlertCircle, Phone, MessageCircle, MapPin
} from 'lucide-react';
import { Product, Category, Offer, StoreInfo, ProductSpecification } from '../types';
import { api } from '../services/api';
import { formatCurrency } from '../utils/whatsapp';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  offers: Offer[];
  storeInfo: StoreInfo;
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onRefreshData: () => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  offers,
  storeInfo,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
  onRefreshData,
  onBackToStore,
}) => {
  // Login State
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'store'>('products');

  // Product Filter & Search
  const [productSearch, setProductSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [isNewOffer, setIsNewOffer] = useState(false);

  // Inline Quick Price Edit State
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);

  // Status message
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Store Settings Form
  const [storeForm, setStoreForm] = useState<StoreInfo>(storeInfo);
  const [newPin, setNewPin] = useState('');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const ok = await api.loginAdmin(pinInput.trim());
      if (ok) {
        onLoginSuccess();
        showFeedback('Logged in as store administrator');
      } else {
        setLoginError('Invalid PIN. Use default PIN: 1234');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Toggle Stock Status
  const handleToggleStock = async (product: Product) => {
    try {
      await api.toggleProductStock(product.id, !product.inStock);
      onRefreshData();
      showFeedback(`Updated stock for "${product.name}"`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update stock', 'error');
    }
  };

  // Quick Price Save
  const handleSaveQuickPrice = async (productId: string) => {
    try {
      await api.updateProduct(productId, { price: quickPriceVal });
      setQuickPriceId(null);
      onRefreshData();
      showFeedback('Price updated successfully');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update price', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from store inventory?`)) return;
    try {
      await api.deleteProduct(id);
      onRefreshData();
      showFeedback(`Product "${name}" deleted`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete product', 'error');
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isNewProduct) {
        await api.createProduct(editingProduct);
        showFeedback('New product added to catalog');
      } else {
        await api.updateProduct(editingProduct.id!, editingProduct);
        showFeedback('Product details saved');
      }
      setEditingProduct(null);
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save product', 'error');
    }
  };

  // Toggle Offer Active
  const handleToggleOffer = async (offer: Offer) => {
    try {
      await api.toggleOffer(offer.id);
      onRefreshData();
      showFeedback(`Offer "${offer.title}" ${!offer.isActive ? 'activated' : 'deactivated'}`);
    } catch (err: any) {
      showFeedback(err.message || 'Failed to toggle offer', 'error');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (id: string, title: string) => {
    if (!window.confirm(`Delete offer "${title}"?`)) return;
    try {
      await api.deleteOffer(id);
      onRefreshData();
      showFeedback('Offer deleted');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete offer', 'error');
    }
  };

  // Save Offer (Add or Edit)
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    try {
      if (isNewOffer) {
        await api.createOffer(editingOffer);
        showFeedback('New festival offer created');
      } else {
        await api.updateOffer(editingOffer.id!, editingOffer);
        showFeedback('Offer updated successfully');
      }
      setEditingOffer(null);
      onRefreshData();
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save offer', 'error');
    }
  };

  // Save Store Settings
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateStoreInfo(storeForm);
      if (newPin.trim().length >= 4) {
        await api.changePin(newPin.trim());
        setNewPin('');
      }
      onRefreshData();
      showFeedback('Store details & settings updated successfully');
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update store settings', 'error');
    }
  };

  // Handle Image File Upload (Converts to Data URL & uploads to server)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'offer') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const uploadedUrl = await api.uploadImage(dataUrl, file.name);
        if (target === 'product' && editingProduct) {
          const currentImgs = editingProduct.images || [];
          setEditingProduct({
            ...editingProduct,
            images: [uploadedUrl, ...currentImgs]
          });
        } else if (target === 'offer' && editingOffer) {
          setEditingOffer({
            ...editingOffer,
            bannerUrl: uploadedUrl
          });
        }
        showFeedback('Image uploaded successfully');
      } catch (err: any) {
        showFeedback('Upload failed, falling back to local preview', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset to Demo Catalog
  const handleResetCatalog = async () => {
    if (!window.confirm('Reset all catalog data back to default showroom products and festival offers?')) return;
    try {
      await api.resetData();
      onRefreshData();
      showFeedback('Showroom catalog reset to factory defaults');
    } catch (err: any) {
      showFeedback(err.message || 'Reset failed', 'error');
    }
  };

  // -------------------------------------------------------------
  // If NOT Logged In: Render Login Card
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <button
          onClick={onBackToStore}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showroom</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              RATNAWAT Shop Owner Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your store administrator PIN to manage products, prices, and festival offers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Owner Security PIN / Password
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN (default: 1234)"
                autoFocus
                className="w-full h-12 px-4 rounded-xl border border-slate-300 text-center text-lg tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-md disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Unlock Admin Dashboard'}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-2">
              Default Owner PIN is set to <span className="font-mono font-bold text-slate-700">1234</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPinInput('1234');
                setLoginError('');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Click to Auto-Fill PIN: 1234
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered products in admin list
  const adminProducts = products.filter((p) => {
    const matchesCat = filterCat === 'all' || p.categoryId === filterCat;
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // -------------------------------------------------------------
  // If Logged In: Render Full Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-20">
      {/* Toast feedback */}
      {feedbackMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all ${
          feedbackMsg.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
        }`}>
          {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              Store Owner Dashboard
            </h1>
            <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-md font-semibold">
              Live Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as Owner • Changes update instantly for village customers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>

          <button
            onClick={handleResetCatalog}
            title="Reset catalog back to defaults"
            className="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              api.logoutAdmin();
              onLogout();
            }}
            title="Logout"
            className="h-9 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tab Switches */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'offers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Festival Offers ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === 'store'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCT MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {/* Search */}
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products in inventory..."
                className="h-10 px-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              {/* Category Filter */}
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => {
                setIsNewProduct(true);
                setEditingProduct({
                  name: '',
                  brand: '',
                  categoryId: categories[0]?.id || 'televisions',
                  price: 0,
                  originalPrice: 0,
                  shortDescription: '',
                  description: '',
                  inStock: true,
                  images: ['/src/assets/images/category_smart_tv_1793957324649.jpg'],
                  specifications: { 'Warranty': '1 Year Brand Warranty' },
                  tags: ['latest']
                });
              }}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Items Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {adminProducts.map((product) => {
              const isEditingThisPrice = quickPriceId === product.id;

              return (
                <div key={product.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  {/* Left: Product Thumbnail & Title */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={product.images?.[0] || '/src/assets/images/category_smart_tv_1793957324649.jpg'}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.categoryId}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {product.shortDescription || 'No description provided'}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Price & Stock Status with 1-click Quick Edit */}
                  <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0">
                    {/* Price display / Quick Price editor */}
                    <div className="text-right">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold">₹</span>
                          <input
                            type="number"
                            value={quickPriceVal}
                            onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                            className="w-24 h-8 px-2 text-xs font-mono font-bold border border-blue-500 rounded-md focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveQuickPrice(product.id)}
                            className="p-1 rounded-md bg-emerald-600 text-white text-xs font-bold"
                            title="Save Price"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setQuickPriceId(product.id);
                            setQuickPriceVal(product.price);
                          }}
                          className="cursor-pointer group/price"
                          title="Click to quick change price"
                        >
                          <div className="text-sm font-extrabold text-slate-900 font-mono group-hover/price:text-blue-600">
                            {formatCurrency(product.price)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-[10px] text-slate-400 line-through font-mono">
                              MRP {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick 1-click Stock Toggle */}
                    <button
                      onClick={() => handleToggleStock(product)}
                      title="Click to toggle Stock Status"
                      className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        product.inStock
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      {product.inStock ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </button>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setIsNewProduct(false);
                          setEditingProduct({ ...product });
                        }}
                        title="Edit Full Product Details"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title="Delete Product"
                        className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FESTIVAL OFFERS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Festival Sales & Promotional Offers
              </h2>
              <p className="text-xs text-slate-500">
                Add Diwali, Dussehra, Holi or seasonal store discount banners
              </p>
            </div>
            <button
              onClick={() => {
                setIsNewOffer(true);
                setEditingOffer({
                  title: '',
                  festivalName: 'Diwali Special',
                  discountText: 'Flat 35% OFF + Free Gift',
                  discountPercent: 35,
                  description: '',
                  bannerUrl: '/src/assets/images/banner_festival_sale_1793957325851.jpg',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  isActive: true,
                  isLimitedTime: true
                });
              }}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Offer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/7 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={offer.bannerUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {offer.festivalName}
                      </span>
                      {offer.isLimitedTime && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Limited Time
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {offer.title}
                    </h3>
                    <div className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
                      {offer.discountText}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="text-[11px] text-slate-500">
                      Validity: {offer.startDate} to {offer.endDate}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  {/* 1-click Activate / Deactivate Toggle */}
                  <button
                    onClick={() => handleToggleOffer(offer)}
                    className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      offer.isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {offer.isActive ? 'Active on Home' : 'Inactive (Hidden)'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsNewOffer(false);
                        setEditingOffer({ ...offer });
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id, offer.title)}
                      className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STORE MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'store' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs max-w-2xl">
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">
              Shop Information & Contact Details
            </h2>
            <p className="text-xs text-slate-500">
              Update the official shop name, WhatsApp enquiry number, calling phone, and location address
            </p>
          </div>

          <form onSubmit={handleSaveStoreSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={storeForm.tagline}
                onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Shop WhatsApp Number (No + or spaces)</span>
                </label>
                <input
                  type="text"
                  value={storeForm.whatsappNumber}
                  onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="e.g. 919829087654"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Include country code 91 for India</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-700" />
                  <span>Customer Calling Number</span>
                </label>
                <input
                  type="text"
                  value={storeForm.phone}
                  onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  placeholder="+91 98290 87654"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Showroom Full Address</span>
              </label>
              <textarea
                rows={2}
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Showroom Opening Hours
              </label>
              <input
                type="text"
                value={storeForm.openingHours}
                onChange={(e) => setStoreForm({ ...storeForm, openingHours: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Change Admin PIN */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Change Store Owner PIN (Optional)</span>
              </label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Leave blank to keep current PIN"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-md mt-4 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Store Information</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {isNewProduct ? 'Add New Product to Store' : `Edit: ${editingProduct.name}`}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Samsung 55-inch Crystal 4K Smart TV"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="Samsung, LG, Daikin, boAt..."
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    required
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    placeholder="e.g. 41990"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Original Price / M.R.P. (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    placeholder="e.g. 64900"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stock Status & Tags */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Mark as In Stock in Showroom</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Highlight:</span>
                  {(['featured', 'bestseller', 'latest', 'festival_offer'] as const).map((tag) => {
                    const isChecked = editingProduct.tags?.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          const currentTags = editingProduct.tags || [];
                          const updated = isChecked
                            ? currentTags.filter((t) => t !== tag)
                            : [...currentTags, tag];
                          setEditingProduct({ ...editingProduct, tags: updated });
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                          isChecked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {tag.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  placeholder="Key highlight (e.g. 55'' 4K UHD, 100W Fast Charge, 5-Star)"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Product Description & Warranty
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed specs, warranty terms, inclusions in box..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Product Image Upload / Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Images
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="cursor-pointer h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'product')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Current Images Preview */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {(editingProduct.images || []).map((imgUrl, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={imgUrl} alt={`Prod ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingProduct.images || []).filter((_, idx) => idx !== i);
                          setEditingProduct({ ...editingProduct, images: updated });
                        }}
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  {isNewProduct ? 'Add to Showroom' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT FESTIVAL OFFER */}
      {/* ========================================================= */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {isNewOffer ? 'Create Festival Offer' : 'Edit Festival Offer'}
              </h2>
              <button
                onClick={() => setEditingOffer(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={editingOffer.title || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="e.g. Diwali Dhamaka Electronics Mahotsav"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Festival Name *
                  </label>
                  <input
                    type="text"
                    value={editingOffer.festivalName || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, festivalName: e.target.value })}
                    placeholder="Diwali, Dussehra, Holi, New Year..."
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    value={editingOffer.discountPercent || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountPercent: Number(e.target.value) })}
                    placeholder="e.g. 40"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Promotional Headline / Discount Text *
                </label>
                <input
                  type="text"
                  value={editingOffer.discountText || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, discountText: e.target.value })}
                  placeholder="e.g. Up to 45% OFF + Free Gifts on All TVs & ACs"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editingOffer.startDate || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, startDate: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={editingOffer.endDate || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, endDate: e.target.value })}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Offer Description & Inclusions
                </label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  placeholder="Details of free gifts, exchange bonus, participating brands..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingOffer.isActive ?? true}
                    onChange={(e) => setEditingOffer({ ...editingOffer, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Active & Shown to Customers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingOffer.isLimitedTime ?? true}
                    onChange={(e) => setEditingOffer({ ...editingOffer, isLimitedTime: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Highlight Limited Time Badge</span>
                </label>
              </div>

              {/* Banner Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Banner Image
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Custom Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'offer')}
                    className="hidden"
                  />
                </label>
                {editingOffer.bannerUrl && (
                  <div className="mt-2 aspect-21/9 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img src={editingOffer.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
                >
                  {isNewOffer ? 'Publish Offer' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
