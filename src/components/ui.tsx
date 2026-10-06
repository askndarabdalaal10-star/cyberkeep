import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Bookmark, Copy, Ghost, Heart, Info, SearchX, X } from 'lucide-react';
import { useStore } from '../lib/store';

/* buttons */
const btnCls = (variant: 'primary' | 'ghost' | 'outline' | 'danger', size: 'sm' | 'md' | 'lg', className?: string) => clsx(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-[.96] hover:-translate-y-px cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  size === 'sm' && 'px-3 py-1.5 text-xs', size === 'md' && 'px-4 py-2.5 text-sm', size === 'lg' && 'px-6 py-3.5 text-base',
  variant === 'primary' && 'text-[#04121a] font-semibold hover:brightness-110 hover:shadow-lg btn-shine',
  variant === 'ghost' && 'hover:bg-white/5 text-slate-300',
  variant === 'outline' && 'border border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/5',
  variant === 'danger' && 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25',
  className
);
export function Btn({ children, variant = 'primary', size = 'md', className, to, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'danger'; size?: 'sm' | 'md' | 'lg'; to?: string }) {
  const { accent } = useStore();
  const style = variant === 'primary' ? { background: `linear-gradient(135deg, ${accent.a}, ${accent.b})` } : undefined;
  if (to) return <Link to={to} className={btnCls(variant, size, className)} style={style}>{children}</Link>;
  return <button {...p} className={btnCls(variant, size, className)} style={style}>{children}</button>;
}

/* card */
export function Card({ children, className, hover = true, onClick, label }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  if (onClick) {
    return (
      <div ref={ref} onMouseMove={hover ? onMove : undefined} onClick={onClick} role="button" tabIndex={0} aria-label={label}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        className={clsx('glass cl-card rounded-2xl density-pad overflow-hidden cursor-pointer', hover && 'card-hover spotlight', className)}>{children}</div>
    );
  }
  return <div ref={ref} onMouseMove={hover ? onMove : undefined} className={clsx('glass cl-card rounded-2xl density-pad overflow-hidden', hover && 'card-hover spotlight', className)}>{children}</div>;
}

/* responsive cards grid: grid or stacked list per settings */
export function CardsGrid({ children, cols, className }: { children: React.ReactNode; cols: string; className?: string }) {
  const { settings } = useStore();
  const list = settings.cardLayout === 'list';
  return <div className={clsx('grid gap-4', list ? 'grid-cols-1' : cols, className)}>{children}</div>;
}

/* stop inner buttons from triggering a clickable parent card */
export function CardAction({ children }: { children: React.ReactNode }) {
  return <span onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>{children}</span>;
}

export function SectionTitle({ kicker, title, desc, right }: { kicker?: string; title: string; desc?: string; right?: React.ReactNode }) {
  const { accent, t } = useStore();
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {kicker && <div className="text-[11px] font-semibold tracking-[.22em] uppercase mb-2" style={{ color: accent.a }}>{t(kicker)}</div>}
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{t(title)}</h2>
        {desc && <p className="text-sm text-slate-400 mt-2 max-w-xl">{t(desc)}</p>}
      </div>
      {right}
    </div>
  );
}

export function PageHeader({ kicker, title, desc, actions }: { kicker: string; title: string; desc: string; actions?: React.ReactNode }) {
  const { accent, t } = useStore();
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-[.2em] uppercase text-slate-300 mb-4">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent.a }} />{t(kicker)}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{t(title)}</h1>
          <p className="text-slate-400 mt-3 max-w-2xl text-sm md:text-base">{t(desc)}</p>
        </div>
        {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
      </div>
    </motion.div>
  );
}

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'ok' | 'warn' | 'bad' | 'accent' }) {
  const { t } = useStore();
  const text = typeof children === 'string' ? t(children) : children;
  return <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors',
    tone === 'default' && 'bg-white/5 border-white/10 text-slate-300',
    tone === 'ok' && 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
    tone === 'warn' && 'bg-amber-500/10 border-amber-500/25 text-amber-300',
    tone === 'bad' && 'bg-rose-500/10 border-rose-500/25 text-rose-300',
    tone === 'accent' && 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300')}>{text}</span>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  const { t } = useStore();
  return (
    <label className="block">
      <div className="text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">{t(label)}</div>
      {children}
      {hint && <div className="text-xs text-slate-500 mt-1.5">{t(hint)}</div>}
    </label>
  );
}

export const inputCls = 'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/[.07] outline-none transition';

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  const { accent } = useStore();
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 hover:scale-105 active:scale-95"
      style={{ background: checked ? accent.a : 'rgba(148,163,184,.3)' }}>
      <span className={clsx('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', checked ? 'start-[22px]' : 'start-0.5')} />
    </button>
  );
}

