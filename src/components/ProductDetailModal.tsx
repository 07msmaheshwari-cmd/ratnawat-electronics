import React, { useState } from 'react';
import { X, MessageCircle, Phone, MapPin, CheckCircle, XCircle, Share2, Shield, Wrench, Truck } from 'lucide-react';
import { Product, StoreInfo } from '../types';
import { formatCurrency, createProductWhatsAppUrl, createCallUrl, createDirectionsUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  storeInfo: StoreInfo;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  storeInfo,
  onClose,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/src/assets/images/category_smart_tv_1793957324649.jpg'];

  const discountPercent = product.discountPercentage ?? (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - RATNAWAT ELECTRONICS`,
          text: `Check out ${product.name} at ${formatCurrency(product.price)} at RATNAWAT ELECTRONICS!`,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or failed
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = createProductWhatsAppUrl(product, storeInfo);
  const callUrl = createCallUrl(storeInfo.phone);
  const directionsUrl = createDirectionsUrl(storeInfo.address, storeInfo.googleMapsUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Container */}
      <div 
        className="relative bg-white w-full max-w-3xl rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
              {product.brand}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-500 capitalize">
              {product.categoryId.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              title="Share product link"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top gallery & purchase header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={images[selectedImgIndex] || images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Multiple Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImgIndex === idx ? 'border-blue-600 scale-95 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Details */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h1>

                {/* Stock availability banner */}
                <div className="mt-2.5 flex items-center gap-2">
                  {product.inStock ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready in Showroom / In Stock</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Currently Out of Stock (Available on Order)</span>
                    </div>
                  )}
                </div>

                {/* Pricing Box */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Showroom Special Price</div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                        MRP {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
                        Save {formatCurrency(product.originalPrice! - product.price)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Inclusive of GST • Zero EMI & Finance Options Available In-Store
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                    Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description || product.shortDescription}
                  </p>
                </div>
              </div>

              {/* Store Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <Shield className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-[10px] font-semibold text-slate-800">100% Genuine</div>
                  <div className="text-[9px] text-slate-500">Brand Warranty</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-[10px] font-semibold text-slate-800">Fast Delivery</div>
                  <div className="text-[9px] text-slate-500">Local Area Safe</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <Wrench className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-[10px] font-semibold text-slate-800">Installation</div>
                  <div className="text-[9px] text-slate-500">Free Assistance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <span>Technical Specifications</span>
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 sm:grid-cols-4 p-3 text-xs">
                    <span className="font-semibold text-slate-600 col-span-1">{key}</span>
                    <span className="text-slate-900 col-span-2 sm:col-span-3 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showroom Location Callout */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900">Available at RATNAWAT ELECTRONICS:</span>
              <p className="text-slate-600 mt-0.5">{storeInfo.address}</p>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-800 font-semibold shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Get Showroom Directions</span>
            </a>
          </div>
        </div>

        {/* Sticky Mobile/Desktop Action Bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct Enquiry (Primary CTA) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-[0.99] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enquire on WhatsApp</span>
          </a>

          {/* Call Store */}
          <a
            href={callUrl}
            title="Call Store Now"
            className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Now</span>
          </a>

          {/* Directions */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Get Directions"
            className="h-12 px-3 sm:px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
