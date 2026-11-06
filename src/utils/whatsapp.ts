import { Product, StoreInfo } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function createProductWhatsAppUrl(product: Product, storeInfo: StoreInfo): string {
  const cleanPhone = storeInfo.whatsappNumber.replace(/[^0-9]/g, '');
  
  const discountText = product.originalPrice && product.originalPrice > product.price
    ? `\n*MRP:* ${formatCurrency(product.originalPrice)} (${product.discountPercentage}% OFF)`
    : '';

  const message = `*Namaste RATNAWAT ELECTRONICS*,

I am interested in buying this product:
📦 *Product:* ${product.name}
🏷️ *Brand:* ${product.brand}
💰 *Offer Price:* ${formatCurrency(product.price)}${discountText}
📊 *Status:* ${product.inStock ? 'In Stock' : 'Check Availability'}

*Description:* ${product.shortDescription || product.name}

Could you please confirm the current stock and best deal for pickup/delivery?

Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createGeneralWhatsAppUrl(storeInfo: StoreInfo, topic?: string): string {
  const cleanPhone = storeInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const message = topic 
    ? `*Namaste RATNAWAT ELECTRONICS*, I would like to enquire about: ${topic}.`
    : `*Namaste RATNAWAT ELECTRONICS*, I would like to enquire about electronics and appliances at your showroom.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createCallUrl(phone: string): string {
  const clean = phone.replace(/[^0-9+]/g, '');
  return `tel:${clean}`;
}

export function createDirectionsUrl(address: string, customUrl?: string): string {
  if (customUrl && customUrl.startsWith('http')) return customUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
