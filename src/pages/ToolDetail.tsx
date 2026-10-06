import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Copy, FlaskConical, Info, ListChecks, Play, ShieldAlert, TerminalSquare } from 'lucide-react';
import { Badge, BookmarkBtn, Btn, Card, Empty } from '../components/ui';
import { makeTools, useStore } from '../lib/store';
import { useMemo } from 'react';

/* ---------- full tool detail page (placeholder content only) ---------- */
export default function ToolDetail() {
  const { id } = useParams();
  const { t, push } = useStore();
  const tool = useMemo(() => makeTools().find(x => x.id === id), [id]);

  if (!tool) {
    return (
      <div>
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors mb-6"><ArrowLeft size={13} className="rtl:rotate-180" /> {t('Back to tools')}</Link>
        <Empty title="Tool not found" desc="Unknown tool id. Return to the catalog." action={<Btn size="sm" to="/tools">{t('Back to tools')}</Btn>} />
      </div>
    );
  }

  const section = (icon: React.ReactNode, title: string, body: React.ReactNode) => (
    <Card hover={false}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-300">{icon}</span>
        <h2 className="font-display font-semibold text-lg">{t(title)}</h2>
      </div>
      {body}
    </Card>
  );

  const cmdBox = (code: string, copyLabel: string, tryBtn: boolean) => (
    <div>
      <div className="rounded-xl bg-black/50 border border-white/10 p-4 flex items-start gap-2 text-[#cbd5e1]">
        <code className="flex-1 font-mono2 text-[13px] text-[#f1f5f9] leading-relaxed break-all" dir="ltr">{code}</code>
        <button onClick={() => { try { navigator.clipboard.writeText(code); } catch { /* noop */ } push({ title: 'Copied to clipboard', desc: copyLabel, kind: 'success' }); }}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/25 cursor-pointer transition-all shrink-0"><Copy size={13} />{t(copyLabel)}</button>
      </div>
      {tryBtn && (
        <Btn size="sm" variant="outline" className="mt-3" onClick={() => push({ title: 'Sandbox launch is disabled in prototype', kind: 'warn' })}>
          <Play size={13} /> {t('Try in sandbox')}
        </Btn>
      )}
    </div>
  );

  const related = makeTools().filter(x => x.id !== tool.id && x.category === tool.category).slice(0, 3);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white hover:gap-2.5 transition-all mb-4"><ArrowLeft size={13} className="rtl:rotate-180" /> {t('Back to tools')}</Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge tone="accent">{tool.category}</Badge>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{tool.name}</h1>
            <p className="text-sm text-slate-500 mt-2 font-mono2">{tool.id} · {t('Varies by distribution')}</p>
          </div>
          <BookmarkBtn id={tool.id} />
        </div>
      </motion.div>

      <div className="glass rounded-2xl density-pad mb-6 flex items-start gap-3 border-amber-500/25" style={{ boxShadow: '0 0 24px -12px rgba(251,191,36,.4)' }}>
        <ShieldAlert size={18} className="text-amber-300 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold">{t('Authorized use only')}</div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('These tools are for learning and authorized auditing only. Never run them against systems you do not own or lack explicit permission to test.')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 stagger">
        <div className="lg:col-span-2 space-y-4">
          {section(<TerminalSquare size={17} />, 'Install command', cmdBox(tool.install || '', 'Copy install', false))}
          {section(<Play size={17} />, 'Run and try', cmdBox(tool.runCmd || '', 'Copy run command', true))}
          {section(<Info size={17} />, 'Overview', <p className="text-sm text-slate-400 leading-relaxed">{t(tool.overview || '')}</p>)}
          {section(<ListChecks size={17} />, 'Key features', (
            <ul className="space-y-2.5">
              {(tool.features || []).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />{t(f)}
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="space-y-4">
          <Card hover={false}>
            <div className="text-sm font-semibold mb-3">{t('Tool information')}</div>
            {[[t('Version'), t('Varies by distribution')], [t('Author'), t(tool.author || '—')], [t('License'), t(tool.license || '—')], [t('Platform'), t(tool.platform || '—')], [t('Updated'), t('—')]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 text-sm py-2 border-t border-white/5 first:border-0"><span className="text-slate-500">{k}</span><span className="font-mono2 text-xs text-end">{v}</span></div>
            ))}
          </Card>
          <Card hover={false}>
            <div className="text-sm font-semibold mb-3 flex items-center gap-2"><FlaskConical size={14} /> {t('Related tools')}</div>
            {related.length === 0 ? (
              <p className="text-xs text-slate-500">{t('No related entries in this placeholder set.')}</p>
            ) : (
              <div className="space-y-2">{related.map(r => (
                <Link key={r.id} to={`/tools/${r.id}`} className="block rounded-xl border border-white/10 bg-white/[.02] px-3 py-2.5 text-sm hover:border-cyan-400/30 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all">
                  {r.name}
                  <span className="block text-[11px] text-slate-500">{t(r.category)}</span>
                </Link>
              ))}</div>
            )}
          </Card>
          <Card hover={false}>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t('Tags')}</div>
            <div className="flex flex-wrap gap-1.5">{tool.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">#{tag}</span>)}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
