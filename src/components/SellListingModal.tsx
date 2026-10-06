import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingType } from '../types';
import {
  X,
  ShoppingBag,
  Home,
  Car,
  Wrench,
  Building2,
  Package,
  Camera,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../translations';

const SAMPLE_IMAGES_BY_TYPE: Record<ListingType, string[]> = {
  property: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  ],
  product: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  ],
  vehicle: [
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  ],
  service: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
  ],
};

interface SellListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellListingModal: React.FC<SellListingModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    selectedCountry,
    selectedCurrency,
    addListing,
    setSelectedListing,
    t,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [listingType, setListingType] = useState<ListingType>('property');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Property');
  const [subcategory, setSubcategory] = useState('House');
  const [price, setPrice] = useState<number | ''>(4500000);
  const [currency, setCurrency] = useState(selectedCurrency || 'INR');
  const [negotiable, setNegotiable] = useState(true);
  const [country, setCountry] = useState(selectedCountry.name);
  const [city, setCity] = useState(user.city || selectedCountry.popularCities[0] || 'Agartala');
  const [location, setLocation] = useState('Main Road, City Center');
  const [images, setImages] = useState<string[]>(SAMPLE_IMAGES_BY_TYPE.property);

  // Property Details
  const [propertyType, setPropertyType] = useState<'House' | 'Land' | 'Apartment' | 'Shop' | 'Office' | 'Commercial' | 'Rent'>('House');
  const [area, setArea] = useState<number>(2400);
  const [areaUnit, setAreaUnit] = useState<'sq ft' | 'acres' | 'sq yards' | 'sq m'>('sq ft');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [furnishing, setFurnishing] = useState<'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished'>('Semi-Furnished');
  const [ownershipDetails, setOwnershipDetails] = useState<'Freehold' | 'Leasehold' | 'Direct Owner'>('Direct Owner');

  // Vehicle Details
  const [vehicleMake, setVehicleMake] = useState('Honda');
  const [vehicleModel, setVehicleModel] = useState('City');
  const [vehicleYear, setVehicleYear] = useState<number>(2022);
  const [vehicleMileage, setVehicleMileage] = useState<number>(18000);
  const [vehicleFuel, setVehicleFuel] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'>('Petrol');
  const [vehicleTransmission, setVehicleTransmission] = useState<'Automatic' | 'Manual'>('Automatic');

  // Service Details
  const [serviceRateType, setServiceRateType] = useState<'hourly' | 'fixed' | 'consultation'>('hourly');
  const [serviceExp, setServiceExp] = useState<number>(8);
  const [serviceEmergency, setServiceEmergency] = useState(true);

  // Product Details
  const [productCondition, setProductCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [productBrand, setProductBrand] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);

  // Contact options
  const [contactChat, setContactChat] = useState(true);
  const [contactPhone, setContactPhone] = useState(true);
  const [contactWhatsapp, setContactWhatsapp] = useState(true);

  // AI Assistant states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTip, setAiTip] = useState('');

  if (!isOpen) return null;

  const handleSelectType = (type: ListingType) => {
    setListingType(type);
    setImages(SAMPLE_IMAGES_BY_TYPE[type] || []);
    if (type === 'property') {
      setCategory('Property');
      setSubcategory('House');
      setTitle('Premium Independent House in Agartala');
      setPrice(4500000);
    } else if (type === 'product') {
      setCategory('Products');
      setSubcategory('Electronics');
      setTitle('Apple MacBook Pro 16" M3');
      setPrice(2200);
    } else if (type === 'vehicle') {
      setCategory('Vehicles');
      setSubcategory('Cars');
      setTitle('2023 Tesla Model Y AWD');
      setPrice(36000);
    } else if (type === 'service') {
      setCategory('Services');
      setSubcategory('Electrician');
      setTitle('Licensed Master Electrician & Smart Automation');
      setPrice(65);
    } else if (type === 'business') {
      setCategory('Business');
      setSubcategory('Retail');
      setTitle('Established Gourmet Coffee Shop');
      setPrice(95000);
    } else {
      setCategory('Others');
      setSubcategory('Collectibles');
      setTitle('Rare Vintage Collectible');
      setPrice(450);
    }
    setStep(2);
  };

  // AI Listing Assistant Call
  const handleAIAssist = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/gemini/assist-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          type: listingType,
          roughTitle: title || 'Premium verified listing',
          roughDescription: description || `Located in ${city}. High quality, ready to deal.`,
          location: `${city}, ${country}`,
          currency,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        if (resData.data.title) setTitle(resData.data.title);
        if (resData.data.description) setDescription(resData.data.description);
        if (resData.data.conditionTip) setAiTip(resData.data.conditionTip);
        if (resData.data.suggestedPriceMin && (!price || price === 0)) {
          setPrice(resData.data.suggestedPriceMin);
        }
      }
    } catch (err) {
      console.warn('AI assistance fallback:', err);
      // Fallback description
      setDescription(`Key Features & Highlights:
• Inspected and verified in prime condition
• Clear title and legal documentation complete
• Immediate availability for inspection or doorstep dispatch
• Genuine inquiries welcome via Veylora in-app chat or phone`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddSampleImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title) {
      alert('Please enter a listing title.');
      return;
    }

    const newListing = addListing({
      title,
      description: description || 'High quality listing with verified details.',
      type: listingType,
      category,
      subcategory,
      price: typeof price === 'number' ? price : 1000,
      currency,
      negotiable,
      status: 'active',
      featured: true,
      country,
      countryCode: selectedCountry.code,
      city,
      location: location || `${city}, ${country}`,
      images: images.length > 0 ? images : SAMPLE_IMAGES_BY_TYPE[listingType],
      sellerId: user.id,
      sellerName: user.storeName || `${user.firstName} ${user.lastName}`,
      sellerUsername: user.username,
      sellerAvatar: user.avatar,
      sellerRating: 4.8,
      sellerReviewsCount: 120,
      verifiedSeller: true,
      sellerPhone: user.phone,
      sellerWhatsapp: user.phone,
      sellerBadges: {
        emailVerified: true,
        phoneVerified: true,
        identityVerified: true,
        businessVerified: true,
        propertyDocsVerified: true,
      },
      contactOptions: {
        chat: contactChat,
        phone: contactPhone,
        whatsapp: contactWhatsapp,
      },
      propertyDetails:
        listingType === 'property'
          ? {
              propertyType,
              area,
              areaUnit,
              bedrooms,
              bathrooms,
              furnishing,
              ownershipDetails,
            }
          : undefined,
      vehicleDetails:
        listingType === 'vehicle'
          ? {
              make: vehicleMake,
              model: vehicleModel,
              year: vehicleYear,
              mileage: vehicleMileage,
              mileageUnit: 'km',
              fuelType: vehicleFuel,
              transmission: vehicleTransmission,
              vehicleType: 'Car',
              condition: 'Pristine',
            }
          : undefined,
      serviceDetails:
        listingType === 'service'
          ? {
              rateType: serviceRateType,
              serviceCategory: 'Electrician',
              experienceYears: serviceExp,
              serviceRadiusKm: 30,
              emergencyAvailable: serviceEmergency,
            }
          : undefined,
      productDetails:
        listingType === 'product'
          ? {
              condition: productCondition,
              brand: productBrand || 'Original',
              deliveryAvailable,
              productCategory: 'Electronics',
            }
          : undefined,
    });

    onClose();
    setSelectedListing(newListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center font-display font-black text-white text-sm">
              V
            </div>
            <div>
              <h2 className="font-bold font-display text-base">
                {step === 1 ? 'What do you want to list?' : `Create ${category} Listing`}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 1 ? 'Select a category to customize your listing' : 'Fill details or generate with Veylora AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: Category Selection */}
        {step === 1 && (
          <div className="p-6 md:p-8 overflow-y-auto">
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500 block mb-1">
                SELL • BUY • ANYWHERE
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                What do you want to list?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Reach thousands of active buyers with custom verified listing formats.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {[
                { type: 'product' as const, title: '🛍 Product', desc: 'Fashion, Electronics, Home, Books' },
                { type: 'property' as const, title: '🏠 Property', desc: 'House, Land, Apartment, Commercial, Rent' },
                { type: 'vehicle' as const, title: '🚗 Vehicle', desc: 'Cars, Bikes, Commercial, Electric' },
                { type: 'service' as const, title: '🔨 Service', desc: 'Electrician, Plumbing, Design, Repair' },
                { type: 'business' as const, title: '🏢 Business', desc: 'Shops, Franchises, Inventory, Startups' },
                { type: 'other' as const, title: '📦 Other', desc: 'Collectibles, Tickets, Community' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleSelectType(item.type)}
                  className="group flex flex-col items-start p-4 rounded-2xl border border-slate-200/80 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 text-left transition-all bg-white"
                >
                  <span className="text-lg font-bold font-display text-slate-900 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.desc}
                  </span>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Detailed Listing Form */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Quick Category Bar */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Category:</span>
                <span className="text-xs font-black text-slate-800 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                  {listingType.toUpperCase()} • {subcategory}
                </span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change Category
              </button>
            </div>

            {/* Photos & Media Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-rose-500" />
                  Add Photos & Media
                </label>
                <span className="text-[11px] text-slate-400">{images.length} photos selected</span>
              </div>

              {/* Photos Gallery Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group"
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white uppercase">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {/* Add Photo Button */}
                <button
                  type="button"
                  onClick={() => {
                    const samplePool = SAMPLE_IMAGES_BY_TYPE[listingType] || [];
                    const unused = samplePool.find((url) => !images.includes(url));
                    if (unused) setImages([...images, unused]);
                    else alert('All sample photos attached! You can also paste image URLs directly.');
                  }}
                  className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-400 bg-slate-50 hover:bg-rose-50/50 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase">Add Photo</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      if (target.value) {
                        setImages([...images, target.value]);
                        target.value = '';
                      }
                    }
                  }}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white shadow-2xs text-rose-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    AI Listing Generator
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Auto-generate engaging title, bulleted specs, and competitive price suggestion.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 shrink-0"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>

            {aiTip && (
              <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                💡 <strong>Tip:</strong> {aiTip}
              </div>
            )}

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Premium Independent 4BHK House in Agartala"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide comprehensive details, amenities, ownership documents, condition, and contact hours..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Dynamic Category-Specific Fields */}
            {listingType === 'property' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Property Specifics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="House">House</option>
                      <option value="Land">Land / Plot</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Shop">Shop</option>
                      <option value="Office">Office</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Rent">Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Area ({areaUnit})</label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value={1}>1 Bedroom</option>
                      <option value={2}>2 Bedrooms</option>
                      <option value={3}>3 Bedrooms</option>
                      <option value={4}>4 Bedrooms</option>
                      <option value={5}>5+ Bedrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value={1}>1 Bathroom</option>
                      <option value={2}>2 Bathrooms</option>
                      <option value={3}>3 Bathrooms</option>
                      <option value={4}>4+ Bathrooms</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Furnishing</label>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Fully-Furnished">Fully-Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ownership</label>
                    <select
                      value={ownershipDetails}
                      onChange={(e) => setOwnershipDetails(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Direct Owner">Direct Owner</option>
                      <option value="Freehold">Freehold</option>
                      <option value="Leasehold">Leasehold</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {listingType === 'vehicle' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Vehicle Specifics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Make</label>
                    <input
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Model</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Year</label>
                    <input
                      type="number"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={vehicleMileage}
                      onChange={(e) => setVehicleMileage(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fuel Type</label>
                    <select
                      value={vehicleFuel}
                      onChange={(e) => setVehicleFuel(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transmission</label>
                    <select
                      value={vehicleTransmission}
                      onChange={(e) => setVehicleTransmission(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Price & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">
                    {CURRENCY_SYMBOLS[currency] || currency}
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none cursor-pointer"
                >
                  {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                    <option key={curr} value={curr}>
                      {curr} ({CURRENCY_SYMBOLS[curr]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Negotiable Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Price is negotiable (open to offers from buyers)
              </span>
            </label>

            {/* Location (Country, City, Specific Landmark) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area / Landmark
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Contact Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Contact Preferences
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactChat}
                    onChange={(e) => setContactChat(e.target.checked)}
                    className="text-rose-600 focus:ring-rose-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">In-App Chat</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactPhone}
                    onChange={(e) => setContactPhone(e.target.checked)}
                    className="text-rose-600 focus:ring-rose-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">Phone Calls</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.checked)}
                    className="text-rose-600 focus:ring-rose-500 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">WhatsApp</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        {step === 2 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{t('publishListing')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