export function Progress({ value }: { value: number }) {
  const { accent } = useStore();
  return <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${accent.a}, ${accent.b})` }} /></div>;
}

/* empty state */
export function Empty({ title, desc, action, icon }: { title: string; desc: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  const { t } = useStore();
  return (
    <div className="glass rounded-2xl p-10 md:p-14 text-center flex flex-col items-center gap-3 anim-pop">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 animate-float" style={{ animation: 'float 5s ease-in-out infinite' }}>{icon || <Ghost size={24} />}</div>
      <h3 className="font-display font-semibold text-lg">{t(title)}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{t(desc)}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* shared modal behavior: Escape to close + background scroll lock */
function useModalBehavior(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
}

/* modal */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const { t } = useStore();
  useModalBehavior(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: .92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 340 }}
        className={clsx('relative glass rounded-2xl p-6 w-full shadow-2xl', wide ? 'max-w-2xl' : 'max-w-md')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">{t(title)}</h3>
          <button onClick={onClose} aria-label={t('Close')} className="p-2 rounded-lg hover:bg-white/10 hover:rotate-90 transition-all cursor-pointer"><X size={16} /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* toasts */
export function Toasts() {
  const { toasts, dismiss, t } = useStore();
  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]" aria-live="polite">
      {toasts.map(tst => (
        <motion.div key={tst.id} initial={{ opacity: 0, x: 40, scale: .95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="glass rounded-xl p-4 flex gap-3 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => dismiss(tst.id)}>
          <span className={clsx('mt-0.5', tst.kind === 'success' ? 'text-emerald-400' : tst.kind === 'error' ? 'text-rose-400' : tst.kind === 'warn' ? 'text-amber-400' : 'text-cyan-400')}>
            {tst.kind === 'warn' || tst.kind === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
          </span>
          <div className="flex-1"><div className="text-sm font-semibold">{t(tst.title)}</div>{tst.desc && <div className="text-xs text-slate-400 mt-0.5">{t(tst.desc)}</div>}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* copy + bookmark buttons */
export function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const { push, t } = useStore();
  return <button onClick={() => { try { navigator.clipboard.writeText(text); } catch { /* noop */ } push({ title: 'Copied to clipboard', desc: label, kind: 'success' }); }}
    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 hover:border-white/25 hover:-translate-y-px active:scale-95 cursor-pointer transition-all"><Copy size={13} />{t(label)}</button>;
}
export function BookmarkBtn({ id }: { id: string }) {
  const { bookmarks, favorites, toggleBookmark, toggleFavorite, push, t } = useStore();
  const b = bookmarks.includes(id), f = favorites.includes(id);
  return (
    <div className="flex gap-1">
      <button aria-label={t('Bookmark')} title={t('Bookmark')} onClick={() => { toggleBookmark(id); push({ title: b ? 'Bookmark removed' : 'Bookmarked', desc: id, kind: 'info' }); }}
        className={clsx('p-2 rounded-lg border transition-all cursor-pointer hover:scale-110 active:scale-90', b ? 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10' : 'border-white/10 text-slate-400 hover:bg-white/5')}><Bookmark size={14} fill={b ? 'currentColor' : 'none'} /></button>
      <button aria-label={t('Favorite')} title={t('Favorite')} onClick={() => { toggleFavorite(id); push({ title: f ? 'Removed from favorites' : 'Added to favorites', desc: id, kind: 'success' }); }}
        className={clsx('p-2 rounded-lg border transition-all cursor-pointer hover:scale-110 active:scale-90', f ? 'border-rose-400/40 text-rose-300 bg-rose-500/10' : 'border-white/10 text-slate-400 hover:bg-white/5')}><Heart size={14} fill={f ? 'currentColor' : 'none'} /></button>
    </div>
  );
}

/* stat placeholder (no fake numbers) */
export function StatPlaceholder({ label, hint }: { label: string; hint: string }) {
  const { t } = useStore();
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">{t(label)}</div>
      <div className="skeleton h-8 w-2/3 mb-2" />
      <div className="text-xs text-slate-500">{t(hint)}</div>
    </Card>
  );
}

export function NoResults({ onClear }: { onClear: () => void }) {
  const { t } = useStore();
  return <Empty icon={<SearchX size={24} />} title="No results found" desc="Nothing matches the current search and filters." action={<Btn variant="outline" size="sm" onClick={onClear}>{t('Clear filters')}</Btn>} />;
}
