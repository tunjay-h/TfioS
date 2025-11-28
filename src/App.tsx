import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import playlistData from './data/playlist.json';
import moviesData from './data/movies.json';
import quotesData from './data/quotes.json';
import { Movie, Playlist, Quote, Track } from './types';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { GalaxyBackground } from './components/GalaxyBackground';
import { Header } from './components/Header';
import { DiscSlider } from './components/DiscSlider';
import { MovieSlider } from './components/MovieSlider';
import { MoviePanel } from './components/MoviePanel';
import { QuotesCarousel } from './components/QuotesCarousel';
import { StaggeredMenu } from './components/StaggeredMenu';
import { PlayerPanel } from './components/PlayerPanel';
import { Toast } from './components/Toast';
import { AboutPage } from './components/AboutPage';
import { buildShareUrl, navigateToRoute, parseRouteFromLocation, type Route } from './lib/url';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

const playlist = playlistData as Playlist;
const moviesCollection = moviesData as Movie[];
const quotesCollection = quotesData as Quote[];

export default function App() {
  const { meta, tracks } = playlist;
  const movies = moviesCollection;
  const quotes = quotesCollection;
  const { status, muted, isStarting, pause, play, toggleMute, manuallyUnblock } = useAmbientAudio(
    meta.bgTrack.src,
    meta.bgTrack.volume,
  );
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isMoviePanelOpen, setIsMoviePanelOpen] = useState(false);
  const [forcedQuoteId, setForcedQuoteId] = useState<string | null>(null);
  const [quoteAutoPaused, setQuoteAutoPaused] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<Route>({ type: 'home' });
  const toastTimeout = useRef<number | null>(null);
  const lastStableRoute = useRef<Route>({ type: 'home' });
  const quotesSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setAnimationsEnabled(!systemPrefersReducedMotion);
      return;
    }
    try {
      const stored = window.localStorage.getItem('tfios-animations');
      if (stored === 'on' || stored === 'off') {
        setAnimationsEnabled(stored === 'on');
      } else {
        setAnimationsEnabled(!systemPrefersReducedMotion);
      }
    } catch {
      setAnimationsEnabled(!systemPrefersReducedMotion);
    }
  }, [systemPrefersReducedMotion]);

  const handleToggleAnimations = useCallback(() => {
    setAnimationsEnabled((prev) => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('tfios-animations', next ? 'on' : 'off');
        }
      } catch {
        // ignore write errors
      }
      return next;
    });
  }, []);

  const rememberRoute = useCallback((route: Route) => {
    if (route.type === 'track' || route.type === 'movie') {
      return;
    }
    lastStableRoute.current = route;
  }, []);

  const applyRoute = useCallback(
    (route: Route, options: { pushState?: boolean } = {}) => {
      setCurrentRoute(route);
      rememberRoute(route);

      if (options.pushState) {
        navigateToRoute(route);
      }

      if (route.type === 'track') {
        const track = tracks.find((item) => item.id === route.id) ?? null;
        setSelectedTrack(track);
        setIsPanelOpen(Boolean(track));
        setIsMoviePanelOpen(false);
        setSelectedMovie(null);
        pause();
      } else {
        setIsPanelOpen(false);
        setSelectedTrack(null);
        if (status !== 'blocked') {
          play().catch(() => undefined);
        }
      }

      if (route.type === 'movie') {
        const movie = movies.find((item) => item.id === route.id) ?? null;
        setSelectedMovie(movie);
        setIsMoviePanelOpen(Boolean(movie));
      } else if (route.type !== 'track') {
        setIsMoviePanelOpen(false);
        setSelectedMovie(null);
      }

      if (route.type === 'quote') {
        setForcedQuoteId(route.id);
        setQuoteAutoPaused(true);
      } else if (route.type !== 'track') {
        setForcedQuoteId(null);
        setQuoteAutoPaused(false);
      }
    },
    [movies, pause, play, rememberRoute, status, tracks],
  );

  const showToast = useCallback((message: string) => {
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current);
    }
    setToast(message);
    toastTimeout.current = window.setTimeout(() => {
      setToast(null);
    }, 4200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        window.clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status === 'blocked' || status === 'idle') {
      showToast('Tap to start ambient music.');
    } else if (status === 'error') {
      showToast('Ambient score failed to load.');
    }
  }, [showToast, status]);

  const selectTrack = useCallback(
    (track: Track) => {
      applyRoute({ type: 'track', id: track.id }, { pushState: true });
    },
    [applyRoute],
  );

  const closePanel = useCallback(() => {
    const fallbackRoute = lastStableRoute.current ?? { type: 'home' };
    applyRoute(fallbackRoute, { pushState: true });
  }, [applyRoute]);

  const handleMovieSelect = useCallback(
    (movie: Movie) => {
      applyRoute({ type: 'movie', id: movie.id }, { pushState: true });
    },
    [applyRoute],
  );

  const closeMoviePanel = useCallback(() => {
    const route = lastStableRoute.current ?? { type: 'home' };
    applyRoute(route, { pushState: true });
  }, [applyRoute]);

  const handleQuoteChange = useCallback(
    (quote: Quote, source: 'auto' | 'user') => {
      if (source === 'user') {
        setForcedQuoteId(null);
        setQuoteAutoPaused(false);
        const route = { type: 'quote', id: quote.id } as const;
        setCurrentRoute(route);
        rememberRoute(route);
        navigateToRoute(route);
      }
    },
    [rememberRoute],
  );

  const goHome = useCallback(() => {
    const route = { type: 'home' } as const;
    applyRoute(route, { pushState: true });
  }, [applyRoute]);

  const handleNavigate = useCallback(
    (href: string) => {
      if (href === '/about') {
        applyRoute({ type: 'about' }, { pushState: true });
        return;
      }

      if (href === '/') {
        goHome();
        return;
      }

      window.location.href = href;
    },
    [applyRoute, goHome],
  );

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const route = parseRouteFromLocation();
      applyRoute(route);
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, [applyRoute]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (isPanelOpen) {
        closePanel();
      } else if (isMoviePanelOpen) {
        closeMoviePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMoviePanel, closePanel, isMoviePanelOpen, isPanelOpen]);

  const scrollQuotesIntoView = useCallback(() => {
    const section = quotesSectionRef.current;
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    if (forcedQuoteId) {
      scrollQuotesIntoView();
    }
  }, [forcedQuoteId, scrollQuotesIntoView]);

  const shareContent = useCallback(
    async ({ route, title, text }: { route: Route; title: string; text: string }) => {
      const shareUrl = buildShareUrl(route);

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url: shareUrl });
          showToast('Shared successfully.');
          return;
        } catch (error) {
          if ((error as DOMException).name === 'AbortError') {
            return;
          }
        }
      }

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Link copied to clipboard.');
          return;
        } catch (error) {
          // ignore
        }
      }

      showToast('Sharing is unavailable in this browser.');
    },
    [showToast],
  );

  const handleTrackShare = useCallback(
    (track: Track) =>
      shareContent({
        route: { type: 'track', id: track.id },
        title: `${track.title} — TfioS`,
        text: `Listen to ${track.title} by ${track.artist} on TfioS`,
      }),
    [shareContent],
  );

  const handleMovieShare = useCallback(
    (movie: Movie) =>
      shareContent({
        route: { type: 'movie', id: movie.id },
        title: `${movie.title} — TfioS`,
        text: `Explore ${movie.title} (${movie.year}) on TfioS`,
      }),
    [shareContent],
  );

  const handleQuoteShare = useCallback(
    (quote: Quote) =>
      shareContent({
        route: { type: 'quote', id: quote.id },
        title: `${quote.author} — TfioS`,
        text: `“${quote.text}” — ${quote.author}`,
      }),
    [shareContent],
  );

  const sortedTracks = useMemo(() => tracks, [tracks]);
  const isAbout = currentRoute.type === 'about';

  return (
    <div className="relative min-h-screen overflow-hidden bg-midnight isolate">
      <GalaxyBackground animationsEnabled={animationsEnabled} />
      <div className="relative z-10">
        <div className="flex justify-end px-4 pt-6 sm:px-8 lg:px-10">
          <StaggeredMenu
            onHome={goHome}
            onNavigate={handleNavigate}
            animationsEnabled={animationsEnabled}
            onToggleAnimations={handleToggleAnimations}
          />
        </div>
        {isAbout ? (
          <AboutPage animationsEnabled={animationsEnabled} />
        ) : (
          <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-32 pt-6 sm:px-8 lg:px-10">
            <Header
              status={status}
              muted={muted}
              isStarting={isStarting}
              onToggleMute={toggleMute}
              onRetry={manuallyUnblock}
              title={meta.title}
              subtitle={meta.description}
              backgroundNote={meta.bgTrack.note}
            />
            <DiscSlider tracks={sortedTracks} activeTrackId={selectedTrack?.id ?? null} onSelect={selectTrack} />
            <MovieSlider movies={movies} activeMovieId={selectedMovie?.id ?? null} onSelect={handleMovieSelect} />
            <QuotesCarousel
              quotes={quotes}
              controlledQuoteId={forcedQuoteId}
              onQuoteChange={handleQuoteChange}
              autoAdvancePaused={quoteAutoPaused}
              animationsEnabled={animationsEnabled}
              onShare={handleQuoteShare}
              sectionRef={quotesSectionRef}
            />
          </main>
        )}
      </div>
      <PlayerPanel track={selectedTrack} isOpen={isPanelOpen} onClose={closePanel} onShare={handleTrackShare} />
      <MoviePanel
        movie={selectedMovie}
        isOpen={isMoviePanelOpen}
        onClose={closeMoviePanel}
        onShare={handleMovieShare}
      />
      <Toast message={toast} />
    </div>
  );
}
