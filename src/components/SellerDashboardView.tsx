import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Award,
  Plus,
  CheckCircle2,
  Share2,
  Trash2,
  Sparkles,
  Settings,
  Heart,
  Globe,
  DollarSign,
  Shield,
  FileCheck,
  Smartphone,
  Mail,
  UserCheck,
  Building,
  Upload,
} from 'lucide-react';
import { COUNTRIES, LANGUAGES, CURRENCY_SYMBOLS } from '../translations';
import { ListingCard } from './ListingCard';

export const SellerDashboardView: React.FC = () => {
  const {
    user,
    listings,
    deleteListing,
    updateListing,
    setShowSellModal,
    submitVerification,
    verificationRequests,
    selectedCountry,
    setCountry,
    selectedLanguage,
    setLanguage,
    selectedCurrency,
    setCurrency,
    formatCurrentPrice,
    setSelectedListing,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'analytics' | 'saved' | 'verification' | 'settings'>('listings');
  const [listingFilter, setListingFilter] = useState<'active' | 'draft' | 'sold' | 'expired'>('active');
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [docType, setDocType] = useState<'Identity' | 'Business' | 'Property Documents'>('Property Documents');

  // Filter listings belonging to this user
  const myListings = listings.filter((l) => l.sellerId === user.id || l.sellerName === user.firstName || l.sellerName === user.storeName);
  const filteredMyListings = myListings.filter((l) => l.status === listingFilter);

  // Saved listings
  const savedListings = listings.filter((l) => user.savedListingIds.includes(l.id));

  // Metrics
  const totalViews = myListings.reduce((acc, l) => acc + (l.views || 0), 8421);
  const totalMessages = myListings.reduce((acc, l) => acc + (l.messagesCount || 0), 89);
  const totalSaves = myListings.reduce((acc, l) => acc + (l.saves || 0), 342);
  const totalDeals = 17;

  const handleBoostListing = (id: string) => {
    updateListing(id, { featured: true });
    alert('Listing boosted to Featured! It will appear prominently on homepage highlights.');
  };

  const handleMarkSold = (id: string) => {
    updateListing(id, { status: 'sold' });
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedDocName.trim()) return;
    submitVerification(docType, uploadedDocName);
    alert(`Submitted "${uploadedDocName}" for ${docType} verification. Admin moderation will review it shortly.`);
    setUploadedDocName('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Seller Store Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Cover Banner */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              {user.isSeller ? 'Seller Account' : 'Member'}
            </span>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-xs">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                  {user.storeName || `${user.firstName}'s Store`}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Seller ✓
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                @{user.username} • {user.city}, {user.country}
              </p>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  ★ {user.rating} ({user.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span>{myListings.length} Listings</span>
                <span>•</span>
                <span>{user.followersCount + (isFollowing ? 1 : 0)} Followers</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                isFollowing
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10'
              }`}
            >
              {isFollowing ? 'Following ✓' : '+ Follow'}
            </button>

            <button
              onClick={() => setShowSellModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Listing</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="px-6 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3.5 px-3 border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Listings ({myListings.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-3 border-b-2 transition-all ${
              activeTab === 'analytics'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Analytics & Views
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3.5 px-3 border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Items ({savedListings.length})
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3.5 px-3 border-b-2 transition-all ${
              activeTab === 'verification'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Verification Center ✓
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-3 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Account Settings
          </button>
        </div>
      </div>

      {/* TAB 1: My Listings View */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Sub status filters */}
          <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['active', 'draft', 'sold', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setListingFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                    listingFilter === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSellModal(true)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>

          {/* Listings List */}
          {filteredMyListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <span className="text-4xl">🏷</span>
              <h3 className="font-bold text-base text-slate-800">
                No {listingFilter} listings right now
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                List products, property, vehicles, or services to start receiving inquiries and offers.
              </p>
              <button
                onClick={() => setShowSellModal(true)}
                className="mt-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                + Create New Listing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMyListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div
                    onClick={() => setSelectedListing(item)}
                    className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="font-black text-rose-600">
                          {formatCurrentPrice(item.price, item.currency)}
                        </span>
                        <span>•</span>
                        <span>👁 {item.views} Views</span>
                        <span>•</span>
                        <span>💬 {item.messagesCount} Messages</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this listing */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {!item.featured && (
                      <button
                        onClick={() => handleBoostListing(item.id)}
                        className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Boost
                      </button>
                    )}

                    {item.status === 'active' && (
                      <button
                        onClick={() => handleMarkSold(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        Mark Sold
                      </button>
                    )}

                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Analytics View */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top 4 Stats Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="block text-[11px] uppercase font-bold text-slate-400">Total Listings</span>
              <span className="text-3xl font-black font-display text-slate-900 mt-1 block">
                {myListings.length || 42}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                +4 this week
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="block text-[11px] uppercase font-bold text-slate-400">Total Views</span>
              <span className="text-3xl font-black font-display text-slate-900 mt-1 block">
                {totalViews.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
                8,421 organic reach
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="block text-[11px] uppercase font-bold text-slate-400">Messages & Inquiries</span>
              <span className="text-3xl font-black font-display text-slate-900 mt-1 block">
                {totalMessages}
              </span>
              <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
                89 leads closed
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="block text-[11px] uppercase font-bold text-slate-400">Deals Finalized</span>
              <span className="text-3xl font-black font-display text-slate-900 mt-1 block">
                {totalDeals}
              </span>
              <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
                100% positive reviews
              </span>
            </div>
          </div>

          {/* Performance Breakdown Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold font-display text-base text-slate-900">
              Listing Performance Breakdown
            </h3>

            <div className="divide-y divide-slate-100">
              {myListings.map((l) => (
                <div key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {l.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      📍 {l.city}, {l.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700 shrink-0">
                    <span>👁 {l.views}</span>
                    <span>♡ {l.saves}</span>
                    <span>💬 {l.messagesCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Saved Wishlist Items */}
      {activeTab === 'saved' && (
        <div>
          {savedListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No saved items yet</h3>
              <p className="text-xs text-slate-400">
                Tap the heart icon on any listing to keep track of prices and updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Verification Center */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                Trust & Verification Center
              </span>
              <h2 className="text-2xl font-bold font-display">
                Get Verified for 3x Faster Sales
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Verified sellers enjoy priority search placement, the Gold verification checkmark, and higher buyer trust.
              </p>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Email Verified</h4>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Active ✓
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Phone Verified</h4>
                  <p className="text-[11px] text-slate-400">{user.phone}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Active ✓
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Identity Verified</h4>
                  <p className="text-[11px] text-slate-400">National ID / Passport</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Active ✓
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Business Verified</h4>
                  <p className="text-[11px] text-slate-400">Tax & Registration</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                Active ✓
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between col-span-1 sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Property Documents Verified</h4>
                  <p className="text-[11px] text-slate-400">Agartala Municipal Clearance & Title Deeds approved</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Verified ✓
              </span>
            </div>
          </div>

          {/* Submit Document Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold font-display text-base text-slate-900 mb-2">
              Submit Additional Verification Documents
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload municipal land deed, tax certification, or commercial trade license.
            </p>

            <form onSubmit={handleUploadDoc} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Property Documents">Property Documents (Deed / Clearance)</option>
                  <option value="Business">Business Registration (GST / License)</option>
                  <option value="Identity">Government Identity (Passport / ID)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">File Name or Link</label>
                <input
                  type="text"
                  placeholder="e.g. Deed_Plot42_Certified.pdf"
                  value={uploadedDocName}
                  onChange={(e) => setUploadedDocName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold font-display text-slate-900">
            Platform & Account Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Country & Region
              </label>
              <select
                value={selectedCountry.code}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Language
              </label>
              <select
                value={selectedLanguage.code}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Base Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_SYMBOLS[curr]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Veylora Build v3.4.0 • Worldwide Hyper-Local Protocol
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('veylora_onboarding_completed');
                window.location.reload();
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Reset Session & Relaunch Onboarding
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
