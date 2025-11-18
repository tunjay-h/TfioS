import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Feedback', href: 'mailto:hello@tfios.app?subject=Feedback', external: true },
];

export type StaggeredMenuProps = {
  className?: string;
  onHome?: () => void;
};

export function StaggeredMenu({ className = '', onHome }: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tfios-menu"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-aurum/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Menu
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="tfios-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-black/80 p-4 text-sm text-white shadow-2xl backdrop-blur"
          >
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.25,
                    delay: prefersReducedMotion ? 0 : index * 0.05,
                  }}
                >
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer noopener' : undefined}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-base transition hover:bg-white/10"
                    onClick={(event) => {
                      if (item.label === 'Home' && onHome) {
                        event.preventDefault();
                        onHome();
                      }
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <span className="text-xs uppercase tracking-[0.3em] text-starlight/60">{index + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
