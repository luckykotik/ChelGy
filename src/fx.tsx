import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { PALETTE } from './data';

/* Появление блока при прокрутке */
export function Reveal({ children, delay = 0, className = '', style }: {
  children: ReactNode; delay?: number; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('vis'); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ...style, ['--rd' as string]: `${delay}s` }}>
      {children}
    </div>
  );
}

/* Взрыв конфетти в фирменных цветах из точки экрана */
export function burst(x: number, y: number, n = 26) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 8;
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size * (Math.random() > .5 ? 1 : .45)}px;background:${PALETTE[i % 3]};z-index:120;pointer-events:none;border-radius:${Math.random() > .5 ? '50%' : '2px'}`;
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 190;
    p.animate(
      [
        { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist - size / 2}px, ${Math.sin(ang) * dist + 130}px) rotate(${Math.random() * 560 - 280}deg)`, opacity: 0 },
      ],
      { duration: 950 + Math.random() * 650, easing: 'cubic-bezier(.17,.84,.44,1)' },
    ).onfinish = () => p.remove();
  }
}

export function burstFromEl(el: HTMLElement | null) {
  if (!el) { burst(innerWidth / 2, innerHeight / 3); return; }
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
}

/* 3D-наклон карточки за курсором + блик */
export function tiltHandlers(max = 7) {
  return {
    onMouseMove(e: MouseEvent<HTMLElement>) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-5px)`;
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    },
    onMouseLeave(e: MouseEvent<HTMLElement>) {
      e.currentTarget.style.transform = '';
    },
  };
}

/* Анимированный счётчик */
export function useCounter(target: number, run: boolean, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setVal(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return val;
}
