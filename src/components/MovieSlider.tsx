import { useRef, useCallback } from 'react';
import { Movie } from '../types';

export type MovieSliderProps = {
  movies: Movie[];
  activeMovieId: string | null;
  onSelect: (movie: Movie) => void;
};

export function MovieSlider({ movies, activeMovieId, onSelect }: MovieSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight' ? Math.min(movies.length - 1, index + 1) : Math.max(0, index - 1);
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[data-movie-index]');
      const nextButton = buttons?.[nextIndex];
      nextButton?.focus({ preventScroll: false });
      if (nextButton) {
        onSelect(movies[nextIndex]);
      }
    },
    [movies, onSelect],
  );

  return (
    <section aria-labelledby="movies-heading" className="relative z-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="movies-heading" className="font-display text-2xl font-semibold text-white">
          Movies that live in our stars
        </h2>
        <p className="text-sm text-starlight/70">Tap a poster to open details and a trailer.</p>
      </div>
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8"
        role="listbox"
        aria-label="Movie cards"
      >
        {movies.map((movie, index) => {
          const isActive = activeMovieId === movie.id;
          return (
            <div key={movie.id} className="snap-start">
              <button
                type="button"
                role="option"
                data-movie-index={index}
                aria-selected={isActive}
                onClick={() => onSelect(movie)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`group relative flex w-52 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/30 text-left text-white shadow-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aurora/70 ${
                  isActive ? 'scale-105 border-aurum/60' : 'hover:scale-[1.02] hover:border-aurum/30'
                }`}
                aria-label={`${movie.title} (${movie.year})`}
              >
                <div className="relative w-full overflow-hidden">
                  <div className="aspect-[2/3] w-full overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1 px-4 py-3">
                  <p className="text-base font-semibold leading-tight">{movie.title}</p>
                  <p className="text-sm text-starlight/70">{movie.year}</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
