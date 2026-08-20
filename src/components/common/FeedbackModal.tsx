import React, { useState } from 'react';
import { Star, X, Send, Heart, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { submitUserFeedback } from '../../services/analyticsService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user, language } = useWorkout();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitUserFeedback(rating, comment.trim(), user.name);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in pb-safe pt-safe">
      <div className="bg-background-card border-2 border-accent-emerald/50 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-slide-up text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-background-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-accent-emerald/20 border border-accent-emerald/40 text-accent-emerald mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">
              {language === 'ar' ? 'شكراً لرأيك القيّم! ❤️' : 'Thank you for your feedback! ❤️'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {language === 'ar'
                ? 'رأيك يساعدنا في تطوير عزمك ليصبح أفضل تطبيق تدريب في العالم العربي.'
                : 'Your feedback directly helps us build a stronger fitness experience!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-3">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-emerald">
                {language === 'ar' ? 'رأي المستخدم' : 'COMMUNITY FEEDBACK'}
              </span>
              
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {language === 'ar' ? 'كيف تقيّم تجربتك مع تطبيق عزمك؟' : 'How is your experience with AZMK?'}
              </h3>
              
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'رأيك يظهر مباشرة للمؤسس في لوحة الإدارة لتحسين التطبيق' : 'Your feedback goes directly to the creator!'}
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating text descriptor */}
            <div className="text-center text-xs font-bold text-amber-400">
              {rating === 5 && (language === 'ar' ? '⭐⭐⭐⭐⭐ أسطوري وممتاز جداً!' : '⭐⭐⭐⭐⭐ Mind-blowing!')}
              {rating === 4 && (language === 'ar' ? '⭐⭐⭐⭐ رائع ومفيد جداً' : '⭐⭐⭐⭐ Great experience')}
              {rating === 3 && (language === 'ar' ? '⭐⭐⭐ جيد ومقبول' : '⭐⭐⭐ Good')}
              {rating === 2 && (language === 'ar' ? '⭐⭐ يحتاج لبعض التحسينات' : '⭐⭐ Needs improvement')}
              {rating === 1 && (language === 'ar' ? '⭐ واجهت مشاكل' : '⭐ Had issues')}
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {language === 'ar' ? 'ما رأيك أو اقتراحاتك؟ (اختياري):' : 'Your thoughts or suggestions (Optional):'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب انطباعك، الميزات اللي عجبتك أو أي ميزة حاب نضيفها...' : 'Tell us what you liked or what we should add next...'}
                rows={3}
                className="w-full bg-background-elevated border border-border focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 resize-none outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ar' ? 'إرسال التقييم 🚀' : 'Submit Feedback 🚀'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
