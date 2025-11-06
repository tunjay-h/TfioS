import { useCallback, useMemo, useRef } from 'react';
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

  const initials = useMemo(() => {
    const computeInitials = (title: string) =>
      title
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, 3)
        .toUpperCase();
    return tracks.reduce<Record<string, string>>((acc, track) => {
      acc[track.id] = computeInitials(track.title);
      return acc;
    }, {});
  }, [tracks]);

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
                className={`group relative flex h-44 w-44 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:h-52 md:w-52 ${
                  isActive
                    ? 'border-aurora/80 bg-white/10 shadow-[0_0_30px_rgba(139,92,246,0.45)]'
                    : 'border-white/10 bg-white/5 hover:border-aurora/40 hover:bg-white/10'
                }`}
                aria-label={`${track.title} by ${track.artist}`}
              >
                <span
                  className="pointer-events-none select-none text-3xl font-semibold uppercase tracking-[0.35em] text-starlight/90 group-hover:text-white"
                >
                  {initials[track.id]}
                </span>
                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <span className="block font-semibold">{track.title}</span>
                  <span className="text-starlight/70">{track.artist}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
