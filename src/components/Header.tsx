import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, MessageSquare, Globe, Shield, Sparkles } from 'lucide-react';
import { COUNTRIES, LANGUAGES, CURRENCY_SYMBOLS } from '../translations';

export const Header: React.FC = () => {
  const {
    user,
    selectedCountry,
    setCountry,
    selectedLanguage,
    setLanguage,
    selectedCurrency,
    setCurrency,
    unreadNotificationsCount,
    setShowNotificationsDrawer,
    setActiveTab,
    conversations,
    setShowSellModal,
    setShowOnboardingModal,
    isAdminMode,
    setIsAdminMode,
    t,
  } = useApp();

  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top small utility bar */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">@{user.username}</span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-1 hover:text-slate-900 transition-colors font-medium"
            >
              <span>{selectedCountry.flag}</span>
              <span>{user.city || selectedCountry.name}</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Currency Selector */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-medium">Curr:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
              >
                {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_SYMBOLS[curr]})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-300">•</span>

            {/* Language Quick Switcher */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-medium">Lang:</span>
              <select
                value={selectedLanguage.code}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-bold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin toggle */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                isAdminMode
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Toggle Admin / Moderation Mode"
            >
              <Shield className="w-2.5 h-2.5" />
              {isAdminMode ? 'Admin ON' : 'Admin'}
            </button>
          </div>
        </div>

        {/* Main Branding & Actions Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[2px] shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-xl font-black font-display bg-gradient-to-tr from-amber-300 via-rose-400 to-indigo-300 bg-clip-text text-transparent">
                    V
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black font-display tracking-tight text-slate-950">
                  VEYLORA
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 tracking-wider">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase leading-none">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SELL Button (Desktop / Tablet prominent button) */}
            <button
              onClick={() => setShowSellModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-500/25 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('sell')}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotificationsDrawer(true)}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Chat Inbox Button */}
            <button
              onClick={() => setActiveTab('inbox')}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              aria-label="Inbox"
            >
              <MessageSquare className="w-5 h-5" />
              {totalUnreadMessages > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {totalUnreadMessages}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Trigger */}
            <div
              onClick={() => setActiveTab('me')}
              className="flex items-center gap-2 pl-2 cursor-pointer group"
            >
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-9 h-9 rounded-xl object-cover border-2 border-slate-200 group-hover:border-rose-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Location Dropdown Modal */}
        {showLocationMenu && (
          <div className="absolute top-16 left-4 sm:left-10 z-50 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-rose-500" />
                Change Region & Currency
              </span>
              <button
                onClick={() => setShowLocationMenu(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountry(c.code);
                    setShowLocationMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left ${
                    selectedCountry.code === c.code
                      ? 'bg-rose-50 text-rose-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {c.currency} ({CURRENCY_SYMBOLS[c.currency]})
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowLocationMenu(false);
                setShowOnboardingModal(true);
              }}
              className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center"
            >
              Open Full Onboarding Setup
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
