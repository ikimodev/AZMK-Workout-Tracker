import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Share, 
  PlusSquare, 
  Zap, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface PWAInstallPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ forceOpen, onClose }) => {
  const { language } = useWorkout();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isRunningStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);

    // Detect iOS (iPhone / iPad / iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Android / Chrome beforeinstallprompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (forceOpen) {
      setIsVisible(true);
      if (isIOSDevice) setShowIOSGuide(true);
      return;
    }

    // Check if already dismissed recently in this session/browser
    const hasSeenWelcomeGate = sessionStorage.getItem('azmk_pwa_gateway_seen');

    if (!isRunningStandalone && !hasSeenWelcomeGate) {
      // Show gateway immediately on mobile, or after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [forceOpen]);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) {
      alert(language === 'ar' 
        ? 'اضغط على زر الخيارات (⋮) أعلى المتصفح ثم اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".'
        : 'Tap the (⋮) menu in Chrome and select "Install App" or "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
      if (onClose) onClose();
    }
    setDeferredPrompt(null);
  };

  const handleContinueInBrowser = () => {
    setIsVisible(false);
    sessionStorage.setItem('azmk_pwa_gateway_seen', 'true');
    if (onClose) onClose();
  };

  if ((!isVisible && !forceOpen) || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pb-safe pt-safe">
      <div className="bg-background-card border-t-2 sm:border-2 border-accent-emerald/60 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleContinueInBrowser}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Logo & Glowing Aura */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center text-black shadow-glow-lg border-2 border-emerald-300 animate-pulse-slow">
              <Zap className="w-11 h-11 fill-black text-black" />
            </div>
            <div className="absolute -inset-2 bg-accent-emerald/20 rounded-3xl blur-xl -z-10 animate-pulse" />
          </div>

          {/* Saudi Tech Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/15 border border-accent-emerald/40 text-accent-emerald text-xs font-bold font-mono shadow-glow-sm mb-2">
            <span>🇸🇦</span>
            <span>{language === 'ar' ? 'تطبيق سعودي 100%' : '100% Saudi Fitness Tech'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'ar' ? 'عــزمــك | AZMK' : 'AZMK Workout Tracker'}
          </h2>

          {/* Official Slogan requested by user */}
          <div className="mt-3 p-3.5 rounded-2xl bg-background-elevated/70 border border-border/80 text-center">
            <p className="text-xs sm:text-sm font-extrabold text-emerald-300 leading-relaxed">
              "تطبيق سعودي لبناء جيل أقوى.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 leading-relaxed">
              من أول عدة إلى أول PR — عزمك يتابع رحلتك ويساعدك تتطور."
            </p>
          </div>
        </div>

        {/* Dynamic Platform Guides */}
        <div className="space-y-4">
          
          {/* IPHONE / IOS INSTRUCTIONS */}
          {isIOS ? (
            <div className="p-4 rounded-2xl bg-background-elevated border border-accent-cyan/40 space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-accent-cyan" />
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                    {language === 'ar' ? 'طريقة التثبيت على الآيفون (iPhone / iOS Safari):' : 'How to Install on iPhone (Safari):'}
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan">
                  iOS Safari
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-200 font-medium">
                
                {/* Step 1 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-background-card/90 border border-border">
                  <div className="w-6 h-6 rounded-lg bg-accent-cyan/20 text-accent-cyan font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold flex items-center gap-1.5">
                      <span>{language === 'ar' ? 'اضغط على زر المشاركة' : 'Tap the Share Button'}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[11px]">
                        <Share className="w-3 h-3 inline mr-1 rtl:mr-0 rtl:ml-1" />
                        Share
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar' ? 'الموجود في أسفل شاشة المتصفح (مربع فيه سهم لأعلى).' : 'Located at the bottom of the Safari browser bar.'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-background-card/90 border border-border">
                  <div className="w-6 h-6 rounded-lg bg-accent-emerald/20 text-accent-emerald font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold flex items-center gap-1.5">
                      <span>{language === 'ar' ? 'اختر "إضافة إلى الصفحة الرئيسية"' : 'Select "Add to Home Screen"'}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                        <PlusSquare className="w-3 h-3 inline mr-1 rtl:mr-0 rtl:ml-1" />
                        +
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar' ? 'مرر للأسفل في قائمة المشاركة واضغط عليها.' : 'Scroll down in the share sheet and tap on it.'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-background-card/90 border border-border">
                  <div className="w-6 h-6 rounded-lg bg-accent-indigo/20 text-accent-indigo font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">
                      {language === 'ar' ? 'اضغط "إضافة" (Add) في الزاوية العليا 🚀' : 'Tap "Add" in the top corner 🚀'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar' ? 'سيظهر أيقونة التطبيق على شاشة جوالك الرئيسية ليعمل كتطبيق كامل الشاشة بدون أشرطة المتصفح!' : 'AZMK will appear on your Home Screen as a standalone fullscreen app!'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* ANDROID / CHROME / DESKTOP INSTRUCTIONS */
            <div className="space-y-3">
              <button
                onClick={handleInstallAndroid}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-emerald transition-all active:scale-95"
              >
                <Download className="w-5 h-5 stroke-[3]" />
                <span>
                  {language === 'ar' ? '📲 تثبيت تطبيق عزمك على الجوال الآن' : '📲 Install AZMK App on Phone'}
                </span>
              </button>

              <div className="p-3 rounded-xl bg-background-elevated text-center text-xs text-slate-400">
                {language === 'ar' 
                  ? 'أو اضغط على الثلاث نقاط (⋮) في أعلى المتصفح واختر "إضافة إلى الشاشة الرئيسية".'
                  : 'Or tap (⋮) in Chrome and select "Add to Home screen".'}
              </div>
            </div>
          )}

          {/* Action to enter Web App directly */}
          <div className="pt-2">
            <button
              onClick={handleContinueInBrowser}
              className="w-full py-3 px-4 rounded-2xl bg-background-elevated hover:bg-background-card border border-border text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>{language === 'ar' ? 'دخول واستخدام تطبيق الويب مباشرة 🚀' : 'Continue into Web App 🚀'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 text-accent-emerald" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
