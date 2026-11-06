import React from 'react';
import { Sparkles, Calendar, Tag, MessageCircle, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Offer, Product, StoreInfo } from '../types';
import { ProductCard } from '../components/ProductCard';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';

interface OffersViewProps {
  offers: Offer[];
  products: Product[];
  storeInfo: StoreInfo;
  onSelectProduct: (product: Product) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  offers,
  products,
  storeInfo,
  onSelectProduct,
}) => {
  const activeOffers = offers.filter((o) => o.isActive);

  // Group products with festival tags
  const dealProducts = products.filter((p) => p.tags?.includes('festival_offer') || (p.discountPercentage && p.discountPercentage >= 30));

  return (
    <div className="space-y-6 pb-16">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-amber-100 text-amber-800">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-800">
            Festive Savings & Mega Discounts
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Current Festival Offers & Special Sales
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Exclusive showroom festival discounts, exchange bonuses & zero EMI schemes at RATNAWAT ELECTRONICS
        </p>
      </div>

      {/* Active Festival Offer Cards */}
      <div className="space-y-4">
        {activeOffers.map((offer) => {
          const whatsappUrl = createGeneralWhatsAppUrl(
            storeInfo,
            `Enquiry about ${offer.title} (${offer.festivalName})`
          );

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Banner Image */}
                <div className="relative md:col-span-5 aspect-16/9 md:aspect-auto w-full bg-slate-900 overflow-hidden min-h-[180px]">
                  <img
                    src={offer.bannerUrl || '/src/assets/images/banner_festival_sale_1793957325851.jpg'}
                    alt={offer.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                      {offer.festivalName}
                    </span>
                    {offer.isLimitedTime && (
                      <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                        Limited Time
                      </span>
                    )}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="md:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {offer.title}
                    </h2>

                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{offer.discountText}</span>
                    </div>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        Valid {offer.startDate ? `${new Date(offer.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ` : ''}
                        {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Festival Products Grid */}
      {dealProducts.length > 0 && (
        <section className="pt-4">
          <div className="mb-3.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Products on Special Festival Offer
            </h2>
            <p className="text-xs text-slate-500">
              Pick your favorite model and message us on WhatsApp for extra in-store discount
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {dealProducts.map((product) => (
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

      {/* Trust reassurance */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-800">RATNAWAT Price Match Guarantee:</span> All festival offers are backed by authorized brand warranties. We offer fair village-first pricing, zero documentation hassle for local finance, and immediate delivery.
        </div>
      </div>
    </div>
  );
};
