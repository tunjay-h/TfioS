import { useCallback, useRef } from 'react';
import { Track } from '../types';

export type DiscSliderProps = {
  tracks: Track[];
  activeTrackId: string | null;
  onSelect: (track: Track) => void;
};

const streamingLinks = [
  { label: 'Spotify', href: 'https://open.spotify.com/playlist/4eFR0v0yG0V6KK5XL5Rwc0' },
  { label: 'YouTube', href: 'https://www.youtube.com/playlist?list=PLXahTfeEZfDDxh9j7B8uy39y_GYpyc_5c' },
  { label: 'Apple', href: 'https://music.apple.com/az/playlist/little-beautiful/pl.u-6mo4ayvFPB2gor' },
];

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="tracks-heading" className="font-display text-2xl font-semibold text-white">
          A constellation of tracks
        </h2>
        <div className="flex flex-col gap-2 text-sm text-starlight/80 sm:items-end sm:text-right">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-starlight/60">
            Listen to this constellation on:
          </span>
          <div className="flex flex-wrap gap-3 text-base text-white">
            {streamingLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aurora/70"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8"
        role="listbox"
        aria-label="Track discs"
      >
        {tracks.map((track, index) => {
          const isActive = activeTrackId === track.id;
          const hasCover = Boolean(track.coverUrl);
          return (
            <div key={track.id} className="snap-center">
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                data-track-index={index}
                onClick={() => onSelect(track)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`group relative flex h-[190px] w-[190px] items-center justify-center overflow-hidden rounded-full border border-white/15 p-6 text-white transition focus-visible:ring-4 focus-visible:ring-aurum/40 sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px] ${
                  isActive
                    ? 'scale-105 border-aurum/70 shadow-[0_0_40px_rgba(215,184,102,0.45)]'
                    : 'hover:scale-[1.02] hover:border-aurum/40'
                }`}
                aria-label={`${track.title} by ${track.artist}`}
              >
                {hasCover ? (
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                    <img
                      src={track.coverUrl ?? ''}
                      alt={`${track.title} artwork`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 rounded-full bg-gradient-to-b from-black/10 via-black/60 to-black/80" />
                  </span>
                ) : (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 70% 40%, rgba(110,145,255,0.25), transparent 55%), radial-gradient(circle at 50% 80%, rgba(215,184,102,0.3), transparent 60%)',
                    }}
                  />
                )}
                <span className="pointer-events-none absolute inset-1 rounded-full border border-white/10" />
                <span className="pointer-events-none absolute inset-4 rounded-full border border-white/5" />
                <div className="pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center">
                  <p className="text-base font-semibold leading-tight text-white sm:text-lg">{track.title}</p>
                  <p className="text-sm text-starlight/80">{track.artist}</p>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.4em] text-aurum">{track.year}</span>
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
