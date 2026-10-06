import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white select-none">
      <div className="flex flex-col items-center text-center px-6">
        {/* VEYLORA LOGO */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[3px] shadow-2xl shadow-rose-500/25 animate-pulse-subtle">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <span className="text-4xl font-extrabold font-display bg-gradient-to-tr from-amber-300 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
                V
              </span>
            </div>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-rose-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white mb-2">
          VEYLORA
        </h1>

        <p className="text-xs md:text-sm font-semibold tracking-[0.28em] text-slate-400 uppercase mb-8">
          BUY • SELL • ANYWHERE
        </p>

        {/* Loading indicator */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-400 tracking-wider">
            Loading{dots}
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-[11px] text-slate-500 tracking-widest uppercase">
          Global Hyper-Local Marketplace
        </p>
      </div>
    </div>
  );
};
