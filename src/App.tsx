import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GraduationCap, ArrowLeft, ArrowRight, ArrowDown, Check, Trophy, Dices,
  MousePointerClick, ListChecks, Compass, Sparkles, ChevronRight, ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { SPECIALTIES, PALETTE, type Specialty } from './data';
import { Reveal, burstFromEl, tiltHandlers, useCounter } from './fx';
import { ItGame, PoGame, FoGame, LawGame, LoGame, AdGame, TuGame, DrGame, type SceneProps } from './scenes';

const SCENES: Record<string, (p: SceneProps) => React.ReactNode> = {
  it: ItGame, po: PoGame, fo: FoGame, law: LawGame, lo: LoGame, ad: AdGame, tu: TuGame, dr: DrGame,
};

type View = { kind: 'home' } | { kind: 'detail'; id: string };

export default function App() {
  const [view, setView] = useState<View>({ kind: 'home' });
  const [wipe, setWipe] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('chel-done') || '[]')); } catch { return new Set(); }
  });
  const [toast, setToast] = useState<string | null>(null);
  const pending = useRef<View>({ kind: 'home' });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navigate = useCallback((v: View, color: string) => {
    pending.current = v;
    setWipe(color);
    setTimeout(() => { setView(pending.current); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); }, 300);
    setTimeout(() => setWipe(null), 780);
  }, []);

  const complete = useCallback((spec: Specialty) => (el: HTMLElement | null) => {
    setDone(prev => {
      if (prev.has(spec.id)) return prev;
      const next = new Set(prev).add(spec.id);
      localStorage.setItem('chel-done', JSON.stringify([...next]));
      return next;
    });
    burstFromEl(el);
    setToast(spec.title);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);

  const current = view.kind === 'detail' ? SPECIALTIES.find(s => s.id === view.id)! : null;

  return (
    <div className="min-h-screen relative">
      <BackgroundFx />
      <Header doneCount={done.size} onHome={() => view.kind !== 'home' && navigate({ kind: 'home' }, '#4d2e7b')} />

      {view.kind === 'home' ? (
        <Home done={done} go={s => navigate({ kind: 'detail', id: s.id }, s.color)} />
      ) : (
        <Detail
          key={current!.id}
          spec={current!}
          isDone={done.has(current!.id)}
          onDone={complete(current!)}
          back={() => navigate({ kind: 'home' }, current!.color)}
          go={s => navigate({ kind: 'detail', id: s.id }, s.color)}
        />
      )}

      <Footer />

      {/* Переход-«шторка» между экранами */}
      {wipe && (
        <div className="fixed inset-0 z-[90] flex pointer-events-none" aria-hidden>
          {PALETTE.map((c, i) => (
            <div key={c} className="flex-1 origin-center" style={{ background: c, animation: `wipebar .78s ${i * 0.07}s cubic-bezier(.7,0,.2,1) both` }} />
          ))}
        </div>
      )}

      {/* Тост о выполненном задании */}
      {toast && (
        <div className="toast-in fixed left-1/2 bottom-6 z-[110] -translate-x-1/2 w-[min(92vw,430px)]">
          <div className="flex items-center gap-3 rounded-2xl bg-ink text-white pl-3 pr-5 py-3 shadow-[0_18px_40px_rgba(20,20,43,.45)] border-2 border-white/20">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#2f9e44] shrink-0 pop-in"><Check size={20} strokeWidth={3.5} /></span>
            <div className="text-sm leading-snug">
              <b className="font-display text-[13px]">Задание выполнено!</b>
              <span className="block opacity-80">Профессия «{toast}» добавлена в твою коллекцию.</span>
            </div>
            <Trophy className="ml-auto text-accent shrink-0" size={22} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= ФОН ================= */
function BackgroundFx() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="dotgrid absolute inset-0" />
      <div className="aurora absolute w-[95vmax] h-[95vmax] left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />
      <div className="drift1 absolute w-[150px] h-[150px] rounded-full bg-accent/25 right-[6%] top-[16%]" />
      <div className="drift2 absolute w-[76px] h-[76px] rounded-[22px] bg-hot/25 left-[5%] top-[58%]" />
      <div className="drift1 absolute w-[54px] h-[54px] rounded-full bg-brand/20 right-[20%] bottom-[10%]" style={{ animationDelay: '-3s' }} />
    </div>
  );
}

/* ================= ШАПКА ================= */
function Header({ doneCount, onHome }: { doneCount: number; onHome: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 24);
    addEventListener('scroll', f, { passive: true }); f();
    return () => removeEventListener('scroll', f);
  }, []);
  const pct = (doneCount / SPECIALTIES.length) * 100;
  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-[0_10px_30px_rgba(20,20,43,.25)]' : ''}`}>
      <div className="relative overflow-hidden bg-brand text-white">
        <div className="drift1 absolute w-[130px] h-[130px] rounded-full bg-accent/30 right-[8%] -top-[70px]" aria-hidden />
        <div className="drift2 absolute w-[64px] h-[64px] rounded-[18px] bg-hot/40 right-[26%] -bottom-[30px]" aria-hidden />
        <div className="relative max-w-6xl mx-auto flex items-center gap-3.5 px-4 sm:px-6 py-3.5">
          <button onClick={onHome} className="flex items-center gap-3.5 cursor-pointer text-left group" aria-label="Колледж ЧелГУ — на главную">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-white text-brand shadow-[0_4px_0_rgba(0,0,0,.2)] -rotate-3 group-hover:rotate-3 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <GraduationCap size={26} />
            </span>
            <span className="leading-tight">
              <span className="sheen block font-display font-bold text-[clamp(15px,2.6vw,21px)]">Кем ты станешь?</span>
              <span className="block text-[12.5px] text-[#d9c8ff] font-semibold">Колледж ЧелГУ · выбери направление и попробуй себя в деле</span>
            </span>
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-white/12 border border-white/35 pl-1.5 pr-4 py-1.5" title="Попробовано профессий">
              <span className="relative grid place-items-center w-8 h-8 rounded-full" style={{ background: `conic-gradient(#ff9710 ${pct}%, rgba(255,255,255,.25) 0)` }}>
                <span className="grid place-items-center w-[26px] h-[26px] rounded-full bg-brand font-display text-[11px] font-bold">{doneCount}</span>
              </span>
              <span className="text-[12.5px] font-bold leading-tight">профессий<br />из {SPECIALTIES.length} твоих</span>
            </div>
            <a href="https://vk.com/chelsu" target="_blank" rel="noreferrer"
              className="btn-push hidden md:inline-flex items-center gap-1.5 rounded-full bg-accent text-ink font-bold text-[13px] px-4 py-2.5">
              Группа ВК <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ================= ГЛАВНАЯ ================= */
function Home({ done, go }: { done: Set<string>; go: (s: Specialty) => void }) {
  return (
    <main>
      <Hero go={go} />
      <Marquee go={go} />
      <section id="specialties" className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-4 scroll-mt-24">
        <Reveal>
          <p className="font-display text-[12px] tracking-[.18em] text-hot font-bold mb-3">ИССЛЕДУЙ СВОЙ ПУТЬ</p>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <h2 className="font-display font-black text-[clamp(26px,4.6vw,44px)] leading-[1.05] m-0">
              НАЙДИ ДЕЛО,<br />КОТОРОЕ <span className="grad-word">ЗАЖИГАЕТ.</span>
            </h2>
            <p className="max-w-[420px] text-mute font-medium leading-relaxed m-0">
              Восемь направлений — десятки профессий. Открой специальность, узнай, чем занимаются специалисты, и выполни настоящее практическое задание.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-9">
          {SPECIALTIES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.1} className={i === 0 ? 'lg:col-span-1' : ''}>
              <SpecCard spec={s} done={done.has(s.id)} onOpen={() => go(s)} />
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <RandomCard go={go} />
          </Reveal>
        </div>
      </section>
      <Steps />
    </main>
  );
}

function Hero({ go }: { go: (s: Specialty) => void }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [runCounters, setRunCounters] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % SPECIALTIES.length), 2300);
    const c = setTimeout(() => setRunCounters(true), 350);
    return () => { clearInterval(t); clearTimeout(c); };
  }, []);
  const word = SPECIALTIES[wordIdx];
  const WordIcon = word.icon;
  const professions = SPECIALTIES.reduce((a, s) => a + s.jobs.length, 0);
  const n1 = useCounter(8, runCounters);
  const n2 = useCounter(professions, runCounters);
  const n3 = useCounter(100, runCounters);
  const move = (e: React.MouseEvent) => {
    const r = heroRef.current!.getBoundingClientRect();
    setPar({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  return (
    <section ref={heroRef} onMouseMove={move} className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
      {/* плавающие иконки-чипы с параллаксом */}
      {SPECIALTIES.slice(0, 6).map((s, i) => {
        const Icon = s.icon;
        const spots = [
          'right-[4%] top-[6%]', 'right-[16%] top-[38%]', 'right-[3%] top-[64%]',
          'left-[1%] top-[70%]', 'right-[26%] top-[12%]', 'left-[38%] top-[2%]',
        ];
        const depth = 10 + i * 6;
        return (
          <span key={s.id} aria-hidden
            className={`absolute ${spots[i]} hidden md:block z-0 transition-transform duration-300 ease-out`}
            style={{ transform: `translate(${par.x * depth}px, ${par.y * depth}px)` }}>
            <span className="floaty grid place-items-center w-12 h-12 rounded-2xl bg-white border-[3px] shadow-[0_8px_0_rgba(20,20,43,.15)]"
              style={{ borderColor: s.color, color: s.color, ['--rot' as string]: `${i % 2 ? 5 : -6}deg`, animationDelay: `${i * .5}s` }}>
              <Icon size={22} />
            </span>
          </span>
        );
      })}
      <div className="relative z-10 max-w-[720px]">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border-2 border-ink px-4 py-1.5 text-[12.5px] font-bold shadow-[4px_4px_0_#14142b]">
            <Sparkles size={15} className="text-accent" /> ДЕНЬ ОТКРЫТЫХ ВОЗМОЖНОСТЕЙ · КОЛЛЕДЖ ЧелГУ
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display font-black text-[clamp(38px,7.5vw,76px)] leading-[1.02] mt-6 mb-0">
            Кем ты<br />станешь <span className="grad-word">завтра?</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-[17px] sm:text-lg text-mute font-medium leading-relaxed mt-5 max-w-[560px]">
            Не читай о профессиях — <b className="text-ink">попробуй их руками</b>. Найди улики, посади лес,
            вынеси вердикт, доставь груз и запусти дрон. Например, прямо сейчас ты можешь стать:
          </p>
          <div className="h-[52px] mt-2 flex items-center gap-3" aria-live="polite">
            <span key={word.id} className="pop-in inline-flex items-center gap-2.5 rounded-2xl border-[3px] bg-white px-4 py-2 font-display font-bold text-[clamp(14px,2.6vw,19px)] shadow-[5px_5px_0_rgba(20,20,43,.85)]"
              style={{ borderColor: word.color, color: word.color }}>
              <WordIcon size={22} /> {word.jobs[0]}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="#specialties" className="btn-push inline-flex items-center gap-2 rounded-full bg-brand text-white font-bold px-6 py-3.5 text-[15px]">
              Найти своё направление <ArrowDown size={17} />
            </a>
            <button onClick={() => go(SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)])}
              className="btn-push inline-flex items-center gap-2 rounded-full bg-white text-ink border-2 border-ink font-bold px-6 py-3.5 text-[15px] cursor-pointer">
              <Dices size={18} className="text-hot" /> Мне повезёт!
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-10">
            {[[n1, 'направлений'], [n2, 'профессий'], [`${n3}%`, 'практики']].map(([v, l]) => (
              <div key={l as string}>
                <span className="font-display font-black text-[30px] leading-none block">{v}</span>
                <span className="text-[13px] font-bold text-mute uppercase tracking-wide">{l as string}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee({ go }: { go: (s: Specialty) => void }) {
  const items = [...SPECIALTIES, ...SPECIALTIES];
  return (
    <div className="relative bg-ink text-white -rotate-1 scale-[1.02] my-6 overflow-hidden border-y-4 border-ink shadow-[0_10px_30px_rgba(20,20,43,.25)]" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-8 px-4 py-3">
        {items.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} onClick={() => go(s)} tabIndex={-1}
              className="flex items-center gap-2.5 font-display font-bold text-[13px] whitespace-nowrap cursor-pointer hover:text-accent transition-colors">
              <Icon size={17} style={{ color: s.color === '#4d2e7b' ? '#b79ced' : s.color }} /> {s.title.toUpperCase()}
              <span className="text-accent ml-5">✦</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpecCard({ spec, done, onOpen }: { spec: Specialty; done: boolean; onOpen: () => void }) {
  const Icon = spec.icon;
  return (
    <article {...tiltHandlers(6)} onClick={onOpen}
      className="tilt group relative h-full cursor-pointer rounded-[24px] bg-white border-[3px] border-ink p-6 overflow-hidden"
      style={{ boxShadow: `8px 8px 0 ${spec.color}` }}>
      <div className="glare" />
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-[.13] group-hover:scale-[1.6] transition-transform duration-700" style={{ background: spec.color }} />
      {done && (
        <span className="pop-in absolute right-4 top-4 z-10 grid place-items-center w-8 h-8 rounded-full bg-[#2f9e44] text-white border-2 border-white shadow" title="Задание выполнено">
          <Check size={17} strokeWidth={3.5} />
        </span>
      )}
      <span className="relative grid place-items-center w-[62px] h-[62px] rounded-2xl text-white border-[3px] border-ink shadow-[4px_4px_0_rgba(20,20,43,.85)] group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300"
        style={{ background: `linear-gradient(135deg, ${spec.color}, ${spec.color}c9)` }}>
        <Icon size={30} />
      </span>
      <h3 className="relative font-display font-bold text-[19px] leading-snug mt-4 mb-1.5">{spec.title}</h3>
      <p className="relative text-mute font-medium text-[14.5px] leading-relaxed m-0 min-h-[44px]">{spec.tagline}</p>
      <div className="relative flex flex-wrap gap-1.5 mt-4">
        {spec.jobs.slice(0, 3).map(j => (
          <span key={j} className="rounded-full text-white text-[12px] font-bold px-2.5 py-1" style={{ background: spec.color }}>{j}</span>
        ))}
      </div>
      <span className="relative inline-flex items-center gap-1.5 mt-5 font-bold text-[14px]" style={{ color: spec.color }}>
        {done ? 'Пройти ещё раз' : 'Попробовать себя'}
        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
      </span>
    </article>
  );
}

function RandomCard({ go }: { go: (s: Specialty) => void }) {
  return (
    <button onClick={() => go(SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)])}
      className="tilt group relative w-full h-full min-h-[240px] cursor-pointer rounded-[24px] border-[3px] border-ink p-6 text-left text-white overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#4d2e7b 0%,#d92520 130%)', boxShadow: '8px 8px 0 #14142b' }} {...tiltHandlers(6)}>
      <div className="glare" />
      <Dices size={120} className="absolute -right-5 -bottom-5 opacity-20 group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-500" />
      <span className="font-display text-[11px] tracking-[.18em] font-bold text-accent">НЕ МОЖЕШЬ ВЫБРАТЬ?</span>
      <span className="block font-display font-black text-[24px] leading-tight mt-3">Доверься<br />случаю</span>
      <span className="block text-white/80 font-medium text-[14.5px] mt-2 max-w-[230px]">Нажми — и мы подбросим монетку судьбы. Вдруг это именно твоё?</span>
      <span className="inline-flex items-center gap-1.5 mt-5 font-bold text-[14px] text-accent">Случайное направление <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" /></span>
    </button>
  );
}

function Steps() {
  const steps: { icon: LucideIcon; n: string; t: string; d: string; c: string }[] = [
    { icon: Compass, n: '01', t: 'ВЫБИРАЙ', d: 'Восемь направлений колледжа ЧелГУ — от кода и дронов до права и туризма.', c: '#4d2e7b' },
    { icon: MousePointerClick, n: '02', t: 'ПРОБУЙ', d: 'В каждом направлении — живое задание: нажимай, двигай, экспериментируй.', c: '#d92520' },
    { icon: ListChecks, n: '03', t: 'РЕШАЙ', d: 'Собери все восемь профессий в коллекцию и найди то, что зажигает именно тебя.', c: '#ff9710' },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Reveal>
        <p className="font-display text-[12px] tracking-[.18em] text-hot font-bold mb-3">ВСЁ ПРОСТО</p>
        <h2 className="font-display font-black text-[clamp(26px,4.6vw,44px)] leading-[1.05] m-0">
          ТРИ ШАГА<br />К <span className="grad-word">ТВОЕМУ БУДУЩЕМУ.</span>
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5 mt-9">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative h-full rounded-[24px] bg-white border-[3px] border-ink p-6 overflow-hidden" style={{ boxShadow: `8px 8px 0 ${s.c}` }}>
                <span className="absolute -right-2 -top-5 font-display font-black text-[86px] leading-none opacity-[.09]" style={{ color: s.c }}>{s.n}</span>
                <span className="grid place-items-center w-12 h-12 rounded-xl text-white border-2 border-ink" style={{ background: s.c }}>
                  <Icon size={24} />
                </span>
                <h3 className="font-display font-bold text-[17px] mt-4 mb-1.5">{s.t}</h3>
                <p className="text-mute font-medium text-[14.5px] leading-relaxed m-0">{s.d}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ================= СТРАНИЦА НАПРАВЛЕНИЯ ================= */
function Detail({ spec, isDone, onDone, back, go }: {
  spec: Specialty; isDone: boolean; onDone: (el: HTMLElement | null) => void;
  back: () => void; go: (s: Specialty) => void;
}) {
  const Icon = spec.icon;
  const Scene = SCENES[spec.id];
  const idx = SPECIALTIES.findIndex(s => s.id === spec.id);
  const next = SPECIALTIES[(idx + 1) % SPECIALTIES.length];
  const NextIcon = next.icon;
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
      <div className="slide-l flex flex-wrap items-center gap-4 mb-6">
        <button onClick={back} className="btn-push inline-flex items-center gap-2 rounded-full bg-brand text-white font-bold text-sm px-4 py-2.5 cursor-pointer">
          <ArrowLeft size={16} /> Все направления
        </button>
        <h2 className="flex items-center gap-3 font-display font-black text-[clamp(21px,4vw,32px)] m-0">
          <span className="pop-in grid place-items-center w-12 h-12 rounded-2xl text-white border-[3px] border-ink shadow-[4px_4px_0_rgba(20,20,43,.85)]" style={{ background: spec.color }}>
            <Icon size={25} />
          </span>
          {spec.title}
        </h2>
        {isDone && (
          <span className="win inline-flex items-center gap-1.5 rounded-full bg-[#2f9e44] text-white text-[12.5px] font-bold px-3 py-1.5">
            <Check size={14} strokeWidth={3.5} /> В твоей коллекции
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.35fr] gap-6 items-start">
        <section className="slide-l rounded-[24px] bg-white border-[3px] border-ink p-6 sm:p-7" style={{ boxShadow: `8px 8px 0 ${spec.color}` }}>
          <h3 className="font-display text-[12px] tracking-[.16em] font-bold text-mute mt-0 mb-4">ЧЕМ МЫ ЗАНИМАЕМСЯ</h3>
          <ul className="space-y-3 m-0 p-0 list-none">
            {spec.tasks.map((t, i) => (
              <li key={i} className="flex gap-3 font-medium leading-relaxed" style={{ animation: `slidein-l .5s ${0.25 + i * 0.14}s both` }}>
                <span className="grid place-items-center w-6 h-6 rounded-full text-white shrink-0 mt-0.5" style={{ background: spec.color }}>
                  <Check size={14} strokeWidth={3.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <h3 className="font-display text-[12px] tracking-[.16em] font-bold text-mute mt-7 mb-3">КЕМ МОЖНО РАБОТАТЬ</h3>
          <div className="flex flex-wrap gap-2">
            {spec.jobs.map((j, i) => (
              <span key={j} className="rounded-full text-white text-[13px] font-bold px-3 py-1.5 hover:-translate-y-0.5 hover:-rotate-2 transition-transform cursor-default"
                style={{ background: spec.color, animation: `popin .45s ${0.6 + i * 0.1}s both` }}>{j}</span>
            ))}
          </div>
          <div className="mt-7 rounded-2xl p-4 text-[14px] font-medium leading-relaxed" style={{ background: `color-mix(in srgb, ${spec.color} 10%, #fff)` }}>
            Это лишь начало: в колледже ЧелГУ по этому направлению учат на практике —
            с современным оборудованием, стажировками и настоящими проектами.
          </div>
        </section>

        <section className="slide-r sweep relative overflow-hidden rounded-[24px] bg-white border-[3px] border-ink p-6 sm:p-7" style={{ boxShadow: `8px 8px 0 ${spec.color}` }}>
          <h3 className="font-display text-[12px] tracking-[.16em] font-bold text-mute mt-0 mb-1.5">А ТЕПЕРЬ ПОПРОБУЙ САМ</h3>
          <p className="font-display font-bold text-[19px] m-0">{spec.gameTitle}</p>
          <p className="text-mute font-medium text-[14.5px] mt-1.5 mb-5">{spec.gameHint}</p>
          <Scene color={spec.color} done={isDone} onDone={onDone} />
        </section>
      </div>

      <button onClick={() => go(next)}
        className="group mt-8 w-full flex items-center gap-4 rounded-[24px] border-[3px] border-ink bg-white p-5 text-left cursor-pointer hover:-translate-y-1 transition-transform"
        style={{ boxShadow: `8px 8px 0 ${next.color}` }}>
        <span className="grid place-items-center w-12 h-12 rounded-2xl text-white border-[3px] border-ink shrink-0" style={{ background: next.color }}>
          <NextIcon size={24} />
        </span>
        <span className="leading-tight">
          <span className="block text-[12px] font-display tracking-[.14em] text-mute font-bold">СЛЕДУЮЩЕЕ НАПРАВЛЕНИЕ</span>
          <span className="block font-display font-bold text-[17px] mt-0.5">{next.title}</span>
        </span>
        <ChevronRight size={26} className="ml-auto group-hover:translate-x-2 transition-transform" style={{ color: next.color }} />
      </button>
    </main>
  );
}

/* ================= ПОДВАЛ ================= */
function Footer() {
  return (
    <footer className="mt-6 border-t-[3px] border-ink/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center gap-4">
        <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand text-white -rotate-3"><GraduationCap size={20} /></span>
        <p className="text-mute font-semibold text-sm m-0">
          Колледж ЧелГУ · Нажимай, двигай мышкой или пальцем, пробуй — и находи своё.
        </p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="chip-btn ml-auto rounded-full border-2 border-ink bg-white px-4 py-2 text-[13px] font-bold cursor-pointer">
          Наверх ↑
        </button>
      </div>
    </footer>
  );
}
