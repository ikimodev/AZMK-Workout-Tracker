import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Zap, Smartphone } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const PWAInstallPrompt: React.FC = () => {
  const { language } = useWorkout();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);

    // Check if user dismissed prompt recently
    const isDismissed = localStorage.getItem('azmk_pwa_dismissed');
    if (isRunningStandalone || isDismissed) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOSDevice);

    // Android / Chrome beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not standalone, show prompt after a short delay
    if (iOSDevice && !isRunningStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('azmk_pwa_dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 max-w-md mx-auto z-50 animate-slide-up">
      <div className="bg-background-card border-2 border-accent-emerald/60 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-white p-1 rounded-full bg-background-elevated transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center text-black font-black shrink-0 shadow-glow-sm">
            <Zap className="w-7 h-7 fill-black" />
          </div>

          <div className="flex-1 pr-6 rtl:pr-0 rtl:pl-6">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-white">
                {language === 'ar' ? 'تثبيت تطبيق عزمك (AZMK)' : 'Install AZMK App'}
              </h3>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-accent-emerald/20 text-accent-emerald">
                PWA
              </span>
            </div>
            
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {language === 'ar'
                ? 'استمتع بتجربة تطبيق كاملة على جوالك: سرعة فائقة، شاشة كاملة، وبدون أشرطة المتصفح!'
                : 'Experience AZMK like a native mobile app: fullscreen logging, instant speed, and offline capability!'}
            </p>

            {/* iOS Instructions */}
            {isIOS ? (
              <div className="mt-3 p-2.5 rounded-xl bg-background-elevated/80 border border-border/80 text-[11px] text-slate-200 space-y-1.5 font-medium">
                <div className="flex items-center gap-2 text-accent-cyan">
                  <Share className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'ar' ? '1. اضغط على زر المشاركة (Share ⎋)' : '1. Tap Share (⎋) in Safari'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-accent-emerald">
                  <PlusSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'ar' ? '2. اختر "إضافة إلى الصفحة الرئيسية ➕"' : '2. Select "Add to Home Screen ➕"'}
                  </span>
                </div>
              </div>
            ) : (
              /* Android / Chrome Install Button */
              <div className="mt-3">
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>{language === 'ar' ? 'تثبيت التطبيق على الهاتف' : 'Install App on Phone'}</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
