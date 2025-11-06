import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import playlistData from './data/playlist.json';
import { Playlist, Track } from './types';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { StarField } from './components/StarField';
import { Header } from './components/Header';
import { DiscSlider } from './components/DiscSlider';
import { PlayerPanel } from './components/PlayerPanel';
import { Toast } from './components/Toast';
import { getTrackIdFromUrl, updateTrackIdInUrl } from './lib/url';

const data = playlistData as Playlist;

export default function App() {
  const { meta, tracks } = data;
  const { status, muted, pause, play, toggleMute, manuallyUnblock } = useAmbientAudio(
    meta.bgTrack.src,
    meta.bgTrack.volume,
  );
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<number | null>(null);

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
    if (status === 'blocked') {
      showToast('Tap to start ambient music.');
    } else if (status === 'error') {
      showToast('Ambient score failed to load.');
    }
  }, [status, showToast]);

  const selectTrack = useCallback(
    (track: Track) => {
      setSelectedTrack(track);
      setIsPanelOpen(true);
      pause();
      updateTrackIdInUrl(track.id);
    },
    [pause],
  );

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedTrack(null);
    updateTrackIdInUrl(null);
    if (status !== 'blocked') {
      play().catch(() => {
        /* ignore */
      });
    }
  }, [play, status]);

  useEffect(() => {
    const applyDeepLink = () => {
      const trackId = getTrackIdFromUrl();
      const track = tracks.find((item) => item.id === trackId) ?? null;
      if (track) {
        setSelectedTrack(track);
        setIsPanelOpen(true);
        pause();
      } else {
        setSelectedTrack(null);
        setIsPanelOpen(false);
      }
    };

    applyDeepLink();
    window.addEventListener('popstate', applyDeepLink);
    return () => window.removeEventListener('popstate', applyDeepLink);
  }, [pause, tracks]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPanelOpen(false);
        setSelectedTrack(null);
        updateTrackIdInUrl(null);
        if (status !== 'blocked') {
          play().catch(() => undefined);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [play, status]);

  const handleShare = useCallback(
    async (track: Track) => {
      const shareUrl = (() => {
        const url = new URL(window.location.href);
        url.searchParams.set('t', track.id);
        return url.toString();
      })();

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${track.title} — TfioS`,
            text: `Listen to ${track.title} by ${track.artist} on TfioS`,
            url: shareUrl,
          });
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
          // fall through
        }
      }

      showToast('Sharing is unavailable in this browser.');
    },
    [showToast],
  );

  const sortedTracks = useMemo(() => tracks, [tracks]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-midnight">
      <StarField />
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-32 pt-4 sm:px-10">
        <Header
          status={status}
          muted={muted}
          onToggleMute={toggleMute}
          onRetry={manuallyUnblock}
          title={meta.title}
          subtitle={meta.description}
          backgroundNote={meta.bgTrack.note}
        />
        <DiscSlider tracks={sortedTracks} activeTrackId={selectedTrack?.id ?? null} onSelect={selectTrack} />
      </main>
      <PlayerPanel track={selectedTrack} isOpen={isPanelOpen} onClose={closePanel} onShare={handleShare} />
      <Toast message={toast} />
    </div>
  );
}
