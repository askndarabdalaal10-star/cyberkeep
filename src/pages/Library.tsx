import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, LayoutGrid, List, Search, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { Badge, BookmarkBtn, Btn, Card, CardAction, CardsGrid, CopyBtn, Empty, Modal, NoResults, PageHeader, inputCls } from '../components/ui';
import { makeCommands, makeTools, useStore } from '../lib/store';

const LEVELS = ['All levels', 'Intro', 'Core', 'Advanced'];

/* ---- small command detail card (commands page only) ---- */
function CommandDetail({ item, nameWord, onClose }: { item: { id: string; name: string; category: string; level?: string; desc: string; usage?: string; example?: string; exampleExplained?: string; exampleOutput?: string }; nameWord: string; onClose: () => void }) {
  const { t } = useStore();
  const step = (n: number, label: string, body: React.ReactNode) => (
    <section>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">{n}</span>
        <div className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">{t(label)}</div>
      </div>
      {body}
    </section>
  );
  const codeBox = (code: string, copyLabel: string) => (
    <div className="rounded-xl bg-black/50 border border-white/10 p-3.5 flex items-start gap-2 text-[#cbd5e1]">
      <code className="flex-1 font-mono2 text-xs text-[#f1f5f9] leading-relaxed break-all" dir="ltr">{code}</code>
      <CopyBtn text={code} label={copyLabel} />
    </div>
  );
  return (
    <Modal open onClose={onClose} title={item.name.replace(nameWord, t(nameWord))}>
      <div className="flex items-center gap-2 mb-4">
        <Badge tone="accent">{item.category}</Badge>
        <Badge>{item.level || 'General'}</Badge>
      </div>
      <div className="space-y-4">
        {step(1, 'Command syntax', codeBox(item.usage || t('$ placeholder-command --flag (preview, no execution)'), 'Copy command'))}
        {step(2, 'What it does', <p className="text-xs text-slate-400 leading-relaxed">{t(item.desc)}</p>)}
        {step(3, 'Practical example', codeBox(item.example || t('$ placeholder-command --example (preview, no execution)'), 'Copy example'))}
        {step(4, 'Example explained', (
          <div className="rounded-xl border border-white/10 bg-white/[.02] p-3.5">
            <p className="text-xs text-slate-400 leading-relaxed">{t(item.exampleExplained || 'Placeholder walkthrough: this mock example shows where the explanation will appear, e.g. which placeholder artifact was produced.')}</p>
            {item.exampleOutput && <p className="font-mono2 text-[11px] text-emerald-300/90 mt-2" dir="ltr">{item.exampleOutput}</p>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
        <BookmarkBtn id={item.id} />
        <span className="flex-1" />
        <Btn size="sm" variant="outline" onClick={onClose}>{t('Close')}</Btn>
      </div>
    </Modal>
  );
}

export default function Library({ mode }: { mode: 'commands' | 'tools' }) {
  const { push, t, settings, setSettings } = useStore();
  const all = useMemo(() => (mode === 'commands' ? makeCommands() : makeTools()), [mode]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [level, setLevel] = useState('All levels');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const { bookmarks } = useStore();
  const nameWord = mode === 'commands' ? 'Command placeholder' : 'Tool placeholder';

  const filtered = all.filter(i =>
    (cat === 'All' || i.category === cat) &&
    (level === 'All levels' || i.level === level || mode === 'tools') &&
    (!savedOnly || bookmarks.includes(i.id)) &&
    (q === '' || (i.name + i.desc + i.category).toLowerCase().includes(q.toLowerCase()))
  );
  const cats = useMemo(() => ['All', ...Array.from(new Set(all.map(i => i.category)))], [all]);
  const sel = all.find(i => i.id === selected);
  const nav = useNavigate();

  return (
    <div>
      <PageHeader
        kicker={mode}
        title={mode === 'commands' ? 'Command Library' : 'Tool Catalog'}
        desc={mode === 'commands'
          ? 'Ten essential Linux system commands with copyable syntax, practical examples and plain explanations.'
          : 'Ten professional auditing tools for learning inside authorized lab scopes.'}
        actions={<><CopyBtn text="placeholder-filter-state" label="Copy view link" /><Btn size="sm" variant="outline" onClick={() => push({ title: 'Export is disabled in prototype', desc: 'UI preview only', kind: 'warn' })}>{t('Export')}</Btn></>}
      />

      {mode === 'tools' && (
        <div className="glass rounded-2xl density-pad mb-6 flex items-start gap-3 border-amber-500/25" style={{ boxShadow: '0 0 24px -12px rgba(251,191,36,.4)' }}>
          <ShieldAlert size={18} className="text-amber-300 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold">{t('Authorized use only')}</div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('These tools are for learning and authorized auditing only. Never run them against systems you do not own or lack explicit permission to test.')}</p>
          </div>
        </div>
      )}

      {/* search + filters */}
      <Card className="mb-6" hover={false}>        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t(mode === 'commands' ? 'Search commands…' : 'Search tools…')} className={inputCls + ' ps-10'} aria-label={t('Search')} />
          </div>
          <select value={level} onChange={e => setLevel(e.target.value)} className={inputCls + ' md:w-44'} aria-label={t('Level filter')}>
            {LEVELS.map(l => <option key={l} className="bg-slate-900">{t(l)}</option>)}
          </select>
          <motion.button whileTap={{ scale: .94 }} onClick={() => setSavedOnly(v => !v)} className={clsx('px-4 py-2.5 rounded-xl border text-sm cursor-pointer transition-all', savedOnly ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_18px_-6px_rgba(34,211,238,.6)]' : 'border-white/10 text-slate-400 hover:bg-white/5')}>
            {t('Saved only')}
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {cats.map(c => (
            <motion.button whileTap={{ scale: .92 }} key={c} onClick={() => setCat(c)}
              className={clsx('px-3.5 py-1.5 rounded-full text-xs border transition-all cursor-pointer flex items-center gap-1.5 hover:-translate-y-px', cat === c ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200 shadow-[0_0_16px_-6px_rgba(34,211,238,.7)]' : 'border-white/10 text-slate-400 hover:bg-white/5')}>
              <Filter size={11} />{t(c)}
            </motion.button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <NoResults onClear={() => { setQ(''); setCat('All'); setLevel('All levels'); setSavedOnly(false); }} />
      ) : (
        <>
        <div className="flex justify-end mb-3">
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10" role="group" aria-label={t('Card layout')}>
            <motion.button whileTap={{ scale: .9 }} onClick={() => setSettings({ cardLayout: 'grid' })} aria-label="grid" title="grid"
              className={clsx('p-2 rounded-lg cursor-pointer transition-all', settings.cardLayout === 'grid' ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-white')}><LayoutGrid size={14} /></motion.button>
            <motion.button whileTap={{ scale: .9 }} onClick={() => setSettings({ cardLayout: 'list' })} aria-label="list" title="list"
              className={clsx('p-2 rounded-lg cursor-pointer transition-all', settings.cardLayout === 'list' ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-white')}><List size={14} /></motion.button>
          </div>
        </div>
        <CardsGrid cols="sm:grid-cols-2 xl:grid-cols-3" className="stagger">
          {filtered.map(item => (
            <Card key={item.id} onClick={() => { if (mode === 'commands') setSelected(item.id); else nav(`/tools/${item.id}`); }} label={item.name}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge tone="accent">{item.category}</Badge>
                <CardAction><BookmarkBtn id={item.id} /></CardAction>
              </div>
              <h3 className="font-mono2 text-sm font-medium">{item.name.replace(nameWord, t(nameWord))}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t(item.desc)}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">{item.tags.map(tg => <span key={tg} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">#{tg}</span>)}</div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <span className="text-[11px] text-slate-500">{t(item.level || 'General')} · {t(item.updated)}</span>
                <button onClick={() => { if (mode === 'commands') setSelected(item.id); else nav(`/tools/${item.id}`); }} className="text-xs font-medium text-cyan-300 hover:underline hover:scale-105 transition cursor-pointer">{t('Details →')}</button>
              </div>
            </Card>
          ))}
        </CardsGrid>
        </>
      )}

      {/* detail: small card for commands; tools open a full page */}
      {mode === 'commands' && sel && <CommandDetail item={sel} nameWord={nameWord} onClose={() => setSelected(null)} />}

      {all.length > 0 && filtered.length > 0 && (
        <div className="mt-8"><Empty title="End of results" desc="You have seen everything in this section." icon={<Filter size={22} />} /></div>
      )}
    </div>
  );
}
