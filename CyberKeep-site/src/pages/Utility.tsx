import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Heart, Mail, Send, User } from 'lucide-react';
import { Badge, BookmarkBtn, Btn, Card, CardsGrid, PageHeader, SectionTitle, inputCls } from '../components/ui';
import { useStore } from '../lib/store';

/* bookmarks + profile + about (with contact inside) */
export default function Utility({ page }: { page: 'bookmarks' | 'profile' | 'about' }) {
  if (page === 'bookmarks') return <BookmarksPage />;
  if (page === 'profile') return <ProfilePage />;
  return <AboutPage />;
}

function BookmarksPage() {
  const { bookmarks, favorites, t } = useStore();
  return (
    <div>
      <PageHeader kicker="workspace" title="Bookmarks" desc="Locally stored bookmarks and favorites. Toggle them from any command or tool card — they persist in this browser." />
      <CardsGrid cols="lg:grid-cols-2" className="stagger">
        <Card>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold"><Bookmark size={15} /> {t('Bookmarks')} ({bookmarks.length})</div>
          {bookmarks.length === 0 ? <p className="text-sm text-slate-500">{t('No bookmarks yet. Tap the bookmark icon on any item.')}</p> :
            <div className="space-y-2">{bookmarks.map(b => <div key={b} className="row-hover flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-mono2 hover:border-white/25 transition-colors">{b}<span className="ms-auto"><BookmarkBtn id={b} /></span></div>)}</div>}
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold"><Heart size={15} /> {t('Favorites')} ({favorites.length})</div>
          {favorites.length === 0 ? <p className="text-sm text-slate-500">{t('No favorites yet. Tap the heart icon on any item.')}</p> :
            <div className="space-y-2">{favorites.map(b => <div key={b} className="row-hover flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-mono2 hover:border-white/25 transition-colors">{b}<span className="ms-auto"><BookmarkBtn id={b} /></span></div>)}</div>}
        </Card>
      </CardsGrid>
    </div>
  );
}

function ProfilePage() {
  const { push, bookmarks, favorites, t } = useStore();
  return (
    <div>
      <PageHeader kicker="account" title="Profile" desc="Manage your public profile details." />
      <div className="grid lg:grid-cols-3 gap-4 stagger">
        <Card className="lg:col-span-1 text-center">
          <motion.div whileHover={{ scale: 1.06, rotate: 2 }} className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center font-display font-bold text-xl text-[#04121a]">OP</motion.div>
          <h2 className="font-display font-semibold text-lg mt-4">{t('Operator')}</h2>
          <p className="text-xs text-slate-500">{t('Member since —')}</p>
          <div className="flex justify-center gap-2 mt-3"><Badge>{bookmarks.length} {t('bookmarks')}</Badge><Badge>{favorites.length} {t('favorites')}</Badge></div>
          <Btn size="sm" variant="outline" className="mt-4" onClick={() => push({ title: 'Avatar upload disabled (mock)', kind: 'info' })}>{t('Change avatar')}</Btn>
        </Card>
        <Card className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {[[t('Display name'), t('Operator')], [t('Handle'), '@operator'], [t('Email'), 'operator@example.invalid'], [t('Location'), t('—')]].map(([l, v]) => (
              <div key={l}><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{l}</div>
                <input defaultValue={v} className={inputCls} aria-label={l} /></div>))}
          </div>
          <div className="mt-4"><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Bio')}</div>
            <textarea rows={3} placeholder={t('Write a short bio…')} className={inputCls} aria-label={t('Bio')} /></div>
          <div className="flex gap-2 mt-5">
            <Btn size="sm" onClick={() => push({ title: 'Profile saved (mock)', desc: 'No backend call made', kind: 'success' })}>{t('Save changes')}</Btn>
            <Btn size="sm" variant="outline" onClick={() => push({ title: 'Changes discarded (mock)', kind: 'info' })}>{t('Discard')}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AboutPage() {
  const { push, t } = useStore();
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash === '#contact') {
      const id = setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
      return () => clearTimeout(id);
    }
  }, [loc.hash]);
  return (
    <div>
      <PageHeader kicker="project" title="About CyberKeep" desc="CyberKeep is an interactive cybersecurity platform with commands, tools and labs." />
      <CardsGrid cols="md:grid-cols-3" className="stagger">
        {[[t('01 · Interface'), t('Design system, glass panels, calm glow, grid backgrounds and reusable components.')], [t('02 · Experience'), t('Routing, empty/loading/error states, toasts, modals, command palette and live settings.')], [t('03 · Practice'), t('Apply commands and tools in guided practice.')]].map(([title, d]) => (
          <Card key={title}><div className="font-display font-semibold mb-2">{title}</div><p className="text-sm text-slate-400">{d}</p></Card>))}
      </CardsGrid>
      <Card className="mt-4"><div className="text-sm font-semibold mb-2 flex items-center gap-2"><User size={15} /> {t('Platform contents')}</div>
        <p className="text-sm text-slate-400">{t('Command syntax with examples, auditing tools with install guides, and labs on the way.')}</p></Card>

      {/* contact lives inside about */}
      <div id="contact" className="scroll-mt-24 mt-12">
        <SectionTitle kicker="support" title="Contact" desc="Send us a message using the form below." />
        <div className="grid lg:grid-cols-3 gap-4 stagger">
          <Card className="lg:col-span-2" hover={false}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Name')}</div><input placeholder={t('Your name')} className={inputCls} aria-label={t('Name')} /></div>
              <div><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Email')}</div><input placeholder="you@example.com" className={inputCls} aria-label={t('Email')} /></div>
            </div>
            <div className="mt-4"><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Topic')}</div>
              <select className={inputCls} aria-label={t('Topic')}>{[t('General question'), t('Interface feedback'), t('Accessibility'), t('Other')].map(o => <option key={o} className="bg-slate-900">{o}</option>)}</select></div>
            <div className="mt-4"><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Message')}</div>
              <textarea rows={5} placeholder={t('Write your message…')} className={inputCls} aria-label={t('Message')} /></div>
            <Btn className="mt-5" onClick={() => push({ title: 'Message queued (mock)', desc: 'Form preview only — nothing sent', kind: 'success' })}><Send size={14} className="rtl:rotate-180 rtl:scale-x-[-1]" /> {t('Send message')}</Btn>
          </Card>
          <Card>
            <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Mail size={15} /> {t('Other channels')}</div>
            {[[t('Email'), 'hello@example.invalid'], [t('Status'), t('All systems nominal')], [t('Response time'), t('—')]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-2 border-t border-white/5 first:border-0"><span className="text-slate-500">{k}</span><span className="font-mono2 text-xs">{v}</span></div>))}
          </Card>
        </div>
      </div>
    </div>
  );
}
