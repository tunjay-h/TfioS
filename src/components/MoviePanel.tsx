import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Movie } from '../types';

export type MoviePanelProps = {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (movie: Movie) => void;
};

const DESKTOP_QUERY = '(min-width: 768px)';

export function MoviePanel({ movie, isOpen, onClose, onShare }: MoviePanelProps) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(DESKTOP_QUERY).matches,
  );
  const [shouldRenderTrailer, setShouldRenderTrailer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    if (isOpen && movie) {
      setShouldRenderTrailer(true);
      document.body.style.setProperty('overflow', 'hidden');
    } else {
      setShouldRenderTrailer(false);
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isOpen, movie]);

  const panelVariants = useMemo(
    () =>
      isDesktop
        ? {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
          }
        : {
            hidden: { y: '100%' },
            visible: { y: '0%' },
            exit: { y: '100%' },
          },
    [isDesktop],
  );

  return (
    <AnimatePresence>
      {isOpen && movie ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center px-4 py-6 md:items-center">
          <motion.button
            type="button"
            aria-label="Close movie details"
            className="absolute inset-0 bg-black/60 gpu-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            key={movie.id}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-panel-title"
            className="gpu-layer relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md md:max-h-[85vh] md:flex-row md:rounded-3xl"
            style={{ height: isDesktop ? 'auto' : '85vh' }}
          >
            <div className="relative h-64 w-full flex-shrink-0 overflow-hidden md:h-auto md:w-80">
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg transition hover:border-aurum/80 hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="relative block h-5 w-5">
                  <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              </button>
              <div className="space-y-3 pr-6">
                <p className="text-xs uppercase tracking-[0.4em] text-aurum">{movie.year}</p>
                <h3 id="movie-panel-title" className="font-display text-3xl font-semibold text-white">
                  {movie.title}
                </h3>
                <p className="text-base text-starlight/90">{movie.plot}</p>
              </div>
              <div className="mt-6 space-y-4 pr-6">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  {shouldRenderTrailer ? (
                    <iframe
                      key={movie.trailerEmbedUrl}
                      src={movie.trailerEmbedUrl}
                      title={`${movie.title} trailer`}
                      className="h-64 w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center text-sm uppercase tracking-[0.4em] text-starlight/50">
                      Trailer loads when opened
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a
                    href={movie.imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 font-medium text-white transition hover:border-aurum/70 hover:text-aurum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    View on IMDb
                  </a>
                  <button
                    type="button"
                    onClick={() => onShare(movie)}
                    className="rounded-full border border-white/10 px-4 py-2 font-medium text-white transition hover:border-aurum/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
