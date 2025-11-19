import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
};

export function StaggeredMenu({
  className = '',
  onHome,
  animationsEnabled,
  onToggleAnimations,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const disableMotion = !animationsEnabled;

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

  const transitionDuration = disableMotion ? 0 : 0.45;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="tfios-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((prev) => !prev)}
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 p-0 text-white/90 backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="relative flex h-5 w-6 items-center justify-center" aria-hidden>
          <span
            className={`absolute block h-[2px] w-full rounded-full bg-current transition-transform duration-300 ${
              open ? 'translate-y-0 rotate-45' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute block h-[2px] w-full rounded-full bg-current transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute block h-[2px] w-full rounded-full bg-current transition-transform duration-300 ${
              open ? 'translate-y-0 -rotate-45' : 'translate-y-2'
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: disableMotion ? 0 : 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: disableMotion ? 0 : 0.3 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              id="tfios-menu-panel"
              role="dialog"
              aria-modal="true"
              className="absolute inset-y-0 right-0 flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-l-[3rem] border-l border-white/20 bg-gradient-to-b from-white/95 via-white/90 to-white/85 text-midnight shadow-[0_0_80px_rgba(10,14,26,0.35)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: transitionDuration, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between px-12 pb-6 pt-12">
                  <p className="text-xl font-semibold text-midnight">Beyond the tracks</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-midnight/70 transition hover:text-midnight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    <span className="relative block h-4 w-4">
                      <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 rotate-45 bg-current" />
                      <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 -rotate-45 bg-current" />
                    </span>
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-12 pb-8">
                  <motion.ul
                    className="space-y-7"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        transition: {
                          staggerChildren: disableMotion ? 0 : 0.08,
                          delayChildren: disableMotion ? 0 : 0.1,
                        },
                      },
                      closed: {
                        transition: {
                          staggerChildren: disableMotion ? 0 : 0.05,
                          staggerDirection: -1,
                        },
                      },
                  }}
                >
                  {menuItems.map((item) => (
                    <motion.li
                      key={item.label}
                      className="border-b border-black/5 pb-6"
                      variants={{
                        open: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: disableMotion ? 0 : 0.5,
                            ease: disableMotion ? 'linear' : [0.16, 1, 0.3, 1],
                          },
                        },
                        closed: {
                          opacity: 0,
                          y: disableMotion ? 0 : 32,
                          transition: {
                            duration: disableMotion ? 0 : 0.2,
                            ease: 'linear',
                          },
                        },
                      }}
                    >
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noreferrer noopener' : undefined}
                        className="group flex items-center justify-between gap-6 text-[clamp(2rem,5vw,3.5rem)] font-semibold uppercase tracking-tight text-midnight/80 transition hover:text-midnight"
                        onClick={(event) => {
                          if (item.label === 'Home' && onHome) {
                            event.preventDefault();
                            onHome();
                          }
                          setOpen(false);
                        }}
                      >
                        <span className="block leading-none">{item.label}</span>
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
                </nav>
                <div className="px-12 pb-10 pt-4 text-sm text-midnight/70">
                  <div className="flex items-center justify-between gap-4 border-t border-black/10 py-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.4em]">Animations</span>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleAnimations();
                      }}
                      className="rounded-full border border-black/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-midnight/80 transition hover:text-midnight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      {animationsEnabled ? 'On' : 'Off'}
                    </button>
                  </div>
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-neutral-500/80">
                    hello@tfios.app · crafted amongst the stars
                  </p>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
