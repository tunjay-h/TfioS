import { AnimatePresence, motion } from 'framer-motion';
import { Movie } from '../types';

export type MoviePanelProps = {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
};

export function MoviePanel({ movie, isOpen, onClose }: MoviePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && movie ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-6">
          <button type="button" aria-label="Close movie details" className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-panel-title"
            className="relative z-10 grid w-[min(960px,100%)] grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 text-white shadow-2xl backdrop-blur md:grid-cols-[320px_1fr]"
          >
            <img src={movie.poster} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
            <div className="flex flex-col gap-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-aurum">{movie.year}</p>
                <h3 id="movie-panel-title" className="font-display text-3xl font-semibold text-white">
                  {movie.title}
                </h3>
              </div>
              <p className="text-base text-starlight/90">{movie.plot}</p>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <iframe
                  key={movie.trailerEmbedUrl}
                  src={movie.trailerEmbedUrl}
                  title={`${movie.title} trailer`}
                  className="h-64 w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
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
                  onClick={onClose}
                  className="rounded-full border border-white/10 px-4 py-2 font-medium text-white transition hover:border-aurum/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
