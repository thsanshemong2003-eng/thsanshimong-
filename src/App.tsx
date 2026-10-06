import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryNav } from './components/CategoryNav';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SellListingModal } from './components/SellListingModal';
import { OnboardingModal } from './components/OnboardingModal';
import { InboxView } from './components/InboxView';
import { SellerDashboardView } from './components/SellerDashboardView';
import { SellerStoreModal } from './components/SellerStoreModal';
import { AdminModal } from './components/AdminModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { BottomNav } from './components/BottomNav';
import {
  Sparkles,
  MapPin,
  Flame,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Filter,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    listings,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    sortBy,
    selectedListing,
    setSelectedListing,
    showSellModal,
    setShowSellModal,
    showOnboardingModal,
    setShowOnboardingModal,
    showNotificationsDrawer,
    setShowNotificationsDrawer,
    isAdminMode,
    setIsAdminMode,
    selectedCountry,
    t,
  } = useApp();

  // Filter listings based on current state
  const filteredListings = listings.filter((item) => {
    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q) || (item.subcategory || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
    }

    // Category matching
    if (selectedCategory && selectedCategory !== 'All') {
      if (item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // Subcategory matching
    if (selectedSubcategory && selectedSubcategory !== 'All') {
      if (item.subcategory?.toLowerCase() !== selectedSubcategory.toLowerCase()) {
        return false;
      }
    }

    // City matching
    if (selectedCity && selectedCity !== 'All') {
      if (item.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'rating') return (b.sellerRating || 0) - (a.sellerRating || 0);
    return 0; // default newest
  });

  // Featured listings for homepage banner
  const featuredListings = listings.filter((l) => l.featured);

  // Nearby listings (matching current city or country)
  const nearbyListings = listings.filter(
    (l) => l.countryCode === selectedCountry.code || l.city === selectedCity
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-20 md:pb-12">
      {/* Top Main Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Search & Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Global Hyper-Local Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                  BUY • SELL • <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-indigo-300 bg-clip-text text-transparent">ANYWHERE</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Discover verified properties, vehicles, electronics, artisan products, and professional services across {selectedCountry.name} & worldwide.
                </p>

                {/* Primary Search Bar */}
                <div className="pt-2">
                  <SearchBar />
                </div>
              </div>

              {/* Decorative Glow Elements */}
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute right-40 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Category Navigation Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  {t('categories')}
                </h2>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      // reset to All
                      window.location.hash = '';
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                  >
                    View All
                  </button>
                )}
              </div>
              <CategoryNav />
            </div>

            {/* Featured & Highlight Section (e.g. Premium House in Agartala ₹45,00,000, Tesla, MacBook) */}
            {selectedCategory === 'All' && !searchQuery && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                      <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-900 leading-tight">
                        {t('featured')}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Inspected listings with verified ownership documents and ratings
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    {featuredListings.length} Featured
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredListings.slice(0, 4).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )}

            {/* Nearby Listings in Selected City/Region */}
            {selectedCategory === 'All' && !searchQuery && nearbyListings.length > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                      <MapPin className="w-4 h-4 text-rose-600" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-900 leading-tight">
                        {t('nearby')}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Direct sellers in {selectedCity !== 'All' ? selectedCity : selectedCountry.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {nearbyListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </section>
            )}

            {/* All / Filtered Listings Grid */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-display text-slate-900 leading-tight">
                    {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'All' ? `${selectedCategory} Listings` : t('recommended')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {sortedListings.length} verified listings
                  </p>
                </div>
              </div>

              {sortedListings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <span className="text-4xl">🔍</span>
                  <h3 className="font-bold text-base text-slate-800">No listings match your search</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters, selecting a different city, or be the first to sell in this category!
                  </p>
                  <button
                    onClick={() => setShowSellModal(true)}
                    className="mt-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    + Sell Something
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {sortedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB: SEARCH & EXPLORE */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900">
                Explore & Search Listings
              </h2>
              <SearchBar />
              <CategoryNav />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>{sortedListings.length} Results Found</span>
              <span>Sorted by: {sortBy.replace('_', ' ').toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sortedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* TAB: INBOX (Buyer ↔ Seller Chat) */}
        {activeTab === 'inbox' && (
          <div>
            <InboxView />
          </div>
        )}

        {/* TAB: ME (Seller Profile & Dashboard) */}
        {activeTab === 'me' && (
          <div>
            <SellerDashboardView />
          </div>
        )}
      </main>

      {/* Responsive Bottom Navigation with standout center SELL button */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />

      <SellListingModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />

      <SellerStoreModal />

      <NotificationsDrawer
        isOpen={showNotificationsDrawer}
        onClose={() => setShowNotificationsDrawer(false)}
      />

      <AdminModal
        isOpen={isAdminMode}
        onClose={() => setIsAdminMode(false)}
      />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <MainApp />
      )}
    </AppProvider>
  );
}
