import { motion } from 'framer-motion';
import { AlignCenter, AlignLeft, AlignRight, LayoutGrid, List, PanelLeft, PanelTop } from 'lucide-react';
import clsx from 'clsx';
import { Badge, Btn, Card, PageHeader, SectionTitle, Switch } from '../components/ui';
import { useStore, type Accent, type Density, type FontSize } from '../lib/store';

/* ---------------- SETTINGS — fully functional in prototype ---------------- */
export default function Settings() {
  const { settings, setSettings, push, t } = useStore();
  const accents: { id: Accent; c: string }[] = [
    { id: 'cyan', c: '#22d3ee' }, { id: 'violet', c: '#8b5cf6' }, { id: 'emerald', c: '#34d399' }, { id: 'amber', c: '#fbbf24' }, { id: 'rose', c: '#fb7185' },
  ];
  const row = (label: string, desc: string, control: React.ReactNode) => (
    <div className="flex items-center justify-between gap-4 py-4 border-t border-white/5 first:border-0">
      <div><div className="text-sm font-medium">{t(label)}</div><div className="text-xs text-slate-500 mt-0.5">{t(desc)}</div></div>
      <div className="shrink-0">{control}</div>
    </div>
  );
  return (
    <div>
      <PageHeader kicker="preferences" title="Settings"
        desc="Every interface control below works live and persists locally. Accessibility toggles apply across pages and 3D."
        actions={<Btn size="sm" variant="outline" onClick={() => { localStorage.removeItem('cyberlab-ui'); push({ title: 'Settings reset (mock)', kind: 'info' }); window.location.reload(); }}>{t('Reset all')}</Btn>} />

      <div className="grid lg:grid-cols-2 gap-4 stagger">
        <Card hover={false}>
          <SectionTitle title="Appearance" />
          {row('Theme', 'Dark or light shell', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['dark', 'light'] as const).map(x => (
                <motion.button whileTap={{ scale: .92 }} key={x} onClick={() => setSettings({ theme: x })} className={clsx('px-4 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.theme === x ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(x)}</motion.button>))}
            </div>))}
          {row('Accent color', 'Gradient source across buttons and highlights', (
            <div className="flex gap-2">{accents.map(a => (
              <motion.button whileHover={{ scale: 1.18 }} whileTap={{ scale: .9 }} key={a.id} onClick={() => setSettings({ accent: a.id })} aria-label={`${a.id} accent`} title={a.id}
                className={clsx('w-8 h-8 rounded-full cursor-pointer transition ring-2 ring-offset-2 ring-offset-transparent', settings.accent === a.id ? 'ring-white/70 scale-110 shadow-[0_0_14px_-2px_currentColor]' : 'ring-transparent')}
                style={{ background: a.c, color: a.c }} />))}</div>))}
          {row('Font size', 'Base type scale', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['small', 'medium', 'large'] as FontSize[]).map(f => (
                <motion.button whileTap={{ scale: .92 }} key={f} onClick={() => setSettings({ fontSize: f })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.fontSize === f ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(f)}</motion.button>))}</div>))}
          {row('UI density', 'Card and row spacing', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['compact', 'comfortable', 'spacious'] as Density[]).map(d => (
                <motion.button whileTap={{ scale: .92 }} key={d} onClick={() => setSettings({ density: d })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.density === d ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(d)}</motion.button>))}</div>))}
          {row('Navigation position', 'Side or top navigation bar', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {([['side', <PanelLeft key="s" size={13} />], ['top', <PanelTop key="t" size={13} />]] as const).map(([v, icon]) => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ navPosition: v })} className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.navPosition === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{icon}{t(v)}</motion.button>))}</div>))}
        </Card>

        <Card hover={false}>
          <SectionTitle title="Topbar" />
          {row('Search position', 'Search box placement in the top bar', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {([['start', <AlignLeft key="s" size={13} />], ['center', <AlignCenter key="c" size={13} />], ['end', <AlignRight key="e" size={13} />]] as const).map(([v, icon]) => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ searchPosition: v })} className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.searchPosition === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{icon}{t(v)}</motion.button>))}</div>))}
          {row('Controls position', 'Top bar buttons placement', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['start', 'end'] as const).map(v => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ controlsPosition: v })} className={clsx('px-4 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.controlsPosition === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(v)}</motion.button>))}</div>))}
        </Card>

        <Card hover={false}>
          <SectionTitle title="Layout & cards" />
          {row('Card layout', 'Cards grid or stacked list', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {([['grid', <LayoutGrid key="g" size={13} />], ['list', <List key="l" size={13} />]] as const).map(([v, icon]) => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ cardLayout: v })} className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.cardLayout === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{icon}{t(v)}</motion.button>))}</div>))}
          {row('Card style', 'Card surface style across the interface', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['glass', 'solid', 'bordered', 'minimal'] as const).map(v => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ cardStyle: v })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.cardStyle === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(v)}</motion.button>))}</div>))}
          {row('Content width', 'Main content max width', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['narrow', 'comfortable', 'wide'] as const).map(v => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ contentWidth: v })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.contentWidth === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(v)}</motion.button>))}</div>))}
          {row('Corners', 'Corner roundness everywhere', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['rounded', 'sharp', 'large'] as const).map(v => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ radius: v })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.radius === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(v)}</motion.button>))}</div>))}
          {row('Glow', 'Glow and shadow intensity', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['normal', 'strong', 'off'] as const).map(v => (
                <motion.button whileTap={{ scale: .92 }} key={v} onClick={() => setSettings({ glow: v })} className={clsx('px-3 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.glow === v ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(v)}</motion.button>))}</div>))}
          {row('Glass blur', 'Soften panels with backdrop blur', <Switch checked={settings.blur} onChange={v => setSettings({ blur: v })} label="Glass blur" />)}
        </Card>

        <Card hover={false}>
          <SectionTitle title="Motion, 3D & performance" />
          {row('Animations', 'Page, card and hover transitions', <Switch checked={settings.animations} onChange={v => setSettings({ animations: v })} label="Animations" />)}
          {row('Reduce motion', 'Minimizes movement (also honors OS setting)', <Switch checked={settings.reduceMotion} onChange={v => setSettings({ reduceMotion: v })} label="Reduce motion" />)}
          {row('3D environment', 'Three.js core vs lightweight 2D fallback', <Switch checked={settings.threeD} onChange={v => setSettings({ threeD: v })} label="3D" />)}
          {row('Render quality', 'Particle and geometry density', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['high', 'low'] as const).map(qy => (
                <motion.button whileTap={{ scale: .92 }} key={qy} onClick={() => setSettings({ quality: qy })} className={clsx('px-4 py-1.5 rounded-lg text-xs capitalize cursor-pointer transition-all', settings.quality === qy ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(qy)}</motion.button>))}</div>))}
          <div className="mt-3 text-[11px] text-slate-500">{t('Try disabling 3D, then visit Home — the hero swaps to a 2D canvas automatically.')}</div>
        </Card>

        <Card hover={false}>
          <SectionTitle title="Language & direction" />
          {row('Language', 'Switch the full interface language.', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['en', 'ar'] as const).map(l => (
                <motion.button whileTap={{ scale: .92 }} key={l} onClick={() => setSettings({ language: l, dir: l === 'ar' ? 'rtl' : 'ltr' })} className={clsx('px-4 py-1.5 rounded-lg text-xs uppercase cursor-pointer transition-all', settings.language === l ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{l === 'ar' ? 'عربي' : 'EN'}</motion.button>))}</div>))}
          {row('Direction', 'LTR / RTL layout mirroring', (
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(['ltr', 'rtl'] as const).map(d => (
                <motion.button whileTap={{ scale: .92 }} key={d} onClick={() => setSettings({ dir: d })} className={clsx('px-4 py-1.5 rounded-lg text-xs uppercase cursor-pointer transition-all', settings.dir === d ? 'bg-white/15 text-white shadow' : 'text-slate-400')}>{t(d)}</motion.button>))}</div>))}
        </Card>

        <Card hover={false}>
          <SectionTitle title="Accessibility" />
          {[[t('High contrast focus'), t('Stronger visible focus rings, always on.')], [t('Keyboard navigation'), t('Tab / Enter / Esc supported in dialogs and palette')], [t('Touch targets'), t('Minimum 40px controls on mobile layouts')]].map(([title, d]) => (
            <div key={title} className="flex items-center justify-between gap-4 py-3.5 border-t border-white/5 first:border-0">
              <div><div className="text-sm font-medium">{title}</div><div className="text-xs text-slate-500">{d}</div></div>
              <Badge tone="ok">on</Badge>
            </div>))}
          <Btn size="sm" variant="outline" className="mt-3" onClick={() => push({ title: 'Accessibility audit (mock)', desc: 'Prototype self-check passed', kind: 'success' })}>{t('Run self-check')}</Btn>
        </Card>
      </div>
    </div>
  );
}
