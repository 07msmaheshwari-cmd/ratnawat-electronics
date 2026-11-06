export interface ProductSpecification {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  originalPrice: number;
  price: number;
  discountPercentage?: number;
  shortDescription: string;
  description: string;
  inStock: boolean;
  images: string[];
  specifications: ProductSpecification;
  tags: ('featured' | 'bestseller' | 'latest' | 'festival_offer')[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Offer {
  id: string;
  title: string;
  festivalName: string;
  description: string;
  bannerUrl: string;
  discountText: string;
  discountPercent?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isLimitedTime: boolean;
  createdAt: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours: string;
  googleMapsUrl: string;
  logoUrl?: string;
  aboutText: string;
}

export interface AdminCredentials {
  passwordHash?: string;
  pin: string;
}

export interface DatabaseSchema {
  storeInfo: StoreInfo;
  categories: Category[];
  products: Product[];
  offers: Offer[];
  admin: AdminCredentials;
}
