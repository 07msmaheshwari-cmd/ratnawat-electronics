import React, { useState } from 'react';
import { MessageCircle, CheckCircle2, XCircle, ArrowUpRight, Zap } from 'lucide-react';
import { Product, StoreInfo } from '../types';
import { formatCurrency, createProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  storeInfo: StoreInfo;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  storeInfo,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);
  const mainImage = product.images?.[0] || '/src/assets/images/category_smart_tv_1793957324649.jpg';

  const discountPercent = product.discountPercentage ?? (
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  );

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
    >
      {/* Image container: 65-70% height with solid neutral background */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={mainImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-400">
            <Zap className="w-8 h-8 stroke-[1.5] text-slate-400 mb-1" />
            <span className="text-xs text-slate-500 font-medium">{product.brand}</span>
          </div>
        )}

        {/* Subtle Discount Tag (No garish bubble) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md tracking-tight">
            {discountPercent}% OFF
          </div>
        )}

        {/* Stock Status indicator on top right */}
        <div className="absolute top-2.5 right-2.5">
          {product.inStock ? (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-rose-700 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed clean metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{product.categoryId.replace('-', ' ')}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & CTA Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes</div>
          </div>

          {/* WhatsApp Direct Action Button */}
          <a
            href={createProductWhatsAppUrl(product, storeInfo)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Enquire on WhatsApp"
            className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
};
