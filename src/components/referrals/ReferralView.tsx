import React, { useState } from 'react';
import { Users, Copy, Check, Gift, Sparkles, Trophy, ArrowRight, Share2, RefreshCw } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const ReferralView: React.FC = () => {
  const { referralStats, generateNewReferralCode } = useWorkout();
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const referralUrl = `https://pulse-ai.fitness/join?ref=${referralStats.code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      generateNewReferralCode(customInput.trim().toUpperCase());
      setCustomInput('');
    }
  };

  const milestones = [
    { target: 1, reward: '1 Month Free Pro', unlocked: referralStats.paidUsers >= 1 },
    { target: 3, reward: '3 Months Free Pro', unlocked: referralStats.paidUsers >= 3 },
    { target: 5, reward: '6 Months Free Pro', unlocked: referralStats.paidUsers >= 5 },
    { target: 10, reward: '1 Year Free Pro', unlocked: referralStats.paidUsers >= 10 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">PARTNER & INVITE PROGRAM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Invite Friends, Earn Free Pro</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Share your unique referral link. Every friend who subscribes to PULSE PRO unlocks free months for your account.
          </p>
        </div>

        {/* Total Earned Badge */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center shrink-0">
          <p className="text-[11px] text-amber-400 font-bold uppercase">Unlocked Rewards</p>
          <p className="text-2xl font-black font-mono text-amber-300 mt-0.5">
            +{referralStats.rewardMonthsEarned} Months Pro
          </p>
        </div>
      </div>

      {/* Referral Code & Link Box */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-base text-white">Your Unique Referral Code & Link</h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Big Code Pill */}
          <div className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-background-elevated border border-accent-emerald/40 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Your Code</span>
              <span className="text-lg font-black font-mono text-accent-emerald tracking-wider">
                {referralStats.code}
              </span>
            </div>
            <button
              onClick={() => generateNewReferralCode()}
              title="Generate new random code"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-background-card hover:bg-background-hover transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Copy URL Input */}
          <div className="flex-1 w-full flex items-center gap-2 bg-background-elevated border border-border rounded-2xl p-1.5 pl-4">
            <span className="text-xs font-mono text-slate-300 truncate flex-1">{referralUrl}</span>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Custom code generator input */}
        <form onSubmit={handleCustomCode} className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Create custom code (e.g. AHMED8F3 or KAREEM_FIT)"
            className="px-4 py-2 bg-background-elevated border border-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-accent-emerald max-w-xs"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-200 text-xs font-bold border border-border transition-all"
          >
            Update Code
          </button>
        </form>
      </div>

      {/* Funnel Conversion Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Clicks</span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
            {referralStats.clicks}
          </p>
          <span className="text-[11px] text-slate-500 font-mono">Link views</span>
        </div>

        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Signups</span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-accent-cyan mt-1">
            {referralStats.signups}
          </p>
          <span className="text-[11px] text-slate-500 font-mono">40.7% conversion</span>
        </div>

        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <span className="text-xs text-slate-400 font-semibold uppercase">Paid Pro Users</span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
            {referralStats.paidUsers}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono">Active conversions</span>
        </div>

      </div>

      {/* Reward Milestones */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-base text-white">Tier Progression Rewards</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                m.unlocked
                  ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-glow-sm'
                  : 'bg-background-elevated/60 border-border/80 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold font-mono text-xs ${
                  m.unlocked ? 'bg-amber-400 text-black' : 'bg-background-card text-slate-500'
                }`}>
                  {m.target}
                </div>
                <div>
                  <p className={`font-bold text-sm ${m.unlocked ? 'text-white' : 'text-slate-300'}`}>
                    {m.target} {m.target === 1 ? 'Referral' : 'Referrals'}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold">{m.reward}</p>
                </div>
              </div>

              {m.unlocked ? (
                <span className="text-xs font-bold font-mono text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-xl">
                  ✓ Unlocked
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  {m.target - referralStats.paidUsers} more needed
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* History Log */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-3">
        <h3 className="font-bold text-base text-white">Referral Log</h3>

        <div className="space-y-2">
          {referralStats.history.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-background-elevated/60 border border-border flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-white">{item.userName}</p>
                <p className="text-[11px] text-slate-400">{item.date}</p>
              </div>
              <div className="text-right font-mono">
                <span className={`font-semibold ${
                  item.status === 'Subscribed Premium' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {item.status}
                </span>
                <p className="text-[10px] text-accent-emerald font-bold">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
