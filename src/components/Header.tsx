import { motion } from 'framer-motion';
import { AmbientStatus } from '../hooks/useAmbientAudio';

export type HeaderProps = {
  status: AmbientStatus;
  muted: boolean;
  onToggleMute: () => void;
  onRetry: () => void;
  title: string;
  subtitle: string;
  backgroundNote: string;
};

const statusLabelMap: Record<AmbientStatus, string> = {
  idle: 'Idle',
  playing: 'Playing',
  muted: 'Muted',
  stopped: 'Stopped',
  blocked: 'Blocked',
  error: 'Error',
};

export function Header({ status, muted, onToggleMute, onRetry, title, subtitle, backgroundNote }: HeaderProps) {
  const isBlocked = status === 'blocked';

  const buttonLabel = isBlocked ? 'Start ambient' : muted ? 'Unmute ambient' : 'Mute ambient';

  return (
    <header className="relative z-10 flex flex-col gap-8 py-8 text-starlight md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-sm text-starlight/80 backdrop-blur"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse" aria-hidden />
          The Future is on Stars · The Future in Our Stars
        </motion.div>
        <motion.h1
          className="font-display text-5xl font-semibold tracking-tight text-white drop-shadow-lg md:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg text-starlight/90"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      </div>
      <div className="flex max-w-md flex-col gap-2 rounded-2xl bg-white/5 p-4 text-sm text-starlight/90 backdrop-blur md:-mr-8">
        <p className="font-medium uppercase tracking-[0.2em] text-starlight/70">Ambient Score</p>
        <p className="text-base text-white">Finding the Rose · Hans Zimmer &amp; Richard Harvey</p>
        <p className="text-xs text-starlight/60">{backgroundNote}</p>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={isBlocked ? onRetry : onToggleMute}
            className="rounded-full bg-aurora/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-aurora/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {buttonLabel}
          </button>
          <span className="text-xs uppercase tracking-[0.3em] text-starlight/50">
            {isBlocked ? 'Blocked · Tap to enable' : statusLabelMap[status]}
          </span>
        </div>
        {isBlocked ? (
          <button
            type="button"
            className="text-xs text-starlight/70 underline decoration-dotted underline-offset-2 hover:text-white"
            onClick={onRetry}
          >
            Tap to start ambient music
          </button>
        ) : null}
      </div>
    </header>
  );
}
