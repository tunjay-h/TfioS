import { motion, AnimatePresence } from 'framer-motion';
import { Track } from '../types';

export type PlayerPanelProps = {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (track: Track) => void;
};

export function PlayerPanel({ track, isOpen, onClose, onShare }: PlayerPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && track ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <button
            aria-label="Close player"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="relative z-50 mb-10 w-[min(100%,700px)] rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-white shadow-2xl backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="player-title" className="font-display text-2xl font-semibold tracking-tight">
                  {track.title}
                </h3>
                <p className="text-sm text-starlight/70">{track.artist}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Close
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {track.embedUrl ? (
                <iframe
                  key={track.embedUrl}
                  src={track.embedUrl}
                  title={`${track.title} player`}
                  className="h-64 w-full rounded-2xl"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center gap-4 px-6 py-12 text-center text-starlight/90">
                  <p className="max-w-md text-base">
                    This track doesn’t have a privacy-friendly embed yet. You can open it in a new tab to keep exploring.
                  </p>
                  <a
                    className="rounded-full bg-aurora/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-aurora/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    href={track.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open track
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-starlight/80">
              <button
                type="button"
                onClick={() => onShare(track)}
                className="rounded-full border border-white/10 px-4 py-2 font-medium transition hover:border-aurora/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Copy share link
              </button>
              <span className="text-xs text-starlight/60">
                Press Esc to close · Background music pauses while a track is open.
              </span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
