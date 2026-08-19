import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const PricingView: React.FC = () => {
  const { user, toggleSubscriptionTier } = useWorkout();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5 fill-amber-400" />
          <span>UPGRADE YOUR TRAINING ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          PULSE AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">PREMIUM</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Unlock progressive overload intelligence, unlimited AI Coach tool queries, and multi-week periodization.
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
              Monthly Billing
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-accent-emerald text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] text-amber-900 font-extrabold uppercase">
                Save 31%
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
              <h3 className="text-xl font-bold text-white">Free Starter</h3>
              {user.tier === 'free' && (
                <span className="px-2.5 py-0.5 rounded-full bg-background-elevated text-slate-300 text-xs font-bold border border-border">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mb-6">
              <span className="text-4xl font-black font-mono text-white">0 SAR</span>
              <span className="text-xs text-slate-400"> / forever</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>Unlimited manual workout logging</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>Basic progress history (last 4 weeks)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>Exercise library (50+ movements)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-600">—</span>
                <span>Limited AI Coach queries (3 / month)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 flex items-center justify-center font-bold text-slate-600">—</span>
                <span>No automatic progressive overload targets</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <button
              onClick={toggleSubscriptionTier}
              className="w-full py-3 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border text-slate-200 text-xs font-bold transition-all"
            >
              {user.tier === 'free' ? 'Active' : 'Switch to Free Tier'}
            </button>
          </div>
        </div>

        {/* PRO TIER */}
        <div className={`bg-gradient-to-b from-background-card via-background-elevated to-background-card border-2 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl ${
          user.tier === 'premium' ? 'border-amber-400 shadow-glow-sm' : 'border-accent-emerald/60'
        }`}>
          
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black uppercase tracking-widest shadow-md">
            RECOMMENDED
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="text-xl font-bold text-white">PULSE PRO</h3>
              </div>
              {user.tier === 'premium' && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  Active Pro
                </span>
              )}
            </div>

            <div className="mb-6">
              {billingCycle === 'monthly' ? (
                <>
                  <span className="text-4xl font-black font-mono text-white">24 SAR</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-black font-mono text-white">199 SAR</span>
                  <span className="text-xs text-slate-400"> / year (~16.5 SAR/mo)</span>
                </>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span className="font-semibold text-white">Unlimited Context-Aware AI Coach with Tool Calling</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span className="font-semibold text-white">Next-Workout Target Autocomplete Engine</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>AI Natural Language Workout Importer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>AI Multi-Week Program Architect</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-accent-emerald shrink-0" />
                <span>Estimated 1RM curves & volume fatigue distribution</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <button
              onClick={toggleSubscriptionTier}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider shadow-glow-sm transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{user.tier === 'premium' ? 'Current Plan (Click to Toggle)' : 'Upgrade to Pro'}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">Prototype simulation: No actual payment required.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
