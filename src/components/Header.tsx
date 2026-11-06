import React from 'react';
import { Phone, MessageCircle, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { StoreInfo } from '../types';
import { createCallUrl, createGeneralWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  storeInfo: StoreInfo;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeInfo,
  onOpenAdmin,
  isAdminLoggedIn,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top trust micro-strip */}
      <div className="bg-slate-900 text-white text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Diwali & Festival Mega Savings • 100% Genuine Brand Warranty • Free Delivery in Tehsil</span>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base tracking-tighter shadow-sm group-hover:bg-blue-600 transition-colors">
            RE
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {storeInfo.name}
            </div>
            <div className="text-[11px] font-medium text-slate-500 tracking-normal hidden sm:block">
              {storeInfo.tagline}
            </div>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick WhatsApp */}
          <a
            href={createGeneralWhatsAppUrl(storeInfo)}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="h-9 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-transparent" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Quick Call */}
          <a
            href={createCallUrl(storeInfo.phone)}
            title="Call Store Now"
            className="h-9 px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Call Store</span>
          </a>

          {/* Admin Dashboard Switch */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? "Admin Dashboard (Active)" : "Owner Admin Login"}
            className={`h-9 px-2.5 sm:px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAdminLoggedIn
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Admin Mode</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Owner Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
