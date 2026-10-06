import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  UserProfile,
  Conversation,
  AppNotification,
  ReportItem,
  VerificationRequest,
  CountryInfo,
  LanguageInfo,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_LISTINGS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  COUNTRIES,
  LANGUAGES,
  TRANSLATIONS,
  TranslationKey,
  formatPrice,
} from '../translations';

interface AppContextType {
  // User & Localization
  user: UserProfile;
  selectedCountry: CountryInfo;
  selectedLanguage: LanguageInfo;
  selectedCurrency: string;
  setCountry: (code: string) => void;
  setLanguage: (code: string) => void;
  setCurrency: (code: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Navigation & Modals
  activeTab: 'home' | 'search' | 'sell' | 'inbox' | 'me' | 'admin';
  setActiveTab: (tab: 'home' | 'search' | 'sell' | 'inbox' | 'me' | 'admin') => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  selectedSellerStore: { sellerId: string; name: string; username: string; avatar: string; rating: number; reviewsCount: number } | null;
  setSelectedSellerStore: (store: any | null) => void;
  showSellModal: boolean;
  setShowSellModal: (show: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  showNotificationsDrawer: boolean;
  setShowNotificationsDrawer: (show: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;

  // Listings & Filtering
  listings: Listing[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  addListing: (listing: Omit<Listing, 'id' | 'views' | 'saves' | 'messagesCount' | 'shares' | 'createdAt'>) => Listing;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  toggleSaveListing: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Chat & Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, offerAmount?: number) => void;
  startChatWithSeller: (listing: Listing, initialMessage?: string) => string;
  deleteConversation: (id: string) => void;
  blockParticipant: (conversationId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // Safety & Moderation
  reports: ReportItem[];
  submitReport: (report: Omit<ReportItem, 'id' | 'timestamp' | 'status'>) => void;
  verificationRequests: VerificationRequest[];
  submitVerification: (type: 'Identity' | 'Business' | 'Property Documents', docName: string) => void;
  approveVerification: (id: string) => void;
  dismissReport: (id: string) => void;

  // Helpers
  t: (key: TranslationKey) => string;
  formatCurrentPrice: (amount: number, fromCurrency?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('veylora_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [selectedCountry, setSelectedCountryState] = useState<CountryInfo>(() => {
    return COUNTRIES.find((c) => c.code === user.countryCode) || COUNTRIES[0];
  });

  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageInfo>(() => {
    return LANGUAGES.find((l) => l.code === user.language) || LANGUAGES[0];
  });

  const [selectedCurrency, setSelectedCurrencyState] = useState<string>(() => {
    return user.currency || 'INR';
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('veylora_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('veylora_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('veylora_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep_01',
      listingId: 'lst_08',
      reporterId: 'usr_buyer_9',
      reporterName: 'Sanjay V.',
      reason: 'Inaccurate Details',
      notes: 'Price seems lower than usual retail, please verify authentic box packaging.',
      timestamp: '2 hours ago',
      status: 'pending',
    },
  ]);

  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([
    {
      id: 'ver_01',
      userId: 'usr_me_01',
      userName: 'John Doe',
      type: 'Property Documents',
      documentName: 'Agartala_Municipal_Clearance_Deed_2024.pdf',
      submittedAt: 'Today 11:20 AM',
      status: 'approved',
    },
    {
      id: 'ver_02',
      userId: 'usr_04',
      userName: 'David Sparks',
      type: 'Business',
      documentName: 'Master_Electrician_State_License_Illinois.pdf',
      submittedAt: 'Yesterday 2:40 PM',
      status: 'pending',
    },
  ]);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'sell' | 'inbox' | 'me' | 'admin'>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedSellerStore, setSelectedSellerStore] = useState<any | null>(null);
  const [showSellModal, setShowSellModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    return !localStorage.getItem('veylora_onboarding_completed');
  });
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('veylora_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('veylora_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('veylora_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('veylora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Country & Language
  const setCountry = (code: string) => {
    const c = COUNTRIES.find((item) => item.code === code);
    if (c) {
      setSelectedCountryState(c);
      setSelectedCurrencyState(c.currency);
      setUser((prev) => ({
        ...prev,
        country: c.name,
        countryCode: c.code,
        currency: c.currency,
        city: c.popularCities[0] || prev.city,
      }));
    }
  };

  const setLanguage = (code: string) => {
    const l = LANGUAGES.find((item) => item.code === code);
    if (l) {
      setSelectedLanguageState(l);
      setUser((prev) => ({ ...prev, language: l.code }));
    }
  };

  const setCurrency = (code: string) => {
    setSelectedCurrencyState(code);
    setUser((prev) => ({ ...prev, currency: code }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Translation helper
  const t = (key: TranslationKey): string => {
    const langDict = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  // Price formatting helper
  const formatCurrentPrice = (amount: number, fromCurrency = 'USD'): string => {
    return formatPrice(amount, fromCurrency, selectedCurrency);
  };

  // Listings Actions
  const addListing = (
    newListingData: Omit<Listing, 'id' | 'views' | 'saves' | 'messagesCount' | 'shares' | 'createdAt'>
  ): Listing => {
    const id = `lst_${Date.now()}`;
    const newListing: Listing = {
      ...newListingData,
      id,
      views: 1,
      saves: 0,
      messagesCount: 0,
      shares: 0,
      createdAt: 'Just now',
    };

    setListings((prev) => [newListing, ...prev]);

    // Send confirmation notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Listing Published Successfully! 🎉',
      message: `Your listing "${newListing.title}" is now active in ${newListing.city}, ${newListing.country}.`,
      type: 'listing_approved',
      timestamp: 'Just now',
      read: false,
      listingId: newListing.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newListing;
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updatedAt: 'Just now' } : item))
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
  };

  const toggleSaveListing = (id: string) => {
    setUser((prev) => {
      const exists = prev.savedListingIds.includes(id);
      const updated = exists
        ? prev.savedListingIds.filter((item) => item !== id)
        : [...prev.savedListingIds, id];

      // Update listing saves count
      setListings((prevListings) =>
        prevListings.map((l) =>
          l.id === id ? { ...l, saves: Math.max(0, l.saves + (exists ? -1 : 1)) } : l
        )
      );

      return { ...prev, savedListingIds: updated };
    });
  };

  const isSaved = (id: string) => user.savedListingIds.includes(id);

  // Messaging & Conversations
  const sendMessage = (conversationId: string, text: string, offerAmount?: number) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'buyer',
      receiverId: 'seller',
      text,
      timestamp: 'Just now',
      read: false,
      offerAmount,
      offerStatus: offerAmount ? ('pending' as const) : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: offerAmount ? `Offer sent: ${formatCurrentPrice(offerAmount, c.listingCurrency || 'USD')}` : text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Auto simulated seller response after 1.5s
    setTimeout(() => {
      const sellerReplies = [
        "Thanks for your message! Yes, this is in excellent condition. When would you like to view it?",
        "Received your offer! Let me check the details and get back to you shortly.",
        "Yes, we can arrange safe dispatch or an in-person meeting whenever convenient for you.",
        "Thank you! Feel free to call directly on my verified number if you need instant answers.",
      ];
      const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

      const sellerMsg = {
        id: `msg_${Date.now() + 1}`,
        senderId: 'seller',
        receiverId: 'buyer',
        text: randomReply,
        timestamp: 'Just now',
        read: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              unreadCount: c.unreadCount + 1,
              messages: [...c.messages, sellerMsg],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const startChatWithSeller = (listing: Listing, initialMessage?: string): string => {
    // Check if conversation already exists for this listing
    const existing = conversations.find((c) => c.listingId === listing.id);
    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      setActiveConversationId(existing.id);
      setActiveTab('inbox');
      return existing.id;
    }

    // Create new conversation
    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      participantId: listing.sellerId,
      participantName: listing.sellerName,
      participantAvatar: listing.sellerAvatar,
      participantRating: listing.sellerRating,
      isVerified: listing.verifiedSeller,
      listingId: listing.id,
      listingTitle: listing.title,
      listingPrice: listing.price,
      listingCurrency: listing.currency,
      listingImage: listing.images[0],
      lastMessage: initialMessage || `Inquiry about ${listing.title}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: 'buyer',
          receiverId: listing.sellerId,
          text: initialMessage || `Hi ${listing.sellerName}, I am interested in "${listing.title}". Is it still available?`,
          timestamp: 'Just now',
          read: true,
          listingId: listing.id,
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('inbox');
    return newConvId;
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const blockParticipant = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isBlocked: true } : c))
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Moderation & Verification
  const submitReport = (reportData: Omit<ReportItem, 'id' | 'timestamp' | 'status'>) => {
    const newReport: ReportItem = {
      ...reportData,
      id: `rep_${Date.now()}`,
      timestamp: 'Just now',
      status: 'pending',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const submitVerification = (type: 'Identity' | 'Business' | 'Property Documents', docName: string) => {
    const req: VerificationRequest = {
      id: `ver_${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      type,
      documentName: docName,
      submittedAt: 'Just now',
      status: 'pending',
    };
    setVerificationRequests((prev) => [req, ...prev]);
  };

  const approveVerification = (id: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const dismissReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        selectedCountry,
        selectedLanguage,
        selectedCurrency,
        setCountry,
        setLanguage,
        setCurrency,
        updateUserProfile,
        activeTab,
        setActiveTab,
        selectedListing,
        setSelectedListing,
        selectedSellerStore,
        setSelectedSellerStore,
        showSellModal,
        setShowSellModal,
        showOnboardingModal,
        setShowOnboardingModal,
        showNotificationsDrawer,
        setShowNotificationsDrawer,
        isAdminMode,
        setIsAdminMode,
        listings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedCity,
        setSelectedCity,
        sortBy,
        setSortBy,
        addListing,
        updateListing,
        deleteListing,
        toggleSaveListing,
        isSaved,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startChatWithSeller,
        deleteConversation,
        blockParticipant,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        unreadNotificationsCount,
        reports,
        submitReport,
        verificationRequests,
        submitVerification,
        approveVerification,
        dismissReport,
        t,
        formatCurrentPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
