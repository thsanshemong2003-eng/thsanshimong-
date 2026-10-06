import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedCountry,
    sortBy,
    setSortBy,
    t,
  } = useApp();

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        {/* Search input container */}
        <div className="relative flex-1 flex items-center bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 px-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick city pill inside search bar */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-100 px-3 py-1.5 mr-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700"
            >
              <option value="All">All Cities</option>
              {selectedCountry.popularCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter & Sort button */}
        <div className="flex items-center gap-2">
          {/* Mobile city select */}
          <div className="md:hidden flex-1 flex items-center gap-1.5 px-3 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent focus:outline-none cursor-pointer truncate"
            >
              <option value="All">All Cities</option>
              {selectedCountry.popularCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFiltersModal(!showFiltersModal)}
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all shadow-2xs ${
              showFiltersModal || sortBy !== 'newest'
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filter drawer / popover */}
      {showFiltersModal && (
        <div className="mt-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sort & Preferences
            </h4>
            <button
              onClick={() => setShowFiltersModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular & Views</option>
                <option value="rating">Top Rated Sellers</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Filter City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
              >
                <option value="All">All Cities in {selectedCountry.name}</option>
                {selectedCountry.popularCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex items-end gap-2">
              <button
                onClick={() => {
                  setSortBy('newest');
                  setSelectedCity('All');
                  setSearchQuery('');
                  setShowFiltersModal(false);
                }}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
