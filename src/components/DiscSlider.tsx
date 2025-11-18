import { useCallback, useRef } from 'react';
import { Track } from '../types';

export type DiscSliderProps = {
  tracks: Track[];
  activeTrackId: string | null;
  onSelect: (track: Track) => void;
};

export function DiscSlider({ tracks, activeTrackId, onSelect }: DiscSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight' ? Math.min(tracks.length - 1, index + 1) : Math.max(0, index - 1);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[data-track-index]');
      const nextButton = buttons?.[nextIndex];
      nextButton?.focus({ preventScroll: false });
      if (nextButton) {
        const nextTrack = tracks[nextIndex];
        onSelect(nextTrack);
      }
    },
    [onSelect, tracks],
  );

  return (
    <section aria-labelledby="tracks-heading" className="relative z-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="tracks-heading" className="font-display text-2xl font-semibold text-white">
          A constellation of tracks
        </h2>
        <p className="text-sm text-starlight/70">
          Scroll, tap, or use arrow keys to explore. Press Enter to open a track.
        </p>
      </div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8"
        role="listbox"
        aria-label="Track discs"
      >
        {tracks.map((track, index) => {
          const isActive = activeTrackId === track.id;
          return (
            <div key={track.id} className="snap-center">
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                data-track-index={index}
                onClick={() => onSelect(track)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`group relative flex h-[190px] w-[190px] items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px] ${
                  isActive
                    ? 'scale-105 border-aurum/70 shadow-[0_0_40px_rgba(215,184,102,0.35)]'
                    : 'hover:scale-[1.02] hover:border-aurum/40'
                }`}
                aria-label={`${track.title} by ${track.artist}`}
              >
                <span className="pointer-events-none absolute inset-3 rounded-full border border-white/5 bg-white/5 opacity-50 blur-3xl" />
                <span className="pointer-events-none absolute inset-1 rounded-full border border-white/5" />
                <span className="pointer-events-none absolute inset-0 rounded-full border border-white/5 opacity-60" />
                <div className="pointer-events-none absolute inset-5 rounded-full border border-aurum/10" />
                <div className="pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center text-center">
                  <p className="max-w-[85%] text-base font-semibold leading-tight text-white sm:text-lg">
                    {track.title}
                  </p>
                  <p className="mt-2 text-sm text-starlight/80">{track.artist}</p>
                  <span className="mt-auto text-xs font-semibold uppercase tracking-[0.4em] text-aurum">{track.year}</span>
                </div>
                <span
                  className={`pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-aurum shadow-[0_0_12px_rgba(215,184,102,0.8)] ${
                    isActive ? 'animate-orbital-loop' : 'opacity-0 group-hover:opacity-80'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
