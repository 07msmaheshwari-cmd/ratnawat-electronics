import React from 'react';
import { Home, Grid, Tag, MapPin, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'categories' | 'offers' | 'contact' | 'admin';

interface BottomNavProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  activeOfferCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  activeOfferCount,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'categories' as NavTab, label: 'Categories', icon: Grid },
    { 
      id: 'offers' as NavTab, 
      label: 'Offers', 
      icon: Tag,
      badge: activeOfferCount > 0 ? `${activeOfferCount}` : undefined
    },
    { id: 'contact' as NavTab, label: 'Contact', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-colors ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[14px] text-center leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-semibold text-blue-600' : 'font-normal text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
