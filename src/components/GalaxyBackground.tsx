import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const BASE_COLOR = '#0A0E1A';
const STAR_LAYERS = [
  { count: 60, speed: 0.015, size: [0.4, 1], color: 'rgba(255,255,255,0.45)' },
  { count: 40, speed: 0.03, size: [0.8, 1.8], color: 'rgba(215,184,102,0.6)' },
  { count: 20, speed: 0.06, size: [1.4, 2.6], color: 'rgba(255,255,255,0.75)' },
];

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  twinkleOffset: number;
};

function createStars(width: number, height: number) {
  const densityMultiplier = width < 640 ? 0.6 : width < 1024 ? 0.85 : 1;
  const stars: Star[] = [];
  STAR_LAYERS.forEach((layer) => {
    const count = Math.floor(layer.count * densityMultiplier);
    for (let index = 0; index < count; index += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        speed: layer.speed * (0.5 + Math.random()),
        color: layer.color,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  });
  return stars;
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return undefined;
    }

    let animationFrame: number | null = null;
    let stars: Star[] = [];

    const setCanvasSize = () => {
      const { innerWidth, innerHeight, devicePixelRatio = 1 } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      stars = createStars(innerWidth, innerHeight);
    };

    const drawFrame = (time: number) => {
      const { width, height } = canvas;
      const ratio = window.devicePixelRatio || 1;
      const displayWidth = width / ratio;
      const displayHeight = height / ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, displayWidth, displayHeight);
      context.fillStyle = BASE_COLOR;
      context.fillRect(0, 0, displayWidth, displayHeight);

      stars.forEach((star) => {
        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.0006 + star.twinkleOffset);
        const gradient = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, 'rgba(10,14,26,0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * (prefersReducedMotion ? 1 : twinkle), 0, Math.PI * 2);
        context.fill();

        if (!prefersReducedMotion) {
          star.x += star.speed * 50 * (displayWidth / 1920);
          if (star.x > displayWidth + star.radius) {
            star.x = -star.radius;
            star.y = Math.random() * displayHeight;
          }
        }
      });
    };

    const handleResize = () => {
      setCanvasSize();
      drawFrame(performance.now());
    };

    setCanvasSize();
    drawFrame(performance.now());

    if (!prefersReducedMotion) {
      const render = (time: number) => {
        drawFrame(time);
        animationFrame = window.requestAnimationFrame(render);
      };
      animationFrame = window.requestAnimationFrame(render);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050714] via-[#080C18] to-[#020309]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(126,96,191,0.25), transparent 55%), radial-gradient(circle at 80% 10%, rgba(28,110,181,0.35), transparent 60%), radial-gradient(circle at 50% 80%, rgba(215,184,102,0.25), transparent 70%)',
      }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F24]/80 via-transparent to-transparent" />
    </div>
  );
}
