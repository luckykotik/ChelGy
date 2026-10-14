import { useMemo, useRef, useState } from 'react';
import {
  Play, RotateCcw, Footprints, Fingerprint, KeyRound, Camera, FileSearch,
  Gavel, Heart, Eye, MousePointerClick, MapPin, Home, Mountain, Umbrella,
  Landmark, TreePine, Check, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Sparkles, Flag, Warehouse, type LucideIcon,
} from 'lucide-react';

export interface SceneProps {
  color: string;
  done: boolean;
  onDone: (el: HTMLElement | null) => void;
}

const chip = (active: boolean) =>
  `chip-btn rounded-full border-2 px-3.5 py-1.5 text-[13px] font-bold cursor-pointer ${
    active ? 'text-white' : 'bg-white/70 hover:-translate-y-0.5'
  }`;
const chipStyle = (active: boolean, color: string) =>
  active ? { background: color, borderColor: color } : { borderColor: color, color };

function DoneBadge({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="win mt-3 flex items-center gap-2 rounded-xl bg-[#e9f9ee] border-2 border-[#2f9e44] px-3.5 py-2.5 text-sm font-bold text-[#1d6b30]">
      <span className="grid place-items-center w-6 h-6 rounded-full bg-[#2f9e44] text-white shrink-0"><Check size={15} strokeWidth={3.5} /></span>
      {text}
    </div>
  );
}

