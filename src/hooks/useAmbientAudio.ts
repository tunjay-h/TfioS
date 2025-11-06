import { useCallback, useEffect, useRef, useState } from 'react';

export type AmbientStatus = 'idle' | 'playing' | 'muted' | 'stopped' | 'blocked' | 'error';

export function useAmbientAudio(src: string, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<AmbientStatus>('idle');
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'auto';
    audio.muted = muted;
    audioRef.current = audio;

    const handlePlaying = () =>
      setStatus((current) => (current === 'blocked' ? 'blocked' : audio.muted ? 'muted' : 'playing'));
    const handlePause = () => setStatus((current) => (current === 'blocked' ? 'blocked' : 'stopped'));
    const handleError = () => setStatus('error');

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    const attemptAutoplay = async () => {
      try {
        await audio.play();
        setStatus('playing');
      } catch (err) {
        setStatus('blocked');
      }
    };

    attemptAutoplay();

    return () => {
      audio.pause();
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [src, volume]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setStatus(muted ? 'muted' : 'playing');
    } catch (error) {
      setStatus('blocked');
      throw error;
    }
  }, [muted]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setStatus('stopped');
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
    setStatus(() => {
      if (nextMuted) return 'muted';
      return audio.paused ? 'stopped' : 'playing';
    });
  }, [muted]);

  const manuallyUnblock = useCallback(async () => {
    try {
      await play();
    } catch (error) {
      // ignore, status already set to blocked
    }
  }, [play]);

  return {
    status,
    muted,
    play,
    pause,
    toggleMute,
    manuallyUnblock,
  } as const;
}
