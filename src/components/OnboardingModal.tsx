import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, LANGUAGES, CURRENCY_SYMBOLS } from '../translations';
import { Globe, Check, ArrowRight, ArrowLeft, Camera, Sparkles, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    updateUserProfile,
    selectedCountry,
    setCountry,
    selectedLanguage,
    setLanguage,
    selectedCurrency,
    setCurrency,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [countrySearch, setCountrySearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  // Step 4 Profile fields
  const [firstName, setFirstName] = useState(user.firstName || 'John');
  const [lastName, setLastName] = useState(user.lastName || 'Doe');
  const [username, setUsername] = useState(user.username || 'johndoe');
  const [avatar, setAvatar] = useState(user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const handleFinish = () => {
    updateUserProfile({
      firstName,
      lastName,
      username: username.replace(/^@/, ''),
      avatar,
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      language: selectedLanguage.code,
      currency: selectedCurrency,
      city: selectedCountry.popularCities[0] || 'City',
    });
    localStorage.setItem('veylora_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Progress Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center font-display font-black text-white text-base">
              V
            </div>
            <div>
              <h2 className="font-display font-bold text-base tracking-wide">VEYLORA</h2>
              <p className="text-[11px] text-slate-400 font-medium tracking-wider">
                BUY • SELL • ANYWHERE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-rose-500'
                    : s < step
                    ? 'w-3 bg-emerald-400'
                    : 'w-3 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {/* STEP 1: Country Selector */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <span className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 mb-3">
                  <Globe className="w-6 h-6" />
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Where are you from?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect with buyers, verified sellers, and local deals in your region.
                </p>
              </div>

              {/* Search box */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="🌍 Search country or code..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
              </div>

              {/* Country List */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {filteredCountries.map((c) => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => setCountry(c.code)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-rose-50 border border-rose-300 text-rose-900 font-semibold shadow-xs'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="text-sm">{c.name}</div>
                          <div className="text-[11px] text-slate-400">
                            Currency: {c.currency} ({CURRENCY_SYMBOLS[c.currency] || c.currency})
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all"
              >
                Continue to Language
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Language Selector */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <span className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                  <Sparkles className="w-6 h-6" />
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Choose your language
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enjoy localized listings, notifications, and smooth communication.
                </p>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search language..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {filteredLanguages.map((l) => {
                  const isSelected = selectedLanguage.code === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold">{l.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5">{l.nativeName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="py-3.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
                >
                  Continue to Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Authentication Options */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <span className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Welcome to Veylora
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Buy, sell, and deal safely with verified global & local members.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setStep(4)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-black" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.19-9.52-11.07-20.2-14.65-32.06-3.58-11.85-5.38-23.01-5.38-33.48 0-14.4 3.73-26.4 11.19-36 7.46-9.61 16.94-14.52 28.43-14.74 4.58 0 9.77 1.16 15.58 3.49 5.81 2.33 9.68 3.55 11.61 3.66 1.48 0 5.48-1.29 11.99-3.87 6.51-2.58 12.01-3.69 16.51-3.33 12.58.74 22.84 5.37 30.79 13.88-10.97 6.64-16.3 15.75-15.99 27.32.32 9.07 3.82 16.71 10.5 22.92 6.69 6.21 14.59 9.87 23.71 10.99-2.34 7.02-5.34 14.28-9.01 21.78zM119.22 33.56c0-6.72 2.37-13.16 7.11-19.33 4.74-6.17 10.74-10.38 18-12.63.43 2.16.64 4.2.64 6.13 0 6.6-2.42 12.98-7.26 19.14-4.84 6.17-10.87 10.35-18.09 12.55-.22-1.94-.4-3.89-.4-5.86z" />
                  </svg>
                  Continue with Apple
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <span className="text-base">📱</span>
                  Continue with Phone
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs"
                >
                  <span className="text-base">✉️</span>
                  Continue with Email
                </button>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                    ──────── OR ────────
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                >
                  Create account
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Log in
                </button>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600 text-center"
              >
                ← Back to language selection
              </button>
            </div>
          )}

          {/* STEP 4: Setup Profile */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  Setup your profile
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Personalize your identity as a buyer or verified seller on Veylora.
                </p>
              </div>

              {/* Add Profile Photo */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1.5 rounded-xl cursor-pointer hover:bg-rose-600 transition-colors shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                  ].map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(imgUrl)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border ${
                        avatar === imgUrl ? 'ring-2 ring-rose-500' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Sample avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 mt-1">Add profile photo</span>
              </div>

              {/* Name & Username Inputs */}
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Country, Language, Currency preview cards */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Country</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                      {selectedCountry.flag} {selectedCountry.name}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Language</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                      {selectedLanguage.name}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Currency</span>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 mt-0.5 focus:outline-none cursor-pointer"
                    >
                      {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                        <option key={curr} value={curr}>
                          {curr} ({CURRENCY_SYMBOLS[curr]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit / Continue */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="py-3.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                >
                  Continue to Veylora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
