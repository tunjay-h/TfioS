import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Quote } from '../types';

export type QuotesCarouselProps = {
  quotes: Quote[];
  controlledQuoteId: string | null;
  onQuoteChange: (quote: Quote, source: 'auto' | 'user') => void;
  autoAdvancePaused: boolean;
  animationsEnabled: boolean;
  onShare: (quote: Quote) => void;
  sectionRef?: React.Ref<HTMLDivElement>;
};

const AUTO_ADVANCE_MS = 9000;

export function QuotesCarousel({
  quotes,
  controlledQuoteId,
  onQuoteChange,
  autoAdvancePaused,
  animationsEnabled,
  onShare,
  sectionRef,
}: QuotesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const forwardedSectionRef = sectionRef;
  const pointerStart = useRef<number | null>(null);
  const shouldReduceMotion = !animationsEnabled;

  const handleSectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (!forwardedSectionRef) {
        return;
      }
      if (typeof forwardedSectionRef === 'function') {
        forwardedSectionRef(node);
        return;
      }
      forwardedSectionRef.current = node;
    },
    [forwardedSectionRef],
  );

  const goToIndex = useCallback(
    (nextIndex: number, source: 'auto' | 'user') => {
      const normalizedIndex = (nextIndex + quotes.length) % quotes.length;
      setCurrentIndex(normalizedIndex);
      onQuoteChange(quotes[normalizedIndex], source);
    },
    [onQuoteChange, quotes],
  );

  useEffect(() => {
    if (!controlledQuoteId) {
      return;
    }
    const forcedIndex = quotes.findIndex((quote) => quote.id === controlledQuoteId);
    if (forcedIndex >= 0 && forcedIndex !== currentIndex) {
      setCurrentIndex(forcedIndex);
    }
  }, [controlledQuoteId, currentIndex, quotes]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasEnteredView(true);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || autoAdvancePaused || !hasEnteredView || quotes.length <= 1) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      goToIndex(currentIndex + 1, 'auto');
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [autoAdvancePaused, currentIndex, goToIndex, hasEnteredView, quotes.length, shouldReduceMotion]);

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1, 'user');
  }, [currentIndex, goToIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(currentIndex - 1, 'user');
  }, [currentIndex, goToIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const delta = event.clientX - pointerStart.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    pointerStart.current = null;
  };

  const activeQuote = quotes[currentIndex];
  const fadeDuration = shouldReduceMotion ? 0.1 : 0.7;

  return (
    <section ref={handleSectionRef} className="relative z-10" aria-labelledby="quotes-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="quotes-heading" className="font-display text-2xl font-semibold text-white">
          Words carried by stardust
        </h2>
        <p className="text-sm text-starlight/70">Swipe, tap, or use arrow keys.</p>
      </div>
      <div
        role="region"
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="group relative min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-8 text-center text-white backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuote.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration }}
            className="flex h-full flex-col items-center justify-center gap-4"
          >
            <p className="text-xl font-light leading-relaxed sm:text-2xl">“{activeQuote.text}”</p>
            <p className="text-base font-semibold uppercase tracking-[0.3em] text-aurum">{activeQuote.author}</p>
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
        <div className="mt-8 flex items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-aurum/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => onShare(activeQuote)}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-aurum/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Share
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-aurum/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Next
          </button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {quotes.map((quote, index) => (
            <button
              key={quote.id}
              type="button"
              aria-label={`Show quote ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex ? 'bg-aurum' : 'bg-white/30 hover:bg-aurum/60'}`}
              onClick={() => goToIndex(index, 'user')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
