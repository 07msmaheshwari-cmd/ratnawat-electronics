import { Product, Category, Offer, StoreInfo } from '../types';

const ADMIN_TOKEN_KEY = 'ratnawat_admin_token';

export const api = {
  // Store Info
  async getStoreInfo(): Promise<StoreInfo> {
    const res = await fetch('/api/store-info');
    if (!res.ok) throw new Error('Failed to load store information');
    return res.json();
  },

  async updateStoreInfo(info: Partial<StoreInfo>): Promise<StoreInfo> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/store-info', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(info)
    });
    if (!res.ok) throw new Error('Failed to update store information');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<(Category & { productCount: number })[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    tag?: string;
    search?: string;
    inStock?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.tag && params.tag !== 'all') searchParams.set('tag', params.tag);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.inStock !== undefined) searchParams.set('inStock', String(params.inStock));
    if (params?.sort) searchParams.set('sort', params.sort);

    const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to load product details');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async toggleProductStock(id: string, inStock?: boolean): Promise<Product> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/products/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ inStock })
    });
    if (!res.ok) throw new Error('Failed to toggle stock status');
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    const res = await fetch('/api/offers');
    if (!res.ok) throw new Error('Failed to load offers');
    return res.json();
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(offer)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create offer');
    }
    return res.json();
  },

  async updateOffer(id: string, offer: Partial<Offer>): Promise<Offer> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/offers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(offer)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update offer');
    }
    return res.json();
  },

  async toggleOffer(id: string): Promise<Offer> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/offers/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to toggle offer status');
    return res.json();
  },

  async deleteOffer(id: string): Promise<void> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch(`/api/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete offer');
  },

  // Admin Auth
  async loginAdmin(pinOrPassword: string): Promise<boolean> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pinOrPassword, password: pinOrPassword })
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      return true;
    }
    return false;
  },

  async verifyAdminSession(): Promise<boolean> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  logoutAdmin() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  async changePin(newPin: string): Promise<void> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/admin/change-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newPin })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to change PIN');
    }
  },

  async uploadImage(dataUrl: string, filename?: string): Promise<string> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ dataUrl, filename })
    });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.url;
  },

  async resetData(): Promise<void> {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const res = await fetch('/api/reset-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Reset failed');
  }
};
