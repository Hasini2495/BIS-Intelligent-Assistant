import { useState } from 'react';
import {
  CheckCircle2,
  Send,
  Star,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { feedbackService } from '@/services/feedbackService';

const CATEGORIES = [
  'General Feedback',
  'Incorrect Answer',
  'Missing Standard',
  'Source Issue',
];

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState('General Feedback');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && rating === 0) return;

    setIsSubmitting(true);
    try {
      await feedbackService.submit({
        messageId: 'msg-feedback-1',
        conversationId: 'conv-feedback-1',
        rating: rating >= 3 ? 'helpful' : 'not_helpful',
        comment: `[${selectedCategory}] ${feedbackText}`,
        submittedAt: new Date().toISOString(),
      });
    } catch {
      // Ignore network mock error
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const resetForm = () => {
    setFeedbackText('');
    setRating(0);
    setSubmitted(false);
    setSelectedCategory('General Feedback');
  };

  return (
    <div className="space-y-6 font-sans max-w-3xl mx-auto">
      {/* Page Header (Screen 17) */}
      <PageHeader
        title="We value your feedback"
        description="Help us improve the BIS AI Assistant by sharing your experience, reporting missing standards, or suggesting improvements."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Feedback' },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your insights help our engineering and standards teams continuously enhance search accuracy and citation groundedness.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 rounded-xl bg-[#063b73] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0B4A8F]"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Pills (Reference Screen 17) */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Category
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat
                        ? 'bg-[#063b73] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Textarea (Reference Screen 17) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="fb-text" className="block text-xs font-semibold text-slate-700">
                  Tell us your feedback
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {feedbackText.length}/500
                </span>
              </div>
              <textarea
                id="fb-text"
                rows={5}
                maxLength={500}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your feedback, suggestions or report an issue..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#063b73] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* 5-Star Rating (Reference Screen 17) */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Rating
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${(hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                        }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-xs font-bold text-slate-600">
                    {rating} of 5 Stars
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || (!feedbackText.trim() && rating === 0)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#063b73] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0B4A8F] disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
