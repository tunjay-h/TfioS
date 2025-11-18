import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Feedback', href: 'mailto:hello@tfios.app?subject=Feedback' },
];

export type StaggeredMenuProps = {
  className?: string;
  onHome?: () => void;
};

export function StaggeredMenu({ className = '', onHome }: StaggeredMenuProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleLockScroll = () => {
      document.body.style.setProperty('overflow', 'hidden');
    };

    const releaseScroll = () => {
      document.body.style.removeProperty('overflow');
    };

    handleLockScroll();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      releaseScroll();
    };
  }, [open]);

  const menuItems = useMemo(() => navItems, []);

  const transitionDuration = prefersReducedMotion ? 0 : 0.45;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="tfios-menu-panel"
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:border-aurum/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="text-xs">Menu</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg font-light transition group-hover:bg-white/20">
          {open ? '−' : '+'}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              id="tfios-menu-panel"
              role="dialog"
              aria-modal="true"
              className="absolute inset-y-0 right-0 flex h-full w-full max-w-xl flex-col overflow-hidden rounded-l-[3rem] border-l border-white/10 bg-gradient-to-b from-white/90 via-white/80 to-white/70 text-midnight shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(82,39,255,0.35),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(209,152,70,0.4),_transparent_65%)]" />
              </div>

              <div className="flex items-center justify-between px-10 pb-6 pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">Navigation</p>
                  <p className="text-lg font-semibold text-midnight">Beyond the tracks</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-midnight transition hover:bg-white"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-between px-10 pb-10">
                <ul className="space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      className="border-b border-black/10 pb-4"
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.5,
                        delay: prefersReducedMotion ? 0 : 0.08 * index,
                        ease: prefersReducedMotion ? 'linear' : [0.22, 1, 0.36, 1],
                      }}
                    >
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noreferrer noopener' : undefined}
                        className="group flex items-center justify-between text-4xl font-semibold uppercase tracking-tight text-midnight/80 transition hover:text-midnight"
                        onClick={(event) => {
                          if (item.label === 'Home' && onHome) {
                            event.preventDefault();
                            onHome();
                          }
                          setOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-4">
                          <span className="text-sm font-bold text-aurora/80">{String(index + 1).padStart(2, '0')}</span>
                          {item.label}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500">
                          {item.external ? 'Open' : 'Enter'}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
                  hello@tfios.app · crafted amongst the stars
                </p>
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
