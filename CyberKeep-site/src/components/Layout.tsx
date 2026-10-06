import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Bookmark, ChevronLeft, Command, FlaskConical, Globe, Home, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Settings, ShieldCheck, Sun, Terminal, User, Wrench, X } from 'lucide-react';
import { NAV_GROUPS, useStore } from '../lib/store';
import { Modal, Toasts, inputCls } from './ui';

// Three.js (~600KB) must NOT block first paint: loaded on demand after idle.
const Cyber3D = lazy(() => import('./Cyber3D'));

const ICONS: Record<string, React.ReactNode> = {
  '/': <Home size={17} />, '/commands': <Terminal size={17} />,
  '/tools': <Wrench size={17} />, '/labs': <FlaskConical size={17} />,
  '/bookmarks': <Bookmark size={17} />, '/profile': <User size={17} />,
  '/about': <ShieldCheck size={17} />, '/settings': <Settings size={17} />,
};

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  const { accent, t } = useStore();
  return (
    <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
      <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm text-[#04121a] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: `linear-gradient(135deg, ${accent.a}, ${accent.b})` }}>CK</span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block font-display font-bold tracking-widest text-sm">{t('CyberKeep')}</span>
          <span className="block text-[10px] tracking-[.25em] text-slate-500 uppercase">{t('Security platform')}</span>
        </span>
      )}
    </Link>
  );
}

function NavItem({ to, label, collapsed }: { to: string; label: string; collapsed: boolean }) {
  const { t, accent } = useStore();
  const name = t(label);
  return (
    <NavLink to={to} end={to === '/'} title={collapsed ? name : undefined}>
      {({ isActive }) => (
        <span className={clsx('relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 active:scale-[.98] overflow-hidden',
          collapsed && 'justify-center px-1',
          isActive ? 'bg-white/[.07] text-white border border-white/10 nav-active' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent')}>
          {isActive && (
            <motion.span layoutId="side-ink" className="absolute start-0 top-2 bottom-2 w-1 rounded-full"
              style={{ background: `linear-gradient(180deg, ${accent.a}, ${accent.b})`, boxShadow: `0 0 14px 1px ${accent.a}` }}
              transition={{ type: 'spring', damping: 28, stiffness: 420 }} />
          )}
          <span className={clsx('side-ic shrink-0 w-8 h-8 rounded-lg grid place-items-center', !isActive && 'side-ic-glow')}
            style={isActive ? { background: accent.soft, color: accent.a, boxShadow: `0 0 16px -4px ${accent.a}` } : undefined}>
            <span className="icon-wiggle">{ICONS[to] || <ChevronLeft size={16} />}</span>
          </span>
          {!collapsed && <span className="flex-1">{name}</span>}
          {!collapsed && isActive && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent.a, boxShadow: `0 0 8px ${accent.a}` }} />}
        </span>
      )}
    </NavLink>
  );
}

