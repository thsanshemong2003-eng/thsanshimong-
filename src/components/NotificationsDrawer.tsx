import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  Heart,
  MessageSquare,
  ShieldAlert,
  Tag,
  CheckCheck,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setSelectedListing,
    listings,
  } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'listing_approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'listing_saved':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-indigo-500" />;
      case 'price_update':
        return <Tag className="w-5 h-5 text-amber-500" />;
      case 'security_alert':
        return <ShieldAlert className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.listingId) {
      const l = listings.find((item) => item.id === notif.listingId);
      if (l) {
        setSelectedListing(l);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold font-display text-base text-slate-900">
              Notifications
            </h3>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No new notifications right now.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                  !notif.read ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-2xl bg-white shadow-2xs border border-slate-100 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