/* ================= 1. ПРОГРАММИРОВАНИЕ ================= */
const IT_COLORS = [
  { name: 'фиолетовый', v: '#4d2e7b' }, { name: 'оранжевый', v: '#ff9710' },
  { name: 'красный', v: '#d92520' }, { name: 'зелёный', v: '#2f9e44' },
];
const IT_ANIMS = [
  { id: '', name: 'нет', code: 'нет' },
  { id: 'anim-bounce', name: 'прыжки', code: 'прыгать' },
  { id: 'anim-spin', name: 'вращение', code: 'вращаться' },
  { id: 'anim-pulse', name: 'пульс', code: 'пульсировать' },
];
export function ItGame({ color, done, onDone }: SceneProps) {
  const [col, setCol] = useState(IT_COLORS[0]);
  const [anim, setAnim] = useState(IT_ANIMS[1]);
  const [run, setRun] = useState(0);
  const [typed, setTyped] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const code = `квадрат {\n  цвет: ${col.name};\n  размер: 64px;\n  анимация: ${anim.code};\n}`;
  const launch = () => {
    setRun(r => r + 1); setTyped(true);
    if (!done && anim.id) onDone(btnRef.current);
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <b className="text-[13px] text-mute mr-1">цвет:</b>
        {IT_COLORS.map(c => (
          <button key={c.v} className={chip(col.v === c.v)} style={chipStyle(col.v === c.v, c.v)} onClick={() => setCol(c)}>{c.name}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <b className="text-[13px] text-mute mr-1">анимация:</b>
        {IT_ANIMS.map(a => (
          <button key={a.name} className={chip(anim.name === a.name)} style={chipStyle(anim.name === a.name, color)} onClick={() => setAnim(a)}>{a.name}</button>
        ))}
      </div>
      <div className="rounded-xl bg-[#14161f] text-[#9ef0b0] font-mono text-[13.5px] leading-relaxed p-3.5 min-h-[104px] whitespace-pre-wrap shadow-inner">
        {code}{typed && <span className="caret text-[#9ef0b0]">▌</span>}
      </div>
      <div className="h-[118px] grid place-items-center mt-2 rounded-xl border-2 border-dashed border-line bg-[repeating-conic-gradient(#e7e2d4_0_25%,transparent_0_50%)] bg-[length:24px_24px] overflow-hidden">
        <div key={run} className={`w-16 h-16 rounded-[14px] shadow-lg ${run ? anim.id : ''}`}
          style={{ background: `linear-gradient(135deg, ${col.v}, ${col.v}bb)` }} />
      </div>
      <button ref={btnRef} onClick={launch}
        className="btn-push mt-3 inline-flex items-center gap-2 rounded-full bg-brand text-white font-bold px-5 py-2.5 text-sm cursor-pointer">
        <Play size={16} /> Запустить код
      </button>
      <DoneBadge show={done} text="Код запущен! Так рождаются сайты, игры и приложения." />
    </div>
  );
}

/* ================= 2. ПРАВООХРАНИТЕЛЬНАЯ ДЕЯТЕЛЬНОСТЬ ================= */
const CLUES: { icon: LucideIcon; name: string; desc: string; x: number; y: number }[] = [
  { icon: Footprints, name: 'след обуви', desc: 'Сфотографируй след с масштабной линейкой и отметь направление движения.', x: 18, y: 74 },
  { icon: Fingerprint, name: 'отпечаток пальца', desc: 'Отпечаток на стекле: обработать порошком и снять на плёнку.', x: 76, y: 30 },
  { icon: KeyRound, name: 'ключ', desc: 'Ключ под ковриком — проверить, от какой двери, и изъять как вещдок.', x: 55, y: 82 },
  { icon: Camera, name: 'камера наблюдения', desc: 'Запросить записи за нужное время у владельца здания.', x: 88, y: 68 },
  { icon: FileSearch, name: 'обрывок документа', desc: 'Обрывок с датой и печатью — аккуратно упаковать в конверт.', x: 36, y: 38 },
];
export function PoGame({ color, done, onDone }: SceneProps) {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [got, setGot] = useState<Set<number>>(new Set());
  const [note, setNote] = useState('');
  const roomRef = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const b = roomRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - b.left, y: e.clientY - b.top });
  };
  const take = (i: number, el: HTMLElement) => {
    if (got.has(i)) { setNote(`«${CLUES[i].name}» уже в карточке — повторно не считаем.`); return; }
    const next = new Set(got); next.add(i); setGot(next);
    setNote(`Зафиксировано: ${CLUES[i].name}.`);
    if (next.size === CLUES.length && !done) onDone(el);
  };
  return (
    <div>
      <div ref={roomRef} onPointerMove={move} onPointerLeave={() => setPos({ x: -300, y: -300 })}
        className="relative h-[290px] rounded-2xl overflow-hidden cursor-crosshair touch-pan-y select-none"
        style={{ background: 'linear-gradient(#8a7a66 0 70%, #5d4d3a 70%)' }}>
        <div className="absolute left-[8%] top-[16%] w-24 h-32 rounded bg-[#6d5b45] border-4 border-[#4c3d2c]" />
        <div className="absolute right-[10%] bottom-[26%] w-36 h-4 rounded bg-[#4c3d2c]" />
        <div className="absolute right-[13%] bottom-[30%] w-28 h-16 rounded-t bg-[#77644c]" />
        {CLUES.map((c, i) => {
          const found = got.has(i); const Icon = c.icon;
          return (
            <button key={i} aria-label={c.name} onClick={e => take(i, e.currentTarget)}
              className={`absolute p-2 rounded-xl cursor-pointer ${found ? 'clue-found bg-white shadow-[0_0_18px_gold] z-20' : 'bg-white/25 z-[1] hover:bg-white/45'}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-50%)', color: found ? color : '#fff' }}>
              <Icon size={26} />
            </button>
          );
        })}
        <div className="absolute inset-0 z-10 pointer-events-none transition-none"
          style={{ background: `radial-gradient(circle 84px at ${pos.x}px ${pos.y}px, transparent 0, transparent 52%, rgba(0,0,0,.94) 100%)` }} />
        <span className="absolute left-3 top-3 z-20 rounded-full bg-black/55 text-white text-xs font-bold px-3 py-1">Улик найдено: {got.size} из {CLUES.length}</span>
      </div>
      <div className="mt-3 rounded-xl bg-white/75 border border-line p-3.5 text-sm min-h-[64px]">
        <b>Карточка осмотра.</b> {note || 'Веди фонарь по комнате и нажимай на улики.'}
        {got.size > 0 && (
          <ol className="list-decimal ml-5 mt-1.5 space-y-1">
            {[...got].map(i => <li key={i}><b>{CLUES[i].name}</b> — {CLUES[i].desc}</li>)}
          </ol>
        )}
        {got.size === CLUES.length && <p className="mt-1.5 font-bold text-[#1d6b30]">Осмотр завершён! Дальше — протокол и передача специалистам.</p>}
      </div>
      <button onClick={() => { setGot(new Set()); setNote('Карточка очищена — осмотр можно начать заново.'); }}
        className="chip-btn mt-2.5 inline-flex items-center gap-1.5 rounded-full border-2 bg-white/70 px-4 py-1.5 text-[13px] font-bold cursor-pointer" style={{ borderColor: color, color }}>
        <RotateCcw size={14} /> Начать осмотр заново
      </button>
      <DoneBadge show={done} text="Все улики зафиксированы — дело можно раскрывать дальше!" />
    </div>
  );
}

/* ================= 3. ЛЕСНОЕ ХОЗЯЙСТВО ================= */
type Species = 'spruce' | 'pine' | 'birch' | 'oak' | 'maple';
const SPECIES: { id: Species | 'rnd'; name: string }[] = [
  { id: 'rnd', name: 'Случайное' }, { id: 'spruce', name: 'Ель' }, { id: 'pine', name: 'Сосна' },
  { id: 'birch', name: 'Берёза' }, { id: 'oak', name: 'Дуб' }, { id: 'maple', name: 'Клён' },
];
const SEASONS = [
  { id: 'sp', name: 'Весна', sky: '#bfe6ff', ground: '#7fd36f' },
  { id: 'su', name: 'Лето', sky: '#8fd3ff', ground: '#52b04a' },
  { id: 'au', name: 'Осень', sky: '#ffd9a8', ground: '#c9a34a' },
  { id: 'wi', name: 'Зима', sky: '#dfe8f2', ground: '#f4f8fb' },
] as const;
const LEAF: Record<string, Record<string, string>> = {
  birch: { sp: '#a5dc6d', su: '#52b04a', au: '#f2c230' },
  oak: { sp: '#6fbf5a', su: '#2d7a35', au: '#c2410c' },
  maple: { sp: '#8bd96b', su: '#3a9d4a', au: '#d92520' },
};
interface Tree { type: Species; x: number; y: number; s: number }
function TreeSvg({ t, season }: { t: Tree; season: string }) {
  const { x, y, s, type } = t;
  if (type === 'spruce' || type === 'pine') {
    const c = type === 'spruce' ? '#22703a' : '#2f9e44';
    return (
      <g className="tree">
        <ellipse cx={x} cy={y} rx={24 * s} ry={5 * s} fill="#0002" />
        <rect x={x - 3.5 * s} y={y - 30 * s} width={7 * s} height={30 * s} fill="#6b4423" />
        {[0, 1, 2].map(i => (
          <polygon key={i} fill={c} points={`${x},${y - (96 - i * 26) * s} ${x - (30 - i * 7) * s},${y - (34 + i * 24) * s} ${x + (30 - i * 7) * s},${y - (34 + i * 24) * s}`} />
        ))}
        {season === 'wi' && <polygon fill="#ffffffcc" points={`${x},${y - 96 * s} ${x - 8 * s},${y - 76 * s} ${x + 8 * s},${y - 76 * s}`} />}
      </g>
    );
  }
  const bare = season === 'wi';
  const fill = LEAF[type][season] || LEAF[type].su;
  const trunk = type === 'birch' ? '#f1efe8' : '#6b4a2b';
  return (
    <g className="tree">
      <ellipse cx={x} cy={y} rx={24 * s} ry={5 * s} fill="#0002" />
      <line x1={x} y1={y - 40 * s} x2={x - 15 * s} y2={y - 62 * s} stroke={trunk} strokeWidth={3.4 * s} strokeLinecap="round" />
      <line x1={x} y1={y - 40 * s} x2={x + 15 * s} y2={y - 62 * s} stroke={trunk} strokeWidth={3.4 * s} strokeLinecap="round" />
      <rect x={x - 3.4 * s} y={y - 58 * s} width={6.8 * s} height={58 * s} fill={trunk} />
      {type === 'birch' && [14, 28, 42].map(h => <rect key={h} x={x - 3.4 * s} y={y - h * s} width={4 * s} height={2.2 * s} fill="#333" />)}
      {!bare && [[0, -78, 21], [-17, -62, 15], [17, -62, 15], [0, -58, 13]].map(([dx, dy, r], i) => (
        <circle key={i} cx={x + dx * s} cy={y + dy * s} r={r * s} fill={fill} />
      ))}
    </g>
  );
}
const MAXT = 12;
export function FoGame({ color, done, onDone }: SceneProps) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [sel, setSel] = useState<Species | 'rnd'>('rnd');
  const [season, setSeason] = useState<(typeof SEASONS)[number]>(SEASONS[0]);
  const svgRef = useRef<SVGSVGElement>(null);
  const plant = (e: React.MouseEvent<SVGSVGElement>) => {
    if (trees.length >= MAXT) return;
    const r = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 600;
    const y = ((e.clientY - r.top) / r.height) * 300;
    if (y < 190) return;
    const types: Species[] = ['spruce', 'pine', 'birch', 'oak', 'maple'];
    const type = sel === 'rnd' ? types[Math.floor(Math.random() * types.length)] : sel;
    const next = [...trees, { type, x, y: Math.min(292, Math.max(225, y)), s: 0.75 + Math.random() * 0.55 }];
    setTrees(next);
    if (next.length >= 6 && !done) onDone(svgRef.current as unknown as HTMLElement);
  };
  const conifers = trees.filter(t => t.type === 'spruce' || t.type === 'pine').length;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <b className="text-[13px] text-mute mr-1">дерево:</b>
        {SPECIES.map(s => (
          <button key={s.id} className={chip(sel === s.id)} style={chipStyle(sel === s.id, color)} onClick={() => setSel(s.id)}>{s.name}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <b className="text-[13px] text-mute mr-1">сезон:</b>
        {SEASONS.map(s => (
          <button key={s.id} className={chip(season.id === s.id)} style={chipStyle(season.id === s.id, color)} onClick={() => setSeason(s)}>{s.name}</button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden border-2 border-ink/10">
        <svg ref={svgRef} viewBox="0 0 600 300" className="block w-full cursor-pointer" onClick={plant} role="img" aria-label="Участок леса">
          <rect width="600" height="300" fill={season.sky} style={{ transition: 'fill .6s' }} />
          <circle cx="505" cy="52" r="27" fill={season.id === 'wi' ? '#e8eef5' : '#ffd43b'} style={{ transition: 'fill .6s' }} />
          <rect y="212" width="600" height="88" fill={season.ground} style={{ transition: 'fill .6s' }} />
          {trees.map((t, i) => <TreeSvg key={i} t={t} season={season.id} />)}
          {trees.length === 0 && <text x="300" y="262" textAnchor="middle" fontSize="17" fontWeight="700" fill="#14142b88">Нажимай на землю — сажай деревья</text>}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <span className="text-sm font-semibold flex-1 min-w-[210px]">
          Посажено: <b>{trees.length} из {MAXT}</b> · хвойных: {conifers} · лиственных: {trees.length - conifers}
          <span className="block text-mute font-medium text-[13px] mt-0.5">
            {trees.length >= 3 ? 'Хороший состав! В настоящем лесу ещё учитывают почву, влажность и местные породы.' : 'Добавь ещё деревьев разных пород — смешанный лес устойчивее.'}
          </span>
        </span>
        <button onClick={() => setTrees([])} className="chip-btn inline-flex items-center gap-1.5 rounded-full border-2 bg-white/70 px-4 py-1.5 text-[13px] font-bold cursor-pointer" style={{ borderColor: color, color }}>
          <RotateCcw size={14} /> Расчистить участок
        </button>
      </div>
      <DoneBadge show={done} text="Участок засажен! Через годы здесь зашумит настоящий лес." />
    </div>
  );
}

/* ================= 4. ЮРИСПРУДЕНЦИЯ ================= */
const CASES = [
  {
    q: 'Сосед каждую ночь в 2 часа включает музыку на полную громкость, и весь подъезд не спит. Что делать по закону?',
    opts: ['Терпеть — это его квартира', 'Нарушены правила тишины: можно обратиться к участковому', 'Это кража — сразу уголовная статья'],
    right: 1, why: 'Верно! Ночной шум нарушает правила тишины и закон о санитарно-эпидемиологическом благополучии. Участковый составит протокол.',
  },
  {
    q: 'В магазине на полке стоит йогурт, срок годности которого истёк вчера. Что вправе сделать покупатель?',
    opts: ['Тихо уйти и ничего не трогать', 'Забрать йогурт бесплатно — «сам виноват магазин»', 'Потребовать убрать товар с продажи и сообщить администратору'],
    right: 2, why: 'Точно! Продажа просроченных продуктов запрещена. Можно также оставить запись в книге жалоб и обратиться в Роспотребнадзор.',
  },
  {
    q: 'Тебе 15 лет. Знакомый предлагает 5 000 ₽ за то, чтобы ты оформил банковскую карту и передал её «для переводов». Твои действия?',
    opts: ['Отказаться: передача карты для чужих операций — участие в мошенничестве', 'Согласиться — карта же просто пластик', 'Согласиться, но только один раз'],
    right: 0, why: 'Правильно! Такие карты используют для обналичивания краденых денег, а отвечает перед законом владелец карты. Отказ — единственное верное решение.',
  },
];
export function LawGame({ color, done, onDone }: SceneProps) {
  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState<boolean[]>(CASES.map(() => false));
  const [wrong, setWrong] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>(['Заседание открыто. Слушается дело № 1.']);
  const [shake, setShake] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const total = solved.filter(Boolean).length;
  const pick = (o: number) => {
    if (solved[idx]) return;
    if (o === CASES[idx].right) {
      const s = [...solved]; s[idx] = true; setSolved(s); setWrong(null);
      setShake(k => k + 1);
      setLog(l => [`По делу № ${idx + 1} вынесено справедливое решение.`, ...l]);
      if (s.every(Boolean) && !done) setTimeout(() => onDone(nextRef.current), 60);
    } else {
      setWrong(o);
      setLog(l => [`По делу № ${idx + 1}: довод отклонён. Подумай ещё — проверь факты и нормы.`, ...l]);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span key={shake} className={`grid place-items-center w-11 h-11 rounded-xl text-white ${shake ? 'shake' : ''}`} style={{ background: color }}>
          <Gavel size={22} />
        </span>
        <div className="text-sm">
          <b>Дело № {Math.min(idx + 1, CASES.length)} из {CASES.length}</b>
          <span className="block text-mute">Решено дел: {total} · выбери верное решение суда</span>
        </div>
        <div className="ml-auto flex gap-1.5">
          {CASES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Дело ${i + 1}`}
              className="w-8 h-8 rounded-full border-2 font-bold text-[13px] cursor-pointer chip-btn"
              style={solved[i]
                ? { background: '#2f9e44', borderColor: '#2f9e44', color: '#fff' }
                : i === idx ? { background: color, borderColor: color, color: '#fff' } : { borderColor: color, color }}>
              {solved[i] ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </div>
      <p className="font-semibold leading-snug mb-3">{CASES[idx].q}</p>
      <div className="space-y-2">
        {CASES[idx].opts.map((o, i) => {
          const isRight = solved[idx] && i === CASES[idx].right;
          const isWrong = wrong === i;
          return (
            <button key={i} onClick={() => pick(i)}
              className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 ${isWrong ? 'shake' : ''}`}
              style={isRight
                ? { background: '#e9f9ee', borderColor: '#2f9e44', color: '#1d6b30' }
                : isWrong ? { background: '#ffe9e8', borderColor: '#d92520', color: '#8f1712' } : { borderColor: '#dcd8cc', background: '#fff' }}>
              {o} {isRight && <Check className="inline ml-1" size={16} />} {isWrong && <X className="inline ml-1" size={16} />}
            </button>
          );
        })}
      </div>
      <div className={`mt-3 text-[15px] font-bold min-h-[26px] ${solved[idx] ? 'win text-[#1d6b30]' : ''}`}>
        {solved[idx] ? `Вердикт: ${CASES[idx].why}` : wrong !== null ? 'Суд отклоняет этот довод. Попробуй ещё раз!' : ''}
      </div>
      {solved[idx] && idx < CASES.length - 1 && (
        <button ref={nextRef} onClick={() => { setIdx(idx + 1); setWrong(null); }}
          className="btn-push mt-1 rounded-full text-white font-bold px-5 py-2 text-sm cursor-pointer" style={{ background: color }}>
          Следующее дело →
        </button>
      )}
      <div className="mt-3 rounded-xl bg-[#14161f] text-[#c9d4ff] font-mono text-[12.5px] p-3 min-h-[58px] space-y-1">
        {log.slice(0, 3).map((l, i) => <div key={i} style={{ opacity: 1 - i * 0.3 }}>{l}</div>)}
      </div>
      <DoneBadge show={done} text="Все дела решены справедливо. Из тебя получится отличный юрист!" />
    </div>
  );
}

/* ================= 5. ЛОГИСТИКА ================= */
interface City { name: string; x: number; y: number }
const CITIES: City[] = [
  { name: 'Северный', x: 205, y: 78 }, { name: 'Речной', x: 330, y: 205 },
  { name: 'Горный', x: 468, y: 88 }, { name: 'Южный', x: 520, y: 272 },
];
const DEPOT = { x: 72, y: 185 };
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 1.6);
function optimalKm() {
  const idx = [0, 1, 2, 3]; let best = Infinity;
  const perm = (arr: number[], m: number[] = []) => {
    if (!arr.length) {
      let d = 0; let prev = DEPOT;
      m.forEach(i => { d += dist(prev, CITIES[i]); prev = CITIES[i]; });
      best = Math.min(best, d); return;
    }
    arr.forEach((v, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)], [...m, v]));
  };
  perm(idx); return best;
}
export function LoGame({ color, done, onDone }: SceneProps) {
  const [route, setRoute] = useState<number[]>([]);
  const best = useMemo(optimalKm, []);
  const km = useMemo(() => {
    let d = 0; let prev = DEPOT;
    route.forEach(i => { d += dist(prev, CITIES[i]); prev = CITIES[i]; });
    return d;
  }, [route]);
  const add = (i: number, el: HTMLElement) => {
    if (route.includes(i)) return;
    const next = [...route, i]; setRoute(next);
    if (next.length === CITIES.length && !done) onDone(el);
  };
  const pts = [DEPOT, ...route.map(i => CITIES[i])].map(p => `${p.x},${p.y}`).join(' ');
  const rating = route.length === CITIES.length
    ? km <= best * 1.03 ? 'Идеальный маршрут — как у профи!' : km <= best * 1.35 ? 'Хороший маршрут, но есть короче. Попробуй другой порядок!' : 'Маршрут длинноват: логист ищет путь покороче.'
    : 'Нажимай на города — фура поедет по маршруту.';
  return (
    <div>
      <div className="rounded-2xl overflow-hidden border-2 border-ink/10" style={{ background: `color-mix(in srgb, ${color} 8%, #fff)` }}>
        <svg viewBox="0 0 600 360" className="block w-full">
          <path d="M0 120 C150 90 240 160 380 130 S560 170 600 150" stroke="#b8c7de" strokeWidth="16" fill="none" opacity=".55" />
          <path d="M60 360 C140 260 300 300 420 220" stroke="#cfe3c0" strokeWidth="20" fill="none" opacity=".7" />
          {route.length > 0 && <polyline points={pts} fill="none" stroke={color} strokeWidth="4" strokeDasharray="10 7" strokeLinecap="round" />}
          <g>
            <circle cx={DEPOT.x} cy={DEPOT.y} r="17" fill="#14142b" />
            <Warehouse x={DEPOT.x - 10} y={DEPOT.y - 10} width="20" height="20" color="#fff" />
            <text x={DEPOT.x} y={DEPOT.y + 34} textAnchor="middle" fontSize="13" fontWeight="800">Склад</text>
          </g>
          {CITIES.map((c, i) => {
            const n = route.indexOf(i);
            return (
              <g key={c.name} onClick={e => add(i, e.currentTarget as unknown as HTMLElement)} className="cursor-pointer" style={{ pointerEvents: 'all' }}>
                <circle cx={c.x} cy={c.y} r="26" fill="transparent" />
                <circle cx={c.x} cy={c.y} r="15" fill={n >= 0 ? color : '#fff'} stroke={color} strokeWidth="3.5" style={{ transition: 'all .25s' }} />
                <text x={c.x} y={c.y + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill={n >= 0 ? '#fff' : color}>{n >= 0 ? n + 1 : ''}</text>
                <text x={c.x} y={c.y + 36} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#14142b">{c.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm">
        <span>Доставлено: <b>{route.length} из {CITIES.length}</b></span>
        <span>Путь фуры: <b>{km} км</b></span>
        <span className="text-mute">лучший возможный: {best} км</span>
        <button onClick={() => setRoute([])} className="chip-btn ml-auto inline-flex items-center gap-1.5 rounded-full border-2 bg-white/70 px-4 py-1.5 text-[13px] font-bold cursor-pointer" style={{ borderColor: color, color }}>
          <RotateCcw size={14} /> Сбросить маршрут
        </button>
      </div>
      <p className={`mt-2 font-semibold text-sm ${route.length === CITIES.length ? 'win' : 'text-mute'}`}>{rating}</p>
      <DoneBadge show={done} text="Все грузы доставлены! Логистика — это математика в движении." />
    </div>
  );
}

/* ================= 6. РЕКЛАМА ================= */
const AD_STYLES = [
  { id: 'a', name: 'Яркий', cls: 'text-white', style: { background: 'linear-gradient(135deg,#d92520,#ff9710)' } as React.CSSProperties, cta: 'bg-white text-[#d92520]' },
  { id: 'b', name: 'Минимализм', cls: 'text-[#222]', style: { background: '#f4f4f0' } as React.CSSProperties, cta: 'bg-[#14142b] text-white' },
  { id: 'c', name: 'Неон', cls: 'text-white', style: { background: '#0b0b1a', boxShadow: 'inset 0 0 46px #7b2ff7', textShadow: '0 0 12px #0ff' } as React.CSSProperties, cta: 'bg-[#0ff] text-[#0b0b1a]' },
];
export function AdGame({ color, done, onDone }: SceneProps) {
  const [st, setSt] = useState(AD_STYLES[0]);
  const [slogan, setSlogan] = useState('Учись ярко — поступай в ЧелГУ!');
  const [likes, setLikes] = useState(128);
  const [hearts, setHearts] = useState<number[]>([]);
  const [views] = useState(4210);
  const likeRef = useRef<HTMLButtonElement>(null);
  const like = () => {
    setLikes(l => l + 1);
    const id = Date.now() + Math.random();
    setHearts(h => [...h, id]);
    setTimeout(() => setHearts(h => h.filter(x => x !== id)), 1900);
    if (likes + 1 >= 133 && !done) onDone(likeRef.current);
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <b className="text-[13px] text-mute mr-1">стиль баннера:</b>
        {AD_STYLES.map(s => (
          <button key={s.id} className={chip(st.id === s.id)} style={chipStyle(st.id === s.id, color)} onClick={() => setSt(s)}>{s.name}</button>
        ))}
      </div>
      <div className={`relative overflow-hidden rounded-2xl min-h-[190px] flex flex-col items-center justify-center gap-2 text-center p-6 transition-all duration-500 ${st.cls}`} style={st.style}>
        <span className="anim-bounce grid place-items-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm">
          <Sparkles size={30} />
        </span>
        <h3 className="font-display font-bold text-[22px] leading-tight m-0">Колледж ЧелГУ</h3>
        <p className="m-0 font-semibold opacity-90 max-w-[340px]">{slogan || 'Придумай слоган ниже!'}</p>
        <span className={`rounded-full px-4 py-1.5 font-bold text-sm ${st.cta}`}>Поступай сейчас</span>
        {hearts.map(id => (
          <Heart key={id} className="heart text-[#ff4d6d]" fill="#ff4d6d" size={24} style={{ left: `${18 + (id % 60)}%` }} />
        ))}
      </div>
      <input value={slogan} onChange={e => setSlogan(e.target.value)} maxLength={60} placeholder="Твой слоган…"
        className="mt-3 w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-[15px] font-semibold outline-none focus:border-brand transition-colors" />
      <div className="flex items-center gap-5 mt-3">
        <button ref={likeRef} onClick={like}
          className="btn-push inline-flex items-center gap-2 rounded-full bg-hot text-white font-bold px-5 py-2.5 text-sm cursor-pointer">
          <Heart size={16} fill="currentColor" /> Лайк
        </button>
        <div className="flex gap-5 text-center">
          {[[Eye, views.toLocaleString('ru-RU'), 'просмотры'], [MousePointerClick, Math.round(likes * 2.7).toLocaleString('ru-RU'), 'клики'], [Heart, likes.toLocaleString('ru-RU'), 'лайки']].map(([Icon, v, l]) => {
            const I = Icon as LucideIcon;
            return (
              <div key={l as string} className="font-display font-bold text-[17px] leading-none">
                <span className="flex items-center gap-1 justify-center"><I size={15} className="text-mute" />{v as string}</span>
                <span className="block text-[11px] font-body font-semibold text-mute mt-1">{l as string}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[13px] text-mute mt-2">Собери 5 лайков — проверь, как откликается аудитория. Уже: {Math.max(0, likes - 128)} из 5.</p>
      <DoneBadge show={done} text="Аудитория в восторге! Охват растёт — кампания удалась." />
    </div>
  );
}

/* ================= 7. ТУРИЗМ ================= */
const DESTS: { icon: LucideIcon; name: string; x: number; y: number; desc: string }[] = [
  { icon: Home, name: 'Наш город', x: 70, y: 215, desc: 'Точка старта! Здесь менеджер по туризму составляет программу и бронирует всё необходимое.' },
  { icon: Mountain, name: 'Горы', x: 200, y: 70, desc: 'Турагент подбирает тур, снаряжение и страховку, а гид ведёт группу по тропам.' },
  { icon: Umbrella, name: 'Море', x: 420, y: 60, desc: 'Менеджер бронирует отель и перелёт, а администратор отеля встречает гостей с ключом и улыбкой.' },
  { icon: Landmark, name: 'Город-музей', x: 510, y: 200, desc: 'Экскурсовод рассказывает историю, организатор планирует маршрут, билеты и обеды.' },
  { icon: TreePine, name: 'Эко-тропа', x: 320, y: 225, desc: 'Специалист по туризму создаёт безопасные маршруты и бережёт природу.' },
];
export function TuGame({ color, done, onDone }: SceneProps) {
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [cur, setCur] = useState<number | null>(null);
  const visit = (i: number, el: HTMLElement) => {
    setCur(i);
    const next = new Set(seen); next.add(i); setSeen(next);
    if (next.size >= 4 && !done) onDone(el);
  };
  return (
    <div>
      <div className="rounded-2xl overflow-hidden border-2 border-ink/10" style={{ background: `color-mix(in srgb, ${color} 7%, #fff)` }}>
        <svg viewBox="0 0 600 300" className="block w-full">
          <path d="M70 215 C160 160 160 110 200 70 S360 40 420 60 S500 150 510 200" stroke={color} strokeWidth="3.5" strokeDasharray="9 8" fill="none" opacity=".55" />
          <path d="M200 70 C260 140 280 180 320 225" stroke={color} strokeWidth="3.5" strokeDasharray="9 8" fill="none" opacity=".35" />
          {DESTS.map((d, i) => {
            const Icon = d.icon; const active = cur === i; const visited = seen.has(i);
            return (
              <g key={d.name} transform={`translate(${d.x} ${d.y})`} className="cursor-pointer"
                onClick={e => visit(i, e.currentTarget as unknown as HTMLElement)}>
                <circle r="24" fill="transparent" />
                <g className={active ? 'pop-in' : ''}>
                  <circle r="16" fill={visited || active ? color : '#fff'} stroke={color} strokeWidth="3" />
                  <foreignObject x="-11" y="-11" width="22" height="22">
                    <div className="grid place-items-center w-full h-full" style={{ color: visited || active ? '#fff' : color }}>
                      <Icon size={17} />
                    </div>
                  </foreignObject>
                </g>
                <text y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill="#14142b">{d.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="card mt-3 rounded-xl bg-white/80 border border-line p-4 text-sm min-h-[72px]">
        {cur === null
          ? <span className="text-mute">Нажимай на точки маршрута — и узнаешь, кто работает в каждом месте. Изучено мест: <b className="text-ink">{seen.size} из {DESTS.length}</b></span>
          : <><b className="flex items-center gap-1.5 text-[15px]"><MapPin size={16} style={{ color }} />{DESTS[cur].name}</b><span className="block mt-1">{DESTS[cur].desc}</span>
            <span className="block mt-1 text-mute">Изучено мест: {seen.size} из {DESTS.length}</span></>}
      </div>
      <DoneBadge show={done} text="Маршрут построен! Гости довольны, тур удался." />
    </div>
  );
}

/* ================= 8. БЕСПИЛОТНЫЕ СИСТЕМЫ ================= */
const TARGETS = [
  { x: 22, y: 30, name: 'Мост через реку' }, { x: 72, y: 22, name: 'Солнечная ферма' }, { x: 55, y: 68, name: 'Лесной массив' },
];
export function DrGame({ color, done, onDone }: SceneProps) {
  const [pos, setPos] = useState({ x: 12, y: 82 });
  const [shots, setShots] = useState<Set<number>>(new Set());
  const [flash, setFlash] = useState(0);
  const [msg, setMsg] = useState('Дрон на старте. Лети к отмеченным точкам и жми «Сфотографировать».');
  const fieldRef = useRef<HTMLDivElement>(null);
  const fly = (x: number, y: number) => setPos({ x: Math.min(94, Math.max(6, x)), y: Math.min(90, Math.max(10, y)) });
  const shoot = (el: HTMLElement | null) => {
    const i = TARGETS.findIndex((t, j) => !shots.has(j) && Math.hypot(t.x - pos.x, t.y - pos.y) < 13);
    if (i < 0) { setMsg('Мимо! Подлети ближе к отмеченной точке.'); return; }
    const next = new Set(shots); next.add(i); setShots(next);
    setFlash(f => f + 1);
    setMsg(`Снимок готов: «${TARGETS[i].name}». Осталось точек: ${TARGETS.length - next.size}.`);
    if (next.size === TARGETS.length && !done) onDone(el);
  };
  return (
    <div>
      <div ref={fieldRef} tabIndex={0} aria-label="Поле полёта дрона"
        onKeyDown={e => {
          const step = 9;
          if (e.key === 'ArrowUp') { fly(pos.x, pos.y - step); e.preventDefault(); }
          if (e.key === 'ArrowDown') { fly(pos.x, pos.y + step); e.preventDefault(); }
          if (e.key === 'ArrowLeft') { fly(pos.x - step, pos.y); e.preventDefault(); }
          if (e.key === 'ArrowRight') { fly(pos.x + step, pos.y); e.preventDefault(); }
        }}
        onClick={e => {
          const r = fieldRef.current!.getBoundingClientRect();
          fly(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
        }}
        className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer outline-none focus:ring-4 ring-brand/30 select-none"
        style={{ background: 'linear-gradient(#a8d8ff 0 55%, #8fce7a 55% 100%)' }}>
        <div className="absolute inset-x-0 top-[55%] h-px bg-white/50" />
        {TARGETS.map((t, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <span className={`grid place-items-center w-10 h-10 mx-auto rounded-full border-[3px] font-black text-sm ${shots.has(i) ? 'bg-[#2f9e44] border-white text-white' : 'bg-white/85 text-ink animate-pulse'}`}
              style={{ borderColor: shots.has(i) ? '#fff' : color }}>
              {shots.has(i) ? <Check size={18} strokeWidth={3.5} /> : <Flag size={17} style={{ color }} />}
            </span>
            <span className="block mt-1 text-[11px] font-bold bg-black/45 text-white rounded-full px-2 py-0.5 whitespace-nowrap">{t.name}</span>
          </div>
        ))}
        <div className="absolute z-10 pointer-events-none" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transition: 'left 1s cubic-bezier(.3,.8,.3,1), top 1s cubic-bezier(.3,.8,.3,1)', animation: 'dronehover 2.6s ease-in-out infinite' }}>
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-ink text-white shadow-[0_14px_24px_rgba(20,20,43,.4)] border-2 border-white/70">
            <Camera size={24} />
          </span>
          <span className="absolute -inset-2 rounded-[20px] border-2 border-dashed border-white/60 -z-10" />
        </div>
        {flash > 0 && <div key={flash} className="absolute inset-0 bg-white pointer-events-none" style={{ animation: 'winpop .45s ease-out reverse' }} />}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 text-white text-xs font-bold px-3 py-1">Снимков: {shots.size} из {TARGETS.length}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <div className="grid grid-cols-3 gap-1 w-[118px]">
          <span /> <button aria-label="Вверх" onClick={() => fly(pos.x, pos.y - 11)} className="chip-btn grid place-items-center h-9 rounded-lg border-2 bg-white cursor-pointer" style={{ borderColor: color, color }}><ChevronUp size={18} /></button> <span />
          <button aria-label="Влево" onClick={() => fly(pos.x - 11, pos.y)} className="chip-btn grid place-items-center h-9 rounded-lg border-2 bg-white cursor-pointer" style={{ borderColor: color, color }}><ChevronLeft size={18} /></button>
          <button aria-label="Вниз" onClick={() => fly(pos.x, pos.y + 11)} className="chip-btn grid place-items-center h-9 rounded-lg border-2 bg-white cursor-pointer" style={{ borderColor: color, color }}><ChevronDown size={18} /></button>
          <button aria-label="Вправо" onClick={() => fly(pos.x + 11, pos.y)} className="chip-btn grid place-items-center h-9 rounded-lg border-2 bg-white cursor-pointer" style={{ borderColor: color, color }}><ChevronRight size={18} /></button>
        </div>
        <button onClick={e => shoot(e.currentTarget)}
          className="btn-push inline-flex items-center gap-2 rounded-full text-white font-bold px-5 py-2.5 text-sm cursor-pointer ml-1" style={{ background: color }}>
          <Camera size={16} /> Сфотографировать
        </button>
        <p className="text-sm font-medium flex-1 min-w-[220px]">{msg}</p>
      </div>
      <DoneBadge show={done} text="Все точки отсняты! Материал готов для карты и отчёта." />
    </div>
  );
}