function TopNav() {
  const { accent, t } = useStore();
  const groups = NAV_GROUPS.map(g => ({ label: g.label, items: g.items }));
  let n = -1;
  return (
    <div className="hidden lg:flex justify-center px-3 pb-2.5">
      <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
        className="topbar-full w-fit max-w-full">
      <nav className="w-fit max-w-full mx-auto px-3 md:px-4" aria-label="Primary">
        <div className="flex items-stretch gap-1.5 overflow-x-auto py-2.5 w-max max-w-full">
          {groups.map((g, gi) => (
            <React.Fragment key={g.label}>
              {gi > 0 && <span className="w-px h-6 bg-white/10 mx-1 shrink-0 self-center" aria-hidden />}
              {g.items.map(l => { n++; const d = n; return (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className="flex-1 min-w-fit">
                  {({ isActive }) => (
                    <motion.span initial={{ opacity: 0, y: -12, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: .06 + d * .05, type: 'spring', damping: 21, stiffness: 300 }}
                      whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: .85, y: 0 }}
                      className={clsx('nav-pill h-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-3.5 text-[15px] whitespace-nowrap cursor-pointer font-semibold',
                        isActive ? '' : 'text-slate-400 hover:text-slate-100')}
                      style={isActive ? { color: '#ffffff', textShadow: '0 1px 10px rgba(0,0,0,.45)' } : undefined}>
                      {isActive && (
                        <motion.span layoutId="topnav-glider" className="absolute inset-0 rounded-xl"
                          style={{ background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 45%, #2563eb 100%)', boxShadow: '0 0 28px 2px rgba(56,189,248,.75), 0 10px 24px -10px rgba(37,99,235,.8), inset 0 1px 0 rgba(255,255,255,.5), inset 0 0 0 1px rgba(255,255,255,.22)' }}
                          transition={{ type: 'spring', damping: 26, stiffness: 230 }} />
                      )}
                      <span className="icon-wiggle relative z-10">{ICONS[l.to] || <ChevronLeft size={16} />}</span>
                      <span className="relative z-10">{t(l.label)}</span>
                    </motion.span>
                  )}
                </NavLink>
              ); })}
            </React.Fragment>
          ))}
        </div>
      </nav>
      </motion.div>
    </div>
  );
}

