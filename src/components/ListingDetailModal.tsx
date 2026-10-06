import React, { useState } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  Heart,
  Share2,
  AlertTriangle,
  MessageSquare,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
  Send,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const {
    formatCurrentPrice,
    toggleSaveListing,
    isSaved,
    startChatWithSeller,
    submitReport,
    setSelectedSellerStore,
    t,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(listing ? Math.round(listing.price * 0.9) : 0);
  const [offerMessage, setOfferMessage] = useState('');
  const [reportReason, setReportReason] = useState<'Spam' | 'Fraud / Scam' | 'Inaccurate Details' | 'Prohibited Goods' | 'Harassment' | 'Duplicate'>('Inaccurate Details');
  const [reportNotes, setReportNotes] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const saved = isSaved(listing.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out ${listing.title} on Veylora: ${formatCurrentPrice(listing.price, listing.currency)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSendOffer = () => {
    const text = `I would like to make an offer of ${formatCurrentPrice(offerAmount, listing.currency)}. ${offerMessage}`;
    startChatWithSeller(listing, text);
    setShowOfferModal(false);
    onClose();
  };

  const handleReportSubmit = () => {
    submitReport({
      listingId: listing.id,
      reporterId: 'usr_me_01',
      reporterName: 'Buyer',
      reason: reportReason,
      notes: reportNotes || 'Reported from listing view',
    });
    setShowReportModal(false);
    alert('Thank you. Our moderation team will review this listing within 2 hours.');
  };

  const handleViewStore = () => {
    setSelectedSellerStore({
      sellerId: listing.sellerId,
      name: listing.sellerName,
      username: listing.sellerUsername,
      avatar: listing.sellerAvatar,
      rating: listing.sellerRating,
      reviewsCount: listing.sellerReviewsCount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Sticky top action bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              {listing.category}
            </span>
            {listing.subcategory && (
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                {listing.subcategory}
              </span>
            )}
            {listing.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveListing(listing.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                saved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Save listing"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Report listing"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Media Carousel */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 rounded-2xl overflow-hidden group">
            <img
              src={listing.images[activeImageIndex] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />

            {listing.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? listing.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === listing.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
              {activeImageIndex + 1} / {listing.images.length}
            </div>
          </div>

          {/* Thumbnails row */}
          {listing.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-rose-500 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Price & Title Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
                  {formatCurrentPrice(listing.price, listing.currency)}
                </span>
                {listing.serviceDetails?.rateType === 'hourly' && (
                  <span className="text-sm font-semibold text-slate-500">/ hour</span>
                )}
                {listing.negotiable && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                    Price Negotiable
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-snug">
                {listing.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-semibold text-slate-700">{listing.location || `${listing.city}, ${listing.country}`}</span>
                <span>•</span>
                <span className="text-xs text-slate-400">Listed {listing.createdAt}</span>
              </div>
            </div>

            {/* Quick Action Pill on Desktop */}
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shrink-0 shadow-2xs"
            >
              🤝 Make an Offer
            </button>
          </div>

          {/* Category-Specific Detailed Specifications */}
          {listing.type === 'property' && listing.propertyDetails && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                Property Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Property Type</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.propertyType}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Super Built-up Area</span>
                  <span className="text-sm font-bold text-slate-800">
                    {listing.propertyDetails.area} {listing.propertyDetails.areaUnit}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Bedrooms</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.bedrooms || 'N/A'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Bathrooms</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.bathrooms || 'N/A'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Furnishing</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.furnishing || 'Unfurnished'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Ownership / Legal</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.ownershipDetails || 'Clear Title'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Floor</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.floorNumber || 'Independent'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Parking</span>
                  <span className="text-sm font-bold text-slate-800">{listing.propertyDetails.parkingSpaces || 1} Covered</span>
                </div>
              </div>
            </div>
          )}

          {listing.type === 'vehicle' && listing.vehicleDetails && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Vehicle Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Year</span>
                  <span className="text-sm font-bold text-slate-800">{listing.vehicleDetails.year}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Mileage</span>
                  <span className="text-sm font-bold text-slate-800">
                    {listing.vehicleDetails.mileage.toLocaleString()} {listing.vehicleDetails.mileageUnit}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Fuel Type</span>
                  <span className="text-sm font-bold text-slate-800">{listing.vehicleDetails.fuelType}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Transmission</span>
                  <span className="text-sm font-bold text-slate-800">{listing.vehicleDetails.transmission}</span>
                </div>
              </div>
            </div>
          )}

          {listing.type === 'product' && listing.productDetails && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Product Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Condition</span>
                  <span className="text-sm font-bold text-slate-800">{listing.productDetails.condition}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Brand</span>
                  <span className="text-sm font-bold text-slate-800">{listing.productDetails.brand || 'Original'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Warranty</span>
                  <span className="text-sm font-bold text-slate-800">{listing.productDetails.warranty || 'Standard'}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="block text-[11px] text-slate-400 font-medium">Delivery</span>
                  <span className="text-sm font-bold text-slate-800">
                    {listing.productDetails.deliveryAvailable ? 'Available' : 'Pickup Only'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 mb-2">
              Description
            </h3>
            <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed bg-white border border-slate-100 p-4 rounded-2xl">
              {listing.description}
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.sellerAvatar}
                    alt={listing.sellerName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold font-display">{listing.sellerName}</h4>
                      {listing.verifiedSeller && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Seller ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">@{listing.sellerUsername}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {listing.sellerRating}
                      </span>
                      <span>({listing.sellerReviewsCount} reviews)</span>
                      <span>•</span>
                      <span>48 Listings</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleViewStore}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>View Seller Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Email verified ✓</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Phone verified ✓</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Identity verified ✓</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Business verified ✓</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Property docs ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fixed Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>🛡 Veylora Buyer Protection</span>
            <span>•</span>
            <span>🔒 Direct In-Person / Escrow Verified</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowContactModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Contact Seller</span>
            </button>

            <button
              onClick={() => {
                startChatWithSeller(listing);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/25 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Seller</span>
            </button>
          </div>
        </div>

        {/* Contact Seller Modal */}
        {showContactModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold font-display text-base text-slate-900">
                  Contact {listing.sellerName}
                </h4>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${listing.sellerPhone || '+919876543210'}`}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-rose-500" />
                    Call Direct
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {listing.sellerPhone || '+91 98765 43210'}
                  </span>
                </a>

                <a
                  href={`https://wa.me/${(listing.sellerWhatsapp || '919876543210').replace(/\D/g, '')}?text=Hi,%20I%20am%20interested%20in%20your%20listing:%20${encodeURIComponent(listing.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-900 text-sm font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">💬</span>
                    WhatsApp Message
                  </span>
                  <span className="text-xs font-mono text-emerald-700">Open Chat</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Tip: For your security, never transfer advance deposits before inspecting the property or item in person.
              </p>
            </div>
          </div>
        )}

        {/* Make an Offer Modal */}
        {showOfferModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold font-display text-base text-slate-900">
                  Make an Offer
                </h4>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <span className="text-xs text-slate-500">Listed Price:</span>
                <span className="ml-2 font-bold text-slate-800">
                  {formatCurrentPrice(listing.price, listing.currency)}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Offer Amount ({listing.currency})
                </label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add note to seller (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ready for cash payment this weekend"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <button
                onClick={handleSendOffer}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Offer to Seller
              </button>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
              <h4 className="font-bold font-display text-base text-slate-900 mb-2">
                Report this Listing
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Help keep the Veylora global marketplace safe and verified.
              </p>

              <div className="space-y-2 mb-4">
                {(['Spam', 'Fraud / Scam', 'Inaccurate Details', 'Prohibited Goods', 'Duplicate'] as const).map(
                  (reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="report_reason"
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{reason}</span>
                    </label>
                  )
                )}
              </div>

              <textarea
                placeholder="Additional details for the moderation team..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none mb-4"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
