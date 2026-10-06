import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, MapPin, CheckCircle2, MessageSquare, Sparkles, Star } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  const {
    formatCurrentPrice,
    toggleSaveListing,
    isSaved,
    startChatWithSeller,
    setSelectedListing,
  } = useApp();

  const saved = isSaved(listing.id);

  const handleClick = () => {
    setSelectedListing(listing);
    if (onSelect) onSelect();
  };

  const handleQuickChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    startChatWithSeller(listing);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveListing(listing.id);
  };

  // Render spec pills tailored to category
  const renderSpecPill = () => {
    if (listing.type === 'property' && listing.propertyDetails) {
      const p = listing.propertyDetails;
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 truncate">
          {p.bedrooms ? <span>{p.bedrooms} Beds</span> : null}
          {p.bathrooms ? <span>• {p.bathrooms} Baths</span> : null}
          {p.area ? <span>• {p.area} {p.areaUnit}</span> : null}
        </div>
      );
    }
    if (listing.type === 'vehicle' && listing.vehicleDetails) {
      const v = listing.vehicleDetails;
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 truncate">
          <span>{v.year}</span>
          <span>• {v.mileage.toLocaleString()} {v.mileageUnit}</span>
          <span>• {v.fuelType}</span>
        </div>
      );
    }
    if (listing.type === 'service' && listing.serviceDetails) {
      const s = listing.serviceDetails;
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 truncate">
          <span className="capitalize">{s.rateType}</span>
          <span>• {s.experienceYears} yrs exp</span>
          {s.emergencyAvailable && <span className="text-rose-600 font-bold">• 24/7</span>}
        </div>
      );
    }
    if (listing.type === 'product' && listing.productDetails) {
      const pr = listing.productDetails;
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 truncate">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{pr.condition}</span>
          {pr.brand && <span>{pr.brand}</span>}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Gallery Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {listing.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Featured
            </span>
          )}
          {listing.urgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Urgent
            </span>
          )}
        </div>

        {/* Wishlist / Save Button */}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save listing'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-2xl backdrop-blur-md transition-all z-10 ${
            saved
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Photos counter */}
        {listing.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
            📷 {listing.images.length}
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold shadow-2xs">
          {listing.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        <div>
          {/* Price & Negotiable */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="text-lg font-black font-display text-slate-900">
              {formatCurrentPrice(listing.price, listing.currency)}
              {listing.serviceDetails?.rateType === 'hourly' && (
                <span className="text-xs font-normal text-slate-500"> /hr</span>
              )}
            </div>
            {listing.negotiable && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Negotiable
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors mb-1.5 leading-snug">
            {listing.title}
          </h3>

          {/* Specs Snippet */}
          <div className="mb-2">{renderSpecPill()}</div>
        </div>

        {/* Location & Seller Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">{listing.city}, {listing.country}</span>
          </div>

          {/* Seller micro info & Chat trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{listing.sellerRating}</span>
              {listing.verifiedSeller && (
                <span title="Verified Seller">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                </span>
              )}
            </div>

            <button
              onClick={handleQuickChat}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
              title="Chat with seller"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
