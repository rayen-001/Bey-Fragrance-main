import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/api';

interface StarRating3DProps {
  productId: string;
  initialRating?: number;
  reviewCount?: number;
  readOnly?: boolean;
  showText?: boolean;
  userRating?: number;
}

const Star3D = ({
  filled,
  hovered,
  index,
  onClick,
  onMouseEnter,
  onMouseLeave,
  readOnly,
  animateOnClick,
}: {
  filled: boolean;
  hovered: boolean;
  index: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  readOnly: boolean;
  animateOnClick: boolean;
}) => {
  const active = filled || hovered;

  return (
    <motion.button
      type="button"
      disabled={readOnly}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative outline-none border-none bg-transparent p-0 cursor-pointer disabled:cursor-default"
      animate={animateOnClick ? { scale: [1, 1.4, 0.9, 1.15, 1], rotate: [0, 10, -10, 0] } : { scale: 1 }}
      whileHover={readOnly ? {} : { scale: 1.25, filter: 'brightness(1.2)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 12, duration: animateOnClick ? 0.6 : 0.2 }}
      aria-label={`Rate ${index + 1} star${index > 0 ? 's' : ''}`}
      style={{ width: 22, height: 22 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        style={{ filter: active ? 'drop-shadow(0 0 8px rgba(212,175,55,0.7))' : 'none' }}
      >
        <defs>
          <radialGradient id={`gold-3d-${index}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="35%" stopColor="#f0c952" />
            <stop offset="65%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8b6914" />
          </radialGradient>
          <radialGradient id={`hover-3d-${index}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f5d060" />
            <stop offset="100%" stopColor="#d4af37" />
          </radialGradient>
          <filter id={`star-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Star Layer */}
        <motion.path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={
            hovered
              ? `url(#hover-3d-${index})`
              : filled
              ? `url(#gold-3d-${index})`
              : 'rgba(212,175,55,0.08)'
          }
          stroke={active ? '#d4af37' : 'rgba(212,175,55,0.8)'}
          strokeWidth={active ? 0.8 : 1}
          initial={false}
          animate={{ opacity: active ? 1 : 0.6 }}
        />

        {/* Shine Layer */}
        {active && (
          <motion.path
            d="M12 4l1.5 3.5 4 .5-3 2.8.7 4.2-3.2-1.8-3.2 1.8.7-4.2-3-2.8 4-.5L12 4z"
            fill="rgba(255,255,255,0.4)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.svg>
    </motion.button>
  );
};

type FeedbackState = 'idle' | 'loading' | 'success' | 'error';

export function StarRating3D({ 
  productId, 
  initialRating = 0, 
  reviewCount = 0, 
  readOnly = false,
  showText = true,
  userRating: initialUserRating = 0
}: StarRating3DProps) {
  const [hoverRating, setHoverRating] = useState(0);
  // Separate user's own rating from the overall average (initialRating)
  const [userRating, setUserRating] = useState(initialUserRating);
  const [clickedStar, setClickedStar] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [liveCount, setLiveCount] = useState(reviewCount);
  const [session, setSession] = useState<any>(null);

  // Sync with Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch the user's specific rating for this product if logged in
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!session || readOnly) return;
      
      try {
        const API_BASE = (import.meta.env.VITE_API_BASE_URL as string)?.trim() || 'http://localhost:3001';
        const res = await fetch(`${API_BASE}/reviews/${productId}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          }
        });
        const data = await res.json();
        if (data.success && data.reviews) {
          // Identify the current user's review in the list
          const myReview = data.reviews.find((r: any) => r.userId === session.user.id);
          if (myReview) {
            setUserRating(myReview.rating);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user rating:', err);
      }
    };
    
    fetchUserRating();
  }, [productId, session, readOnly]);

  const handleStarClick = useCallback(async (star: number) => {
    if (readOnly) return;
    
    // Check session early
    if (!session) {
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 2500);
      return;
    }

    setClickedStar(star);
    setUserRating(star); // Update the user's stars visually
    setFeedback('loading');

    setTimeout(() => setClickedStar(null), 600);

    try {
      const API_BASE = (import.meta.env.VITE_API_BASE_URL as string)?.trim() || 'http://localhost:3001';

      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ productId, rating: star }),
      });

      if (!res.ok) throw new Error('API failed');

      // Update the local "review count" display if this was a new review
      if (userRating === 0) setLiveCount(prev => prev + 1);
      
      setFeedback('success');
      setTimeout(() => setFeedback('idle'), 2800);
    } catch (err) {
      console.error('Rating submission failed:', err);
      setFeedback('error');
      setTimeout(() => setFeedback('idle'), 2500);
    }
  }, [productId, readOnly, session, userRating]);

  // Which stars are filled? If read-only, we show the AVERAGE. If not, we show the USER'S RATING.
  const ratingToDisplay = hoverRating || (readOnly ? initialRating : userRating);

  return (
    <div className="flex flex-col gap-1.5 items-start group/stars min-h-[54px] justify-center">
      <div className="flex items-center gap-2 h-7">
        {/* Stars Set */}
        <div 
          className="flex items-center gap-0.5"
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star3D
              key={star}
              index={star - 1}
              filled={star <= ratingToDisplay}
              hovered={star <= hoverRating}
              readOnly={readOnly}
              animateOnClick={clickedStar === star}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
            />
          ))}
        </div>

        {/* Text Display: "4.5 stars (49 reviews)" (Always shows average) */}
        {showText && (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#d4af37] font-serif text-sm font-bold tracking-tight">
              {Number(initialRating).toFixed(1)} <span className="text-[10px] uppercase tracking-widest font-sans ml-0.5">stars</span>
            </span>
            <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-black font-sans">
              ({liveCount} {liveCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {/* Animation/Feedback Overlay */}
      <AnimatePresence mode="wait">
        {feedback === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-2 py-0.5"
          >
            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-[bounce_1s_infinite]" />
            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-[bounce_1s_infinite_0.2s]" />
            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-[bounce_1s_infinite_0.4s]" />
          </motion.div>
        )}

        {feedback === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
               <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                 <path d="M1 3L3 5L7 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
            <span className="text-green-400/80 text-[8px] uppercase tracking-[0.3em] font-bold">Thank you for rating!</span>
          </motion.div>
        )}

        {feedback === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400/80 text-[8px] uppercase tracking-[0.3em] font-bold"
          >
            {!session ? 'Sign in to rate' : 'Error saving rating'}
          </motion.div>
        )}
        
        {/* Hint on hover */}
        {feedback === 'idle' && !readOnly && hoverRating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#d4af37]/60 text-[8px] uppercase tracking-[0.3em] font-bold"
          >
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Perfect'][hoverRating]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
