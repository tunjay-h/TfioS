import { useEffect, useMemo, useState } from 'react';

const glassCardClass = 'rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md shadow-lg';

const polaroidClass = `${glassCardClass} overflow-hidden rounded-2xl`;

type LightboxImage = {
  src: string;
  alt: string;
};

type AboutPageProps = {
  animationsEnabled: boolean;
};

export function AboutPage({ animationsEnabled }: AboutPageProps) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const photoStack = useMemo<LightboxImage[]>(
    () => [
      { src: '/tfios-origin.jpg', alt: 'TfioS origin mark on a wall' },
      { src: '/tfios-st.jpg', alt: 'Close-up of the Space Time / #TfioS wall mark' },
    ],
    [],
  );

  useEffect(() => {
    if (!lightboxImage) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage]);

  const transitionDuration = animationsEnabled ? 'duration-300' : 'duration-0';

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:px-10 sm:pt-24 sm:pb-28 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-12 leading-relaxed text-white/90">
          <header className="space-y-4 text-center">
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">About TfioS</h1>
            <p className="text-lg text-starlight/80 sm:text-xl">The Future is on Stars · The Future in Our Stars</p>
          </header>

          <section className={`${glassCardClass} mx-auto max-w-4xl space-y-6 px-8 py-10 sm:px-10 sm:py-12`}>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">A letter from us</p>
            <div className="mx-auto max-w-[72ch] space-y-5 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
              <p>
                <strong>TfioS</strong> is a small constellation we built for the things that quietly stayed.
              </p>
              <p>
                Some songs don’t just play — they <em>return</em>.<br />
                They find you again in different years, different versions of you, and still say the same true thing.
              </p>
              <p>
                We wanted a place for those moments.<br />
                Not a feed. Not a timeline. Not another loud corner of the internet.<br />
                Just a calm sky you can open and breathe in.
              </p>
              <p>
                Here, a track becomes a star.<br />
                A film becomes a little world you revisit.<br />
                A sentence becomes a light you carry — the kind you don’t notice until the night gets heavy.
              </p>
              <p>
                And yes—there are <strong>stars</strong> in this story.<br />
                Not because we need countless lights, but because a few of them become landmarks.<br />
                We return to certain melodies and lines the way you look up in the dark:<br />
                not to escape life, but to remember.
              </p>
              <p>
                Because growing up is not the problem — <strong>forgetting is</strong>.<br />
                And when the world gets loud, we all need small reminders of <strong>what is essential</strong>.
              </p>
              <p>
                We curate slowly.<br />
                We choose what can survive time: what holds meaning even after the first excitement fades.<br />
                If it still feels like home a year later, it belongs.
              </p>
              <p>
                If you have a song, a movie, or a line that deserves a place in this sky, send it to us.<br />
                We’ll read every message.
              </p>
              <div className="space-y-1">
                <a
                  href="mailto:hello@tfios.app"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-base font-semibold text-white/90 shadow-inner transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  hello@tfios.app
                </a>
                <p className="text-sm text-white/60">— <strong>T &amp; S</strong></p>
              </div>
            </div>
          </section>

          <div className="border-t border-white/10" />

          <section className="mx-auto max-w-5xl space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Where TfioS began</h2>
              <p className="text-white/70">The origin note that became our small constellation.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div className="space-y-5 text-lg leading-relaxed text-white/80 md:pr-6">
                <p>
                  About nine years ago, traveling with my family, we left a small mark on a wall: <strong>TfioS</strong>.
                </p>
                <p>
                  It carried a few meanings at once — a nod to <em>The Fault in Our Stars</em>, an inside signature for{' '}
                  <strong>T &amp; S</strong>, and a quiet fascination with <strong>space-time</strong>.
                  It was a tiny moment, but it stayed.
                </p>
                <p>
                  So we brought it here — not as a headline, but as a reminder: some things matter not because they’re big, but
                  because they’re <em>ours</em>.
                </p>
              </div>

              <div className="space-y-4 md:space-y-5 md:pl-4">
                <div className="grid gap-5 md:gap-6">
                  <button
                    type="button"
                    onClick={() => setLightboxImage(photoStack[0])}
                    className={`${polaroidClass} ${transitionDuration} relative block overflow-hidden border-white/15 bg-gradient-to-b from-white/5 via-white/5 to-black/40 p-4 text-left shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:-rotate-2`}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/30">
                      <img
                        src={photoStack[0].src}
                        alt={photoStack[0].alt}
                        loading="lazy"
                        className={`${transitionDuration} h-full w-full rounded-xl object-cover`}
                      />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxImage(photoStack[1])}
                    className={`${polaroidClass} ${transitionDuration} relative block overflow-hidden border-white/15 bg-gradient-to-b from-white/5 via-white/5 to-black/40 p-4 text-left shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:rotate-1`}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/30">
                      <img
                        src={photoStack[1].src}
                        alt={photoStack[1].alt}
                        loading="lazy"
                        className={`${transitionDuration} h-full w-full rounded-xl object-cover`}
                      />
                    </div>
                  </button>
                </div>
                <p className="text-sm text-white/60">~2017-18 — “Space Time” + #TfioS</p>
              </div>
            </div>
          </section>

          <div className="border-t border-white/10" />

          <section className={`${glassCardClass} space-y-4 px-6 py-6 text-sm text-white/70 sm:px-7 sm:py-7`}>
            <p>
              TfioS is a curated collection of links, embeds, and references for listening/watching/reading purposes. All music,
              films, images, and quotes remain the property of their respective creators and publishers.
            </p>
            <p>
              When you play content, TfioS may load third-party players and external services (e.g., YouTube, Spotify, Apple
              Music, IMDb). These services may collect data and set cookies according to their own policies.
            </p>
            <p>
              Suggestions, corrections, feedback: <a href="mailto:hello@tfios.app" className="text-white">hello@tfios.app</a>
            </p>
          </section>
        </div>
      </div>

      {lightboxImage ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm ${transitionDuration}`}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className={`relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-2xl ${transitionDuration}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setLightboxImage(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ×
            </button>
            <div className="max-h-[80vh] overflow-hidden">
              <img src={lightboxImage.src} alt={lightboxImage.alt} className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
