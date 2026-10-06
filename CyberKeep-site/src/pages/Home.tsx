import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, Search, Sparkles, Terminal, Wrench } from 'lucide-react';
import { Badge, BookmarkBtn, Btn, Card, CardsGrid, Empty, SectionTitle, inputCls } from '../components/ui';
import { useStore, makeCommands, makeLabs, makeTools } from '../lib/store';
import { useEffect, useMemo, useState } from 'react';

const MODULES = [
  { icon: <Terminal size={20} />, to: '/commands', title: 'Commands', desc: 'Ten essential system commands with copyable syntax and practical examples.' },
  { icon: <Wrench size={20} />, to: '/tools', title: 'Tools', desc: 'Ten professional auditing tools for learning inside authorized lab scopes.' },
  { icon: <FlaskConical size={20} />, to: '/labs', title: 'Labs', desc: 'Hands-on lab environments with guided scenarios.' },
  { icon: <Sparkles size={20} />, to: '/settings', title: 'Settings', desc: 'Live interface controls — theme, accent, density, 3D, motion and RTL.' },
];

/* ---- global search section (lives on home) ---- */
function HomeSearch() {
  const { t } = useStore();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'all' | 'commands' | 'tools' | 'labs'>('all');
  const data = useMemo(() => [...makeCommands().map(i => ({ ...i, kind: 'command' as const })), ...makeTools().map(i => ({ ...i, kind: 'tool' as const }))], []);
  const res = data.filter(i => (tab === 'all' || (tab === 'commands' && i.kind === 'command') || (tab === 'tools' && i.kind === 'tool')) && (q === '' || (i.name + i.desc).toLowerCase().includes(q.toLowerCase())));
  return (
    <section className="mb-16">
      <SectionTitle kicker="discovery" title="Global Search" desc="Unified search UI across commands, tools and labs. Results are placeholder entries — no real index in this phase." />
      <Card hover={false} className="mb-4">
        <div className="relative">
          <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('Search everything…')} className={inputCls + ' ps-10'} aria-label={t('Global Search')} />
        </div>
        <div className="flex gap-2 mt-3">{(['all', 'commands', 'tools', 'labs'] as const).map(tb => (
          <motion.button whileTap={{ scale: .92 }} key={tb} onClick={() => setTab(tb)} className={`px-3.5 py-1.5 rounded-full text-xs border cursor-pointer transition-all hover:-translate-y-px ${tab === tb ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200 shadow-[0_0_16px_-6px_rgba(34,211,238,.7)]' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>{t(tb)}</motion.button>))}</div>
      </Card>
      {q === '' ? (
        <CardsGrid cols="sm:grid-cols-3" className="stagger">
          {[t('Recent searches'), t('Suggested filters'), t('Saved searches')].map(title => (
            <Card key={title}><div className="text-sm font-medium mb-1">{title}</div><p className="text-xs text-slate-500">{t('Your recent activity will appear here.')}</p></Card>))}
        </CardsGrid>
      ) : res.length === 0 ? (
        <Empty title={`${t('No results for')} “${q}”`} desc="Try a different term or clear the tab filter." />
      ) : (
        <div className="space-y-2 stagger">{res.slice(0, 8).map(r => (
          <div key={r.id} className="glass rounded-xl px-4 py-3 flex items-center gap-3 hover:border-cyan-400/30 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all">
            <Badge>{t(r.kind)}</Badge><span className="text-sm font-mono2 flex-1">{r.name}</span><BookmarkBtn id={r.id} />
          </div>))}</div>
      )}
    </section>
  );
}

/* terminal-style rotating tagline */
function Typewriter() {
  const { t, settings, accent } = useStore();
  const words = [t('explore.'), t('practice.'), t('master.')];
  const [wi, setWi] = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel] = useState(false);
  const calm = settings.reduceMotion || !settings.animations;
  useEffect(() => {
    if (calm) { setChars(words[0].length); return; }
    const word = words[wi % words.length];
    let extra: ReturnType<typeof setTimeout> | undefined;
    const id = setTimeout(() => {
      if (!del && chars < word.length) setChars(chars + 1);
      else if (!del) extra = setTimeout(() => setDel(true), 1200);
      else if (chars > 0) setChars(chars - 1);
      else { setDel(false); setWi((w) => (w + 1) % words.length); }
    }, del ? 32 : 70);
    return () => { clearTimeout(id); if (extra) clearTimeout(extra); };
  });
  const word = words[wi % words.length] || '';
  return (
    <div className="font-mono2 text-sm md:text-base mt-4 h-6 tracking-wide" dir="ltr" aria-live="off">
      <span className="font-bold" style={{ color: accent.a }}>❯&nbsp;</span>
      <span className="text-slate-300">{word.slice(0, chars)}</span>
      <span className="blink" style={{ color: accent.a }}>▊</span>
    </div>
  );
}

export default function Home() {
  const { accent, push, t } = useStore();
  const [demo] = useState({ cmds: makeCommands().slice(0, 3), tools: makeTools().slice(0, 3), labs: makeLabs(3) });

  return (
    <div>
      {/* HERO — floats over the global 3D background */}
      <section className="relative max-w-3xl mx-auto text-center pt-8 md:pt-14 pb-12 mb-8 px-6">
        <span className="hud hud-tl" aria-hidden />
        <span className="hud hud-tr" aria-hidden />
        <span className="hud hud-bl" aria-hidden />
        <span className="hud hud-br" aria-hidden />
        <span className="scanline" aria-hidden />
        <div className="anim-rise flex flex-col items-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mt-2 leading-[1.05]" dir="ltr" aria-label="CyberKeep">
            <span className="hero-gradient" style={{ backgroundImage: `linear-gradient(120deg, ${accent.a}, ${accent.b}, ${accent.a})` }}>
              {'CyberKeep'.split('').map((ch, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: .25 + i * .055, duration: .55, ease: [0.22, 1, 0.36, 1] }} className="inline-block">{ch}</motion.span>
              ))}
            </span>
          </h1>
          <Typewriter />
          <p className="text-slate-400 mt-5 max-w-xl text-sm md:text-base leading-relaxed anim-rise" style={{ animationDelay: '.5s' }}>
            {t('Interactive Arabic platform for learning cybersecurity — explore tools, learn Linux commands, and practice in hands-on labs.')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Btn size="lg" to="/labs">{t('Explore labs')} <ArrowRight size={16} className="rtl:rotate-180" /></Btn>
            <Btn size="lg" variant="outline" to="/commands">{t('Browse commands')}</Btn>
          </div>
        </div>
      </section>

      {/* counts pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16 anim-rise">
        {[
          { v: String(makeCommands().length), l: t('Basic commands') },
          { v: String(makeTools().length), l: t('Auditing tools') },
          { v: t('soon'), l: t('Labs') },
        ].map(({ v, l }) => (
          <div key={l} className="glass rounded-full ps-2 pe-5 py-2 flex items-center gap-3 card-hover cursor-default">
            <span className="min-w-8 h-8 px-2 rounded-full grid place-items-center font-display text-sm font-bold text-[#04121a]" style={{ background: `linear-gradient(135deg, ${accent.a}, ${accent.b})` }}>{v}</span>
            <span className="text-sm text-slate-300">{l}</span>
          </div>
        ))}
      </div>

      {/* search */}
      <div className="anim-rise"><HomeSearch /></div>

      {/* modules */}
      <SectionTitle kicker="Platform" title="Modules" desc="Browse the platform areas — commands, tools, labs and settings." />
      <CardsGrid cols="sm:grid-cols-2 lg:grid-cols-3" className="mb-16 stagger">
        {MODULES.map(m => (
          <Link key={m.to} to={m.to}>
            <Card>
              <div className="icon-wiggle w-11 h-11 rounded-xl items-center justify-center mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-6" style={{ background: accent.soft, color: accent.a }}>{m.icon}</div>
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">{t(m.title)} <ArrowRight size={15} className="rtl:rotate-180" /></h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{t(m.desc)}</p>
              {m.to === '/labs' && <div className="mt-3"><Badge tone="warn">Under development</Badge></div>}
              <span className="inline-flex items-center gap-1.5 text-xs mt-4 font-medium" style={{ color: accent.a }}>{t('Open module')} <ArrowRight size={13} className="rtl:rotate-180" /></span>
            </Card>
          </Link>
        ))}
      </CardsGrid>

      {/* previews */}
      <SectionTitle kicker="Preview" title="Interface snapshots" desc="A look at each section of the platform." right={<button onClick={() => push({ title: 'Preview refreshed', kind: 'info' })} className="text-xs underline underline-offset-4 text-slate-400 hover:text-white hover:scale-105 transition cursor-pointer">{t('Refresh')}</button>} />
      <CardsGrid cols="lg:grid-cols-3" className="mb-16 stagger">
        <Card>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('Commands · preview')}</div>
          <div className="space-y-2">{demo.cmds.map(c => (
            <div key={c.id} className="row-hover rounded-xl border border-white/10 bg-white/[.03] p-3 flex items-center justify-between gap-2 hover:border-white/25 hover:bg-white/[.05] transition-all">
              <div><div className="text-sm font-medium font-mono2">{c.name.replace('Command placeholder', t('Command placeholder'))}</div><div className="text-[11px] text-slate-500">{t(c.category)} · {t(c.level || '')}</div></div>
              <Badge>{c.category}</Badge>
            </div>))}</div>
          <Link to="/commands" className="text-xs mt-4 inline-flex items-center gap-1 hover:underline hover:gap-2 transition-all" style={{ color: accent.a }}>{t('Open full library')} <ArrowRight size={12} className="rtl:rotate-180" /></Link>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('Tools · preview')}</div>
          <div className="space-y-2">{demo.tools.map(c => (
            <div key={c.id} className="row-hover rounded-xl border border-white/10 bg-white/[.03] p-3 flex items-center justify-between gap-2 hover:border-white/25 hover:bg-white/[.05] transition-all">
              <div><div className="text-sm font-medium">{c.name}</div><div className="text-[11px] text-slate-500">{t(c.category)}</div></div>
              <Badge tone="accent">{t(c.level || '')}</Badge>
            </div>))}</div>
          <Link to="/tools" className="text-xs mt-4 inline-flex items-center gap-1 hover:underline hover:gap-2 transition-all" style={{ color: accent.a }}>{t('Open catalog')} <ArrowRight size={12} className="rtl:rotate-180" /></Link>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t('Labs · preview')}</div>
          <div className="space-y-2">{demo.labs.map(c => (
            <div key={c.id} className="row-hover rounded-xl border border-white/10 bg-white/[.03] p-3 hover:border-white/25 transition-all">
              <div className="flex items-center justify-between"><div className="text-sm font-medium">{c.name.replace('Lab environment', t('Lab environment'))}</div><Badge tone={c.status === 'running' ? 'ok' : c.status === 'error' ? 'bad' : 'default'}>{c.status || ''}</Badge></div>
              <div className="h-1 rounded-full bg-white/10 mt-2"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.progress}%`, background: accent.a }} /></div>
            </div>))}</div>
          <Link to="/labs" className="text-xs mt-4 inline-flex items-center gap-1 hover:underline hover:gap-2 transition-all" style={{ color: accent.a }}>{t('Open environments')} <ArrowRight size={12} className="rtl:rotate-180" /></Link>
        </Card>
      </CardsGrid>

      {/* closing CTA band */}
      <Card hover={false} className="relative overflow-hidden text-center py-12 md:py-14 mb-4 glow-accent anim-rise">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(600px 200px at 50% 0%, ${accent.a}22, transparent)` }} />
        <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight relative">{t('Ready to start?')}</h2>
        <p className="text-sm text-slate-400 mt-3 relative">{t('Jump straight into the essentials.')}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6 relative">
          <Btn to="/commands">{t('Browse commands')}</Btn>
          <Btn variant="outline" to="/tools">{t('Open catalog')}</Btn>
        </div>
      </Card>
    </div>
  );
}
