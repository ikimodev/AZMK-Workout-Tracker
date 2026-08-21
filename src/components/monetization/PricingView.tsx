import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const PricingView: React.FC = () => {
  const { user, toggleSubscriptionTier, language } = useWorkout();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5 fill-amber-400" />
          <span>{language === 'ar' ? 'طوّر تجربتك التدريبية' : 'UPGRADE YOUR TRAINING ENGINE'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {language === 'ar' ? 'باقات واشتراكات ' : 'AZMK '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">{language === 'ar' ? 'عزمك PRO' : 'PRO'}</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          {language === 'ar'
            ? 'احصل على مدربك الذكي المخصص (كابتن عزام)، مع توليد آلي مستمر لأوزان الزيادة التدريجية وتحليلات الحجم المتقدمة.'
            : 'Unlock continuous progressive overload calculations, unlimited AI Coach guidance, and deep periodization.'}
        </p>

        {/* Billing Cycle Switcher */}
        <div className="pt-4 flex items-center justify-center">
          <div className="p-1 bg-background-elevated rounded-2xl border border-border flex items-center gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-accent-emerald text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'اشتراك شهري' : 'Monthly Billing'}
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-accent-emerald text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{language === 'ar' ? 'اشتراك سنوي' : 'Yearly Billing'}</span>
              <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] text-amber-900 font-extrabold uppercase">
                {language === 'ar' ? 'خصم 31%' : 'Save 31%'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* FREE TIER */}
        <div className={`bg-background-card border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
          user.tier === 'free' ? 'border-slate-500 shadow-card' : 'border-border'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{language === 'ar' ? 'الباقة المجانية (Free)' : 'Free Starter'}</h3>
              {user.tier === 'free' && (
                <span className="px-2.5 py-0.5 rounded-full bg-background-elevated text-slate-300 text-xs font-bold border border-border">
                  {language === 'ar' ? 'باقتك الحالية' : 'Current Plan'}
                </span>
              )}
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black font-mono text-white">0 {language === 'ar' ? 'ريال' : 'SAR'}</span>
              <span className="text-xs text-slate-400"> / {language === 'ar' ? 'مجاناً للأبد' : 'forever'}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="font-bold text-accent-emerald text-[11px] uppercase tracking-wider mb-1">
                {language === 'ar' ? 'ما الذي تحصل عليه مجاناً؟' : 'What You Get in Free:'}
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'خطة تدريبية لـ 4 أسابيع بالذكاء الاصطناعي' : '4-week custom AI workout plan'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'مسجل التمارين المباشر ومؤقتات الراحة' : 'Live workout logger with rest timers'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'الجدول والتقويم التفاعلي' : 'Interactive schedule & calendar'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'مكتبة التمارين الرياضية (50+ تمرين)' : 'Exercise library (50+ movements)'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-600">—</span>
                <span>{language === 'ar' ? 'استشارات محدودة مع كابتن عزام (3 أسئلة/شهر)' : 'Limited AI Coach queries (3 / month)'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <button
              onClick={toggleSubscriptionTier}
              className="w-full py-3 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border text-slate-200 text-xs font-bold transition-all active:scale-95"
            >
              {user.tier === 'free' ? (language === 'ar' ? 'مفعلة حالياً ✓' : 'Active Plan ✓') : (language === 'ar' ? 'التحويل للباقة المجانية' : 'Switch to Free Tier')}
            </button>
          </div>
        </div>

        {/* PRO TIER */}
        <div className={`bg-gradient-to-b from-background-card via-background-elevated to-background-card border-2 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl ${
          user.tier === 'premium' ? 'border-amber-400 shadow-glow-sm' : 'border-accent-emerald/60'
        }`}>
          
          <div className="absolute -top-3.5 right-6 rtl:right-auto rtl:left-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black uppercase tracking-widest shadow-md">
            {language === 'ar' ? 'موصى به للرياضيين' : 'RECOMMENDED'}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-xl font-bold text-white">{language === 'ar' ? 'عزمك برو (AZMK PRO)' : 'AZMK PRO'}</h3>
              </div>
              {user.tier === 'premium' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  {language === 'ar' ? 'اشتراكك النشط' : 'Active Pro'}
                </span>
              )}
            </div>

            <div className="mb-6">
              {billingCycle === 'monthly' ? (
                <>
                  <span className="text-4xl font-black font-mono text-white">24 {language === 'ar' ? 'ريال' : 'SAR'}</span>
                  <span className="text-xs text-slate-400"> / {language === 'ar' ? 'شهرياً' : 'month'}</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-black font-mono text-white">199 {language === 'ar' ? 'ريال' : 'SAR'}</span>
                  <span className="text-xs text-slate-400"> / {language === 'ar' ? 'سنوياً (~16.5 ريال/شهر)' : 'year (~16.5 SAR/mo)'}</span>
                </>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="font-bold text-amber-400 text-[11px] uppercase tracking-wider mb-1">
                {language === 'ar' ? 'مزايا باقة عزمك برو الكاملة:' : 'Pro Features Included:'}
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span className="font-semibold text-white">{language === 'ar' ? 'استشارات وتحليلات غير محدودة مع كابتن عزام الذكي' : 'Unlimited Context-Aware AI Coach (Coach Azzam)'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span className="font-semibold text-white">{language === 'ar' ? 'حساب آلي لأوزان الزيادة التدريجية (Progressive Overload)' : 'Automated Next-Workout Target Overload Engine'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'استيراد وتوليد جداول غير محدودة عبر الذكاء الاصطناعي' : 'Unlimited AI natural language schedule generator & importer'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>{language === 'ar' ? 'تحليلات تفصيلية للحجم التدريبي الأسبوعي ومعدل RPE' : 'Advanced muscle group volume & fatigue analytics'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <button
              onClick={toggleSubscriptionTier}
              className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-glow-md ${
                user.tier === 'premium'
                  ? 'bg-amber-400 hover:bg-amber-300 text-black'
                  : 'bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>
                {user.tier === 'premium'
                  ? (language === 'ar' ? 'أنت مشترك في Pro حالياً ✓' : 'Pro Subscription Active ✓')
                  : (language === 'ar' ? 'ترقية الحساب إلى عزمك PRO 🚀' : 'Upgrade to AZMK PRO')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Security & Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-background-elevated/40 border border-border text-center flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-accent-emerald" />
        <span>
          {language === 'ar' ? 'دفع آمن ومشفر 100% • يمكنك الإلغاء أو التغيير في أي وقت' : '100% Secure Checkout • Cancel or switch anytime'}
        </span>
      </div>

    </div>
  );
};
