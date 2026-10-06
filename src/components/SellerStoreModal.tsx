import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Star, MessageSquare, Phone, Share2, Layers } from 'lucide-react';
import { ListingCard } from './ListingCard';

export const SellerStoreModal: React.FC = () => {
  const {
    selectedSellerStore,
    setSelectedSellerStore,
    listings,
    startChatWithSeller,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [following, setFollowing] = useState(false);

  if (!selectedSellerStore) return null;

  const sellerListings = listings.filter(
    (l) => l.sellerId === selectedSellerStore.sellerId || l.sellerName === selectedSellerStore.name
  );

  const filtered = activeTab === 'all'
    ? sellerListings
    : sellerListings.filter((l) => l.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedSellerStore(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover */}
        <div className="h-40 sm:h-52 bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 relative shrink-0"></div>

        {/* Profile Card Header */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 bg-white shrink-0 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <img
              src={selectedSellerStore.avatar}
              alt={selectedSellerStore.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                  {selectedSellerStore.name}'s Store
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Seller ✓
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">@{selectedSellerStore.username}</p>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mt-2">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {selectedSellerStore.rating} ({selectedSellerStore.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span>{sellerListings.length} Active Listings</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFollowing(!following)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                following
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {following ? 'Following ✓' : 'Follow'}
            </button>

            {sellerListings[0] && (
              <button
                onClick={() => {
                  startChatWithSeller(sellerListings[0]);
                  setSelectedSellerStore(null);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl ${
              activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            All Items ({sellerListings.length})
          </button>
          <button
            onClick={() => setActiveTab('property')}
            className={`px-3 py-1.5 rounded-xl ${
              activeTab === 'property' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            Property
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-3 py-1.5 rounded-xl ${
              activeTab === 'product' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`px-3 py-1.5 rounded-xl ${
              activeTab === 'vehicle' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-1.5 rounded-xl ${
              activeTab === 'service' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
            }`}
          >
            Services
          </button>
        </div>

        {/* Seller's Listings Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No items in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onSelect={() => setSelectedSellerStore(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
