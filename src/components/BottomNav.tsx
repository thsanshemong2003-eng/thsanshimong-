import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Plus, MessageSquare, User, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setShowSellModal,
    conversations,
    t,
  } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl py-2 px-4 md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'home' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-rose-600' : ''}`} />
          <span className="text-[10px] tracking-tight">{t('home')}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'search' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'text-rose-600' : ''}`} />
          <span className="text-[10px] tracking-tight">{t('search')}</span>
        </button>

        {/* SELL Button (Center Standout Glowing Action Button) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => setShowSellModal(true)}
            className="group relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-500/35 hover:scale-105 active:scale-95 transition-all p-[2px]"
            aria-label="Sell or list something"
          >
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex flex-col items-center justify-center">
              <Plus className="w-6 h-6 stroke-[3]" />
              <span className="text-[9px] font-black tracking-widest uppercase text-white">
                {t('sell')}
              </span>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-rose-600 rounded-2xl blur-xs opacity-40 group-hover:opacity-75 transition-opacity -z-10 animate-pulse"></div>
          </button>
        </div>

        {/* Inbox */}
        <button
          onClick={() => setActiveTab('inbox')}
          className={`relative flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'inbox' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'inbox' ? 'text-rose-600' : ''}`} />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t('inbox')}</span>
        </button>

        {/* Me / Profile */}
        <button
          onClick={() => setActiveTab('me')}
          className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
            activeTab === 'me' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'me' ? 'text-rose-600' : ''}`} />
          <span className="text-[10px] tracking-tight">{t('me')}</span>
        </button>
      </div>
    </div>
  );
};