export function Shell() {
  const { settings, setSettings, setCommandPaletteOpen, push, t, accent } = useStore();
  const [drawer, setDrawer] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  // Defer the heavy 3D chunk until the browser is idle (after first paint).
  const [bgReady, setBgReady] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setBgReady(true), { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setBgReady(true), 1200);
    return () => clearTimeout(t);
  }, []);
  const [sideHidden, setSideHidden] = useState(() => { try { return localStorage.getItem('cyberlab-side-hidden') === '1'; } catch { return false; } });
  const toggleSideHidden = useCallback((v: boolean) => { setSideHidden(v); try { localStorage.setItem('cyberlab-side-hidden', v ? '1' : '0'); } catch { /* noop */ } }, []);
  const loc = useLocation();
  const top = settings.navPosition === 'top';
  const isAuth = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/two-factor'].includes(loc.pathname);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (y < 140 || dy < -4) setHideBar(false);
      else if (dy > 4) setHideBar(true);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* reveal hidden sidebar on any click outside interactive elements */
  useEffect(() => {
    if (top || !sideHidden) return;
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('button, a, input, select, textarea, [role="button"], [role="switch"], [role="dialog"]')) return;
      toggleSideHidden(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [top, sideHidden, toggleSideHidden]);

  /* notifications: per-item read/unread, persisted locally */
  const [notifs, setNotifs] = useState<{ id: string; text: string; read: boolean }[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('cyberlab-notifs') || 'null');
      if (Array.isArray(raw) && raw.length) return raw;
    } catch { /* fallback below */ }
    return [
      { id: 'n1', text: 'Welcome to CyberKeep.', read: false },
      { id: 'n2', text: 'Explore commands, tools and labs from the sidebar.', read: false },
      { id: 'n3', text: 'Tip: press Ctrl K for quick navigation.', read: false },
    ];
  });
  useEffect(() => { try { localStorage.setItem('cyberlab-notifs', JSON.stringify(notifs)); } catch { /* noop */ } }, [notifs]);
  const unreadCount = notifs.filter(n => !n.read).length;
  const toggleNotifRead = (id: string) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!notifOpen) return;
    const onDown = (e: PointerEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNotifOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [notifOpen]);

  const controlsGroup = (
    <div className={`flex items-center gap-2 md:gap-3 min-w-0 ${settings.controlsPosition === 'start' ? 'lg:[grid-area:left] lg:justify-self-start' : 'lg:[grid-area:right] lg:justify-self-end'}`}>
      <div className="hidden xl:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('Systems nominal')}
      </div>
      <motion.button whileTap={{ scale: .85, rotate: 25 }} onClick={() => setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} className="p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition" aria-label={t('Toggle theme')} title={t('Toggle theme')}>
        {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </motion.button>
      <motion.button whileTap={{ scale: .85 }} onClick={() => {
        const next = settings.language === 'ar' ? 'en' : 'ar';
        setSettings({ language: next, dir: next === 'ar' ? 'rtl' : 'ltr' });
        push({ title: next === 'ar' ? 'Switched to Arabic' : 'Switched to English', kind: 'success' });
      }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition text-xs font-bold" aria-label="Language / اللغة" title="Language / اللغة">
        <Globe size={16} />
        <span className="font-display">{settings.language === 'ar' ? 'EN' : 'عربي'}</span>
      </motion.button>
      <div className="relative" ref={notifRef}>
        <motion.button whileTap={{ scale: .85 }} onClick={() => setNotifOpen(v => !v)} className="p-2.5 rounded-xl hover:bg-white/10 relative cursor-pointer transition" aria-label={`${t('Notifications')}${unreadCount > 0 ? ` (${unreadCount})` : ''}`}>
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-[#04121a] animate-pop" style={{ background: `linear-gradient(135deg, ${accent.a}, ${accent.b})` }}>{unreadCount}</span>
          )}
        </motion.button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ type: 'spring', damping: 26, stiffness: 350 }}
              className="absolute end-0 mt-2 w-80 glass rounded-2xl p-2 shadow-2xl z-50 origin-top">
              <div className="px-3 py-2 text-sm font-semibold flex justify-between items-center">{t('Notifications')} {unreadCount > 0 && <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">{unreadCount}</span>}</div>
              {notifs.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 * i }}
                  className="flex items-center gap-1 border-t border-white/5 first:border-0 group/notif">
                  <motion.button
                    onClick={() => toggleNotifRead(n.id)} title={n.read ? t('Mark as unread') : t('Mark as read')} aria-pressed={!n.read}
                    className={`flex-1 flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-start text-sm cursor-pointer transition-all hover:translate-x-0.5 rtl:hover:-translate-x-0.5 ${n.read ? 'text-slate-500 hover:bg-white/5' : 'text-slate-200 hover:bg-white/5 bg-white/[.03]'}`}>
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-600' : 'animate-pulse'}`} style={n.read ? undefined : { background: accent.a, boxShadow: `0 0 8px ${accent.a}` }} />
                    <span className="flex-1">{t(n.text)}</span>
                  </motion.button>
                  <button onClick={() => setNotifs(ns => ns.filter(x => x.id !== n.id))} aria-label={t('Delete notification')} title={t('Delete notification')}
                    className="me-2 p-1.5 rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 hover:scale-110 active:scale-90 cursor-pointer transition-all">
                    <X size={13} />
                  </button>
                </motion.div>
              ))}
              {notifs.length === 0 ? (
                <div className="mt-1 py-3 text-center">
                  <div className="text-[11px] text-slate-500 mb-2">{t('No new notifications')}</div>
                  <button onClick={() => setNotifs([
                    { id: `n${Date.now()}-1`, text: 'Welcome to CyberKeep.', read: false },
                    { id: `n${Date.now()}-2`, text: 'Explore commands, tools and labs from the sidebar.', read: false },
                    { id: `n${Date.now()}-3`, text: 'Tip: press Ctrl K for quick navigation.', read: false },
                  ])} className="text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200 cursor-pointer transition-all">{t('Restore notifications')}</button>
                </div>
              ) : unreadCount > 0 ? (
                <button onClick={() => setNotifs(ns => ns.map(n => ({ ...n, read: true })))} className="w-full mt-1 text-xs py-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 cursor-pointer transition">{t('Mark all as read')}</button>
              ) : (
                <div className="mt-1 text-[11px] py-2 text-center text-slate-500">{t('No new notifications')}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link to="/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold text-[#04121a] hover:scale-110 hover:rotate-6 transition-transform" title={t('Profile')}>OP</Link>
    </div>
  );

  if (isAuth) return <div className="min-h-screen"><Outlet /><Toasts /></div>;

  return (
    <div className="min-h-screen flex relative">
      {/* bg layers */}
      <div className="fixed inset-0 -z-10 bg-grid mask-fade opacity-70" />
      {/* global 3D background — fixed behind everything, persists across navigation.
          Chunk is lazy-loaded AFTER first paint so WebGL init never blocks LCP. */}
      <div className="fixed inset-0 -z-[30] pointer-events-none" aria-hidden="true">
        {bgReady && (
          <Suspense fallback={null}>
            <Cyber3D fill />
          </Suspense>
        )}
      </div>
      <div className="fixed inset-0 -z-[29] pointer-events-none" aria-hidden="true" style={{
        background: settings.theme === 'dark'
          ? 'linear-gradient(180deg, rgba(5,8,15,.62), rgba(5,8,15,.28) 35%, rgba(5,8,15,.72) 75%, rgba(5,8,15,.9))'
          : 'linear-gradient(180deg, rgba(241,245,249,.88), rgba(241,245,249,.72) 35%, rgba(241,245,249,.9) 75%, rgba(241,245,249,.96))'
      }} />
      <div className="orb w-[420px] h-[420px] top-[-120px] start-[8%]" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.14), transparent 70%)' }} />
      <div className="orb w-[520px] h-[520px] top-[10%] end-[-140px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,.15), transparent 70%)', animationDelay: '-6s' }} />
      <div className="orb w-[380px] h-[380px] bottom-[-140px] start-[30%]" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.09), transparent 70%)', animationDelay: '-11s' }} />
      <div className="fixed inset-0 -z-20" style={{ background: settings.theme === 'dark' ? 'radial-gradient(1000px 500px at 20% -5%, rgba(34,211,238,.08), transparent), radial-gradient(900px 500px at 85% 10%, rgba(139,92,246,.09), transparent), #05080f' : 'radial-gradient(1000px 500px at 20% -5%, rgba(6,182,212,.1), transparent), #f1f5f9' }} />

      {/* desktop sidebar */}
      {!top && !sideHidden && (
        <aside
          onClick={(e) => { const el = e.target as HTMLElement; if (!el.closest('nav a')) toggleSideHidden(true); }}
          className="hidden lg:flex flex-col sticky top-0 h-screen w-[264px] border-e border-white/10 glass z-40">
          <div className="p-4 flex items-center justify-between cursor-pointer rounded-xl hover:bg-white/5 transition-colors"
            role="button" tabIndex={0} title={t('Hide sidebar')}
            onClickCapture={(e) => { e.preventDefault(); toggleSideHidden(true); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSideHidden(true); } }}>
            <Logo />
          </div>
          <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
            {NAV_GROUPS.map(g => (
              <div key={g.label}>
                <div className="px-3 mb-2 text-[10px] font-semibold tracking-[.22em] uppercase text-slate-500">{t(g.label)}</div>
                <div className="space-y-1">{g.items.map(i => <NavItem key={i.to} to={i.to} label={i.label} collapsed={false} />)}</div>
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10 space-y-4">
            <Link to="/profile" className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition group">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold text-[#04121a] shrink-0 transition-transform group-hover:scale-110">OP</span>
              <span className="flex-1 min-w-0"><span className="block text-sm font-medium truncate">{t('Operator')}</span><span className="block text-[11px] text-slate-500">{t('Personal workspace')}</span></span>
            </Link>
            <motion.button whileTap={{ scale: .96 }} onClick={() => toggleSideHidden(true)} className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-100 cursor-pointer transition-all" aria-label={t('Hide sidebar')} title={t('Hide sidebar')}>
              <PanelLeftClose size={15} /> {t('Hide sidebar')}
            </motion.button>
          </div>
        </aside>
      )}

      {/* slim floating icon rail when sidebar hidden */}
      {!top && sideHidden && (
        <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }}
          onClick={(e) => { const el = e.target as HTMLElement; if (!el.closest('nav a')) toggleSideHidden(false); }}
          className="hidden lg:flex flex-col items-center sticky top-3 h-[calc(100vh-1.5rem)] w-[74px] my-3 ms-3 rounded-2xl glass z-40 py-3 shrink-0 rail"
          style={{ boxShadow: '0 0 0 1px rgba(56,189,248,.2), 0 18px 44px -20px rgba(0,0,0,.6)' }}>
          <div className="cursor-pointer rounded-xl hover:bg-white/5 transition-colors p-1"
            role="button" tabIndex={0} title={t('Show sidebar')}
            onClickCapture={(e) => { e.preventDefault(); toggleSideHidden(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSideHidden(false); } }}>
            <Logo collapsed />
          </div>
          <nav className="flex-1 w-full px-1.5 mt-3 space-y-1 overflow-y-auto">
            {NAV_GROUPS.map((g, gi) => (
              <div key={g.label}>
                {gi > 0 && <div className="flex justify-center py-1.5"><span className="w-1 h-1 rounded-full bg-cyan-400/60" style={{ boxShadow: '0 0 6px rgba(34,211,238,.8)' }} /></div>}
                <div className="space-y-1.5">{g.items.map(i => <NavItem key={i.to} to={i.to} label={i.label} collapsed />)}</div>
              </div>
            ))}
          </nav>
          <div className="pt-2 mt-2 border-t border-white/10 w-full flex flex-col items-center gap-3">
            <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-[11px] font-bold text-[#04121a] hover:scale-110 transition-transform" title={t('Profile')}>OP</Link>
            <motion.button whileTap={{ scale: .9 }} onClick={() => toggleSideHidden(false)}
              className="mx-1.5 mb-1 w-[calc(100%-12px)] flex items-center justify-center py-2.5 rounded-xl border border-cyan-400/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 hover:scale-105 cursor-pointer transition-all"
              aria-label={t('Show sidebar')} title={t('Show sidebar')}>
              <PanelLeftOpen size={17} />
            </motion.button>
          </div>
        </motion.aside>
      )}

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setDrawer(false)} />
            <motion.aside initial={{ x: '-110%' }} animate={{ x: 0 }} exit={{ x: '-110%' }} transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed top-0 start-0 h-full w-[280px] glass z-50 p-4 flex flex-col lg:hidden">
              <div className="flex items-center justify-between mb-4"><Logo /><button onClick={() => setDrawer(false)} aria-label={t('Close menu')} className="p-2 rounded-lg hover:bg-white/10 hover:rotate-90 transition-all cursor-pointer"><X size={18} /></button></div>
              <nav className="flex-1 overflow-y-auto space-y-5" onClick={() => setDrawer(false)}>
                {NAV_GROUPS.map(g => (
                  <div key={g.label}><div className="px-3 mb-2 text-[10px] font-semibold tracking-[.22em] uppercase text-slate-500">{t(g.label)}</div>
                    <div className="space-y-1">{g.items.map(i => <NavItem key={i.to} to={i.to} label={i.label} collapsed={false} />)}</div></div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* topbar */}
        <header className={clsx('sticky top-0 z-40 glass border-b border-white/10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform', hideBar && '-translate-y-[110%]')}>
          <div className={clsx('flex items-center gap-2 md:gap-3 px-3 md:px-6 h-[64px]', settings.searchPosition === 'center' && 'lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:[grid-template-areas:\'left_center_right\']')}>
            <button className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition cursor-pointer lg:[grid-area:left] lg:justify-self-start" onClick={() => setDrawer(true)} aria-label={t('Open navigation')}><Menu size={18} /></button>
            {settings.controlsPosition === 'start' && controlsGroup}
            <button onClick={() => setCommandPaletteOpen(true)} className="sm:hidden p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition" aria-label={t('Search')}><Search size={18} /></button>
            {settings.searchPosition !== 'start' && <div className={`hidden sm:block flex-1 ${settings.searchPosition === 'center' ? 'lg:hidden' : ''}`} aria-hidden />}
            <button onClick={() => setCommandPaletteOpen(true)} className={`hidden sm:flex w-full max-w-[240px] md:max-w-[320px] lg:max-w-md items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-slate-400 hover:border-cyan-400/40 hover:text-slate-200 hover:shadow-[0_0_20px_-8px_rgba(34,211,238,.5)] transition-all cursor-pointer ${settings.searchPosition === 'center' ? 'lg:[grid-area:center]' : ''}`}>
              <Search size={15} /><span className="flex-1 text-start">{t('Global search…')}</span>
              <kbd className="hidden xl:inline-flex items-center gap-1 text-[10px] bg-white/10 rounded-md px-1.5 py-0.5 font-mono2"><Command size={10} />K</kbd>
            </button>
            {settings.searchPosition !== 'end' && <div className={`hidden sm:block flex-1 ${settings.searchPosition === 'center' ? 'lg:hidden' : ''}`} aria-hidden />}
            <div className="flex-1 lg:hidden" aria-hidden />
            {settings.controlsPosition === 'end' && controlsGroup}
          </div>
          {top && <TopNav />}
        </header>

        {/* content */}
        <main className="shell-main flex-1 w-full px-3 md:px-6 py-6 md:py-10" key={loc.pathname}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}>
            <Outlet />
          </motion.div>
        </main>

        <footer className="border-t border-white/10 mt-8">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4">
              <div><Logo /><p className="text-xs text-slate-500 mt-3 max-w-[240px]">{t('Interactive Arabic platform for learning cybersecurity — explore tools, learn Linux commands, and practice in hands-on labs.')}</p></div>
              {[[t('Platform'), ['Commands', 'Tools', 'Labs']], [t('Workspace'), ['Bookmarks', 'Profile']], [t('General'), ['About', 'Settings']]].map(([h, links]) => (
                <div key={h as string}><div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-3">{h}</div>
                  <div className="space-y-2">{(links as string[]).map(l => <Link key={l} to={`/${l.toLowerCase().replace(' ', '-')}`} className="block text-sm text-slate-400 hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition-all w-fit"><span className="link-underline">{t(l)}</span></Link>)}</div></div>
              ))}
            </div>
            <div className="border-t border-white/5 py-4 text-center text-[11px] text-slate-600">{t('CyberKeep')} · {new Date().getFullYear()}</div>
        </footer>
      </div>

      <CommandPalette />
      <Toasts />
    </div>
  );
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, t } = useStore();
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const routes = useMemo(() => [
    ...NAV_GROUPS.flatMap(g => g.items.map(i => ({ ...i, group: g.label }))),
    { to: '/about', label: 'About', group: 'General' },
    { to: '/settings', label: 'Settings', group: 'General' },
    { to: '/login', label: 'Login', group: 'Auth' }, { to: '/register', label: 'Register', group: 'Auth' },
  ], []);
  const filtered = routes.filter(r => t(r.label).toLowerCase().includes(q.toLowerCase()) || r.label.toLowerCase().includes(q.toLowerCase()));
  if (!commandPaletteOpen) return null;
  return (
    <Modal open onClose={() => setCommandPaletteOpen(false)} title="Command palette">
      <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('Type a page…')} className={inputCls}
        onKeyDown={e => { if (e.key === 'Enter' && filtered[0]) { nav(filtered[0].to); setCommandPaletteOpen(false); } }} />
      <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
        {filtered.length === 0 && <div className="text-sm text-slate-500 p-3 text-center">{t('No matching page.')}</div>}
        {filtered.map(r => (
          <button key={r.to} onClick={() => { nav(r.to); setCommandPaletteOpen(false); setQ(''); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 hover:translate-x-1 rtl:hover:-translate-x-1 text-start cursor-pointer transition-all">
            <span className="text-slate-500">{ICONS[r.to] || <ChevronLeft size={15} />}</span>
            <span className="text-sm flex-1">{t(r.label)}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">{t(r.group)}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
