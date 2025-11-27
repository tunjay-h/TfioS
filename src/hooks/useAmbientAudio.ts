import { useCallback, useEffect, useRef, useState } from 'react';

export type AmbientStatus = 'idle' | 'playing' | 'muted' | 'stopped' | 'blocked' | 'error';

export function useAmbientAudio(src: string, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const warmupHandleRef = useRef<number | null>(null);
  const warmupScheduledRef = useRef(false);
  const [status, setStatus] = useState<AmbientStatus>('idle');
  const [muted, setMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const disposeAudio = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    audioRef.current = null;
    setStatus('idle');
    setIsStarting(false);
  }, []);

  const setupAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'none';
    audio.muted = muted;
    audioRef.current = audio;

    const handlePlaying = () => {
      setIsStarting(false);
      setStatus(audio.muted ? 'muted' : 'playing');
    };
    const handlePause = () => {
      setIsStarting(false);
      setStatus(audio.muted ? 'muted' : 'stopped');
    };
    const handleError = () => {
      setIsStarting(false);
      setStatus('error');
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    cleanupRef.current = () => {
      audio.pause();
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };

    return audio;
  }, [muted, src, volume]);

  useEffect(() => disposeAudio, [disposeAudio, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume));
    audio.muted = muted;
  }, [muted, volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsStarting(true);
    try {
      await audio.play();
      setStatus(muted ? 'muted' : 'playing');
      setIsStarting(false);
    } catch (error) {
      setStatus('blocked');
      setIsStarting(false);
      throw error;
    }
  }, [muted]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setStatus(audio.muted ? 'muted' : 'stopped');
    setIsStarting(false);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setMuted((current) => !current);
      return;
    }
    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    setStatus(() => {
      if (nextMuted) return 'muted';
      return audio.paused ? 'stopped' : 'playing';
    });
  }, [muted]);

  const manuallyUnblock = useCallback(async () => {
    const audio = setupAudio();
    if (!audio) return;

    setIsStarting(true);
    try {
      await audio.play();
      setStatus(audio.muted ? 'muted' : 'playing');
      setIsStarting(false);
    } catch (error) {
      setStatus('blocked');
      setIsStarting(false);
    }
  }, [setupAudio]);

  useEffect(() => {
    warmupScheduledRef.current = false;

    const warmup = () => {
      if (warmupScheduledRef.current) return;
      warmupScheduledRef.current = true;

      warmupHandleRef.current = window.setTimeout(() => {
        const audio = setupAudio();
        if (!audio) return;

        if (!audio.paused || audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          return;
        }

        audio.preload = 'auto';
        try {
          audio.load();
        } catch {
          // Swallow load errors; user interaction will retry play.
        }
      }, 1800);
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as typeof window & { requestIdleCallback: (cb: IdleRequestCallback) => number }).requestIdleCallback(
          warmup,
          { timeout: 3000 },
        );
      } else {
        warmup();
      }
    }

    return () => {
      if (warmupHandleRef.current !== null) {
        window.clearTimeout(warmupHandleRef.current);
      }
    };
  }, [setupAudio, src]);

  return {
    status,
    muted,
    isStarting,
    play,
    pause,
    toggleMute,
    manuallyUnblock,
  } as const;
}
