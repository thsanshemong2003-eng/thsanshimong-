import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Home,
  Car,
  Wrench,
  Building2,
  Package,
  Layers,
} from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: 'All',
    labelKey: 'all',
    name: 'All',
    icon: Layers,
    subcategories: [],
  },
  {
    id: 'Products',
    labelKey: 'products',
    name: 'Products',
    icon: ShoppingBag,
    color: 'from-amber-500 to-orange-600',
    subcategories: ['All', 'Electronics', 'Fashion', 'Furniture', 'Home', 'Books', 'Handmade', 'Sports'],
  },
  {
    id: 'Property',
    labelKey: 'property',
    name: 'Property',
    icon: Home,
    color: 'from-blue-600 to-indigo-700',
    subcategories: ['All', 'House', 'Apartment', 'Land', 'Shop', 'Office', 'Commercial', 'Rent'],
  },
  {
    id: 'Vehicles',
    labelKey: 'vehicles',
    name: 'Vehicles',
    icon: Car,
    color: 'from-rose-500 to-red-600',
    subcategories: ['All', 'Cars', 'Bikes', 'Scooter', 'Commercial vehicles', 'Electric'],
  },
  {
    id: 'Services',
    labelKey: 'services',
    name: 'Services',
    icon: Wrench,
    color: 'from-emerald-500 to-teal-600',
    subcategories: ['All', 'Electrician', 'Construction', 'Plumbing', 'Design', 'Photography', 'Repair', 'Education'],
  },
  {
    id: 'Business',
    labelKey: 'business',
    name: 'Business',
    icon: Building2,
    color: 'from-violet-500 to-purple-600',
    subcategories: ['All', 'Retail', 'Restaurant / Cafe', 'Tech Startup', 'Franchise', 'Manufacturing'],
  },
  {
    id: 'Others',
    labelKey: 'others',
    name: 'Others',
    icon: Package,
    color: 'from-slate-500 to-slate-700',
    subcategories: ['All', 'Collectibles', 'Tickets', 'Jobs', 'Community'],
  },
];

export const CategoryNav: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
  } = useApp();

  const activeCategoryObj = CATEGORIES_DATA.find((c) => c.id === selectedCategory) || CATEGORIES_DATA[0];

  return (
    <div className="w-full">
      {/* Primary Category Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory('All');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all shadow-2xs ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills (if a category with subcategories is selected) */}
      {activeCategoryObj.subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            {activeCategoryObj.name}:
          </span>
          {activeCategoryObj.subcategories.map((sub) => {
            const isSubSelected = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                  isSubSelected
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70 border border-transparent'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
