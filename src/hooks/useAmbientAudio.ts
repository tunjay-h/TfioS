import { useCallback, useEffect, useRef, useState } from 'react';

export type AmbientStatus = 'idle' | 'playing' | 'muted' | 'stopped' | 'blocked' | 'error';

export function useAmbientAudio(src: string, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<AmbientStatus>('idle');
  const [muted, setMuted] = useState(false);

  const disposeAudio = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    audioRef.current = null;
    setStatus('idle');
  }, []);

  const setupAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'none';
    audio.muted = muted;
    audioRef.current = audio;

    const handlePlaying = () => setStatus(audio.muted ? 'muted' : 'playing');
    const handlePause = () => setStatus(audio.muted ? 'muted' : 'stopped');
    const handleError = () => setStatus('error');

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
    setStatus(audio.muted ? 'muted' : 'stopped');
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

    try {
      await audio.play();
      setStatus(audio.muted ? 'muted' : 'playing');
    } catch (error) {
      setStatus('blocked');
    }
  }, [setupAudio]);

  return {
    status,
    muted,
    play,
    pause,
    toggleMute,
    manuallyUnblock,
  } as const;
}
