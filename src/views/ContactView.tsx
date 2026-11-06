import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Mail, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { StoreInfo } from '../types';
import { createCallUrl, createGeneralWhatsAppUrl, createDirectionsUrl } from '../utils/whatsapp';

interface ContactViewProps {
  storeInfo: StoreInfo;
}

export const ContactView: React.FC<ContactViewProps> = ({ storeInfo }) => {
  const whatsappUrl = createGeneralWhatsAppUrl(storeInfo);
  const callUrl = createCallUrl(storeInfo.phone);
  const directionsUrl = createDirectionsUrl(storeInfo.address, storeInfo.googleMapsUrl);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Visit Our Showroom & Contact Us
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          We welcome you to visit RATNAWAT ELECTRONICS to touch, feel, and test the latest electronics before buying.
        </p>
      </div>

      {/* Showroom Photo Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-16/8 sm:aspect-21/8 border border-slate-200 shadow-sm">
        <img
          src="/src/assets/images/ratnawat_hero_showroom_1793957325986.jpg"
          alt="RATNAWAT ELECTRONICS Showroom"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
          <div className="text-lg sm:text-2xl font-bold tracking-tight">
            {storeInfo.name} Showroom
          </div>
          <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
            {storeInfo.address}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons (3 Core Actions) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-13 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-colors"
        >
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          <span>Chat on WhatsApp</span>
        </a>

        {/* Call Now Button */}
        <a
          href={callUrl}
          className="h-13 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span>Call: {storeInfo.phone}</span>
        </a>

        {/* Get Directions Button */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-13 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-colors"
        >
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>Get Directions</span>
        </a>
      </div>

      {/* Showroom Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address & Hours */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showroom Address
              </h3>
              <p className="text-sm font-semibold text-slate-900 mt-1 leading-snug">
                {storeInfo.address}
              </p>
              <div className="mt-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Store Hours
              </h3>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {storeInfo.openingHours}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                • Open all 7 days for customer convenience
              </p>
            </div>
          </div>
        </div>

        {/* Contact Numbers & Support */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                WhatsApp Enquiry Line
              </h3>
              <p className="text-sm font-semibold text-slate-900 mt-1 font-mono">
                +{storeInfo.whatsappNumber}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant reply on product prices, photos, and stock availability
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email & Direct Support
              </h3>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {storeInfo.email}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                For bulk village orders, school/hospital appliances, and enterprise inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About The Showroom */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          About {storeInfo.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {storeInfo.aboutText}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Award className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Authorized Brand Dealership</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Tax-Paid GST Bills</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Trusted Local Family Business</span>
          </div>
        </div>
      </div>
    </div>
  );
};
