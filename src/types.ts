export type ListingType = 'product' | 'property' | 'vehicle' | 'service' | 'business' | 'other';

export type ListingStatus = 'active' | 'draft' | 'sold' | 'expired';

export interface PropertyDetails {
  propertyType: 'House' | 'Apartment' | 'Land' | 'Shop' | 'Office' | 'Commercial' | 'Rent';
  area: number; // in sq ft or acres
  areaUnit: 'sq ft' | 'acres' | 'sq yards' | 'sq m';
  bedrooms?: number;
  bathrooms?: number;
  furnishing?: 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';
  parkingSpaces?: number;
  ownershipDetails?: 'Freehold' | 'Leasehold' | 'Power of Attorney' | 'Direct Owner';
  floorNumber?: string;
  totalFloors?: number;
  facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West';
  constructionYear?: number;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  mileage: number;
  mileageUnit: 'km' | 'miles';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Automatic' | 'Manual';
  vehicleType: 'Car' | 'Bike' | 'Scooter' | 'Commercial Vehicle' | 'Truck' | 'Other';
  condition: 'Brand New' | 'Pristine' | 'Excellent' | 'Good' | 'Fair';
  registeredCountry?: string;
  color?: string;
}

export interface ServiceDetails {
  rateType: 'hourly' | 'fixed' | 'consultation' | 'per day';
  serviceCategory: 'Construction' | 'Electrician' | 'Plumbing' | 'Design' | 'Photography' | 'Repair' | 'Education' | 'Other';
  experienceYears: number;
  serviceRadiusKm: number;
  emergencyAvailable?: boolean;
  warrantyPeriod?: string;
}

export interface ProductDetails {
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  brand?: string;
  model?: string;
  warranty?: string;
  deliveryAvailable?: boolean;
  productCategory: 'Fashion' | 'Electronics' | 'Furniture' | 'Home' | 'Books' | 'Handmade' | 'Sports' | 'Other';
}

export interface BusinessDetails {
  businessType: 'Retail' | 'Restaurant / Cafe' | 'Franchise' | 'Tech Startup' | 'E-commerce' | 'Manufacturing' | 'Other';
  annualRevenue?: string;
  monthlyProfit?: string;
  employeesCount?: number;
  inventoryIncluded?: boolean;
  establishedYear?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  negotiable: boolean;
  status: ListingStatus;
  featured?: boolean;
  urgent?: boolean;
  
  // Location
  country: string;
  countryCode: string;
  city: string;
  location: string; // Specific area/address
  coordinates?: { lat: number; lng: number };

  // Media
  images: string[];
  videoUrl?: string;

  // Specific detail schemas
  propertyDetails?: PropertyDetails;
  vehicleDetails?: VehicleDetails;
  serviceDetails?: ServiceDetails;
  productDetails?: ProductDetails;
  businessDetails?: BusinessDetails;

  // Seller info
  sellerId: string;
  sellerName: string;
  sellerUsername: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerReviewsCount: number;
  verifiedSeller: boolean;
  sellerPhone?: string;
  sellerWhatsapp?: string;
  sellerEmail?: string;
  sellerBadges?: {
    emailVerified?: boolean;
    phoneVerified?: boolean;
    identityVerified?: boolean;
    businessVerified?: boolean;
    propertyDocsVerified?: boolean;
  };

  // Engagement stats
  views: number;
  saves: number;
  messagesCount: number;
  shares: number;
  createdAt: string;
  updatedAt?: string;

  // Contact preferences
  contactOptions: {
    chat: boolean;
    phone: boolean;
    whatsapp: boolean;
    hidePhoneUntilChat?: boolean;
  };
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  language: string;
  currency: string;
  isSeller: boolean;
  storeName?: string;
  storeBio?: string;
  followersCount: number;
  followingCount: number;
  rating: number;
  reviewsCount: number;
  verifiedBadges: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    businessVerified: boolean;
    propertyDocsVerified: boolean;
  };
  savedListingIds: string[];
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  listingId?: string;
  imageAttachment?: string;
  offerAmount?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'countered';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRating?: number;
  isVerified?: boolean;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: number;
  listingCurrency?: string;
  listingImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isBlocked?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'listing_approved' | 'listing_saved' | 'follower' | 'price_update' | 'order_update' | 'security_alert';
  timestamp: string;
  read: boolean;
  listingId?: string;
  senderAvatar?: string;
  actionUrl?: string;
}

export interface ReportItem {
  id: string;
  listingId?: string;
  reportedUserId?: string;
  reporterId: string;
  reporterName: string;
  reason: 'Spam' | 'Fraud / Scam' | 'Inaccurate Details' | 'Prohibited Goods' | 'Harassment' | 'Duplicate';
  notes: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'Identity' | 'Business' | 'Property Documents';
  documentName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  defaultLanguage: string;
  popularCities: string[];
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
}
