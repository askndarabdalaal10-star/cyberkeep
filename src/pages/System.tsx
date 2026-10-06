import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, ArrowLeft, Ghost, Loader2, RefreshCw } from 'lucide-react';
import { Btn, Card, Empty } from '../components/ui';
import { useStore } from '../lib/store';

export default function System({ page }: { page: '404' | '500' | 'error' | 'loading' }) {
  const { push, t } = useStore();
  if (page === 'loading') return <LoadingDemo />;
  const meta = {
    '404': { code: '404', title: 'Page not found', desc: 'The page you opened does not exist or has moved. Try one of these sections.' },
    '500': { code: '500', title: 'Server fault', desc: 'Something went wrong on our side. Try again in a moment.' },
    error: { code: 'ERR', title: 'Something looked off', desc: 'Something looked off. Retry or report the issue.' },
  }[page];
  return (
    <div className="max-w-2xl mx-auto text-center py-16 anim-rise">
      <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3.5, repeat: Infinity }} className="font-display text-[88px] md:text-[120px] font-bold leading-none bg-gradient-to-br from-cyan-300/80 to-violet-500/60 bg-clip-text text-transparent">{t(meta.code)}</motion.div>
      <h1 className="font-display text-2xl md:text-3xl font-bold mt-2">{t(meta.title)}</h1>
      <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">{t(meta.desc)}</p>
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <Btn to="/"><ArrowLeft size={14} className="rtl:rotate-180" /> {t('Back home')}</Btn>
        <Btn variant="outline" onClick={() => window.location.reload()}><RefreshCw size={14} /> {t('Retry')}</Btn>
        <Btn variant="outline" onClick={() => push({ title: 'Issue reported (mock)', kind: 'success' })}><AlertOctagon size={14} /> {t('Report')}</Btn>
      </div>
      <div className="mt-10 text-start"><Empty icon={<Ghost size={22} />} title="Helpful links" desc="Jump to a section from here." action={
        <div className="flex flex-wrap justify-center gap-2">{['/commands', '/tools', '/labs'].map(p => <Btn key={p} size="sm" variant="outline" to={p}>{p}</Btn>)}</div>} /></div>
    </div>
  );
}

function LoadingDemo() {
  const { t } = useStore();
  const [phase, setPhase] = useState(0);
  useEffect(() => { const id = setInterval(() => setPhase(p => (p + 1) % 4), 900); return () => clearInterval(id); }, []);
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card hover={false} className="text-center py-14">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} className="inline-block"><Loader2 size={28} className="text-cyan-300" /></motion.div>
        <h1 className="font-display text-xl font-semibold mt-4">{t('Loading interface…')}</h1>
        <p className="text-sm text-slate-500 mt-2">{t('Loading your content. Step')} {phase + 1} {t('of 4.')}</p>
        <div className="flex justify-center gap-1.5 mt-5">{[0, 1, 2, 3].map(i => <motion.span key={i} animate={{ scaleX: i <= phase ? 1 : .5, opacity: i <= phase ? 1 : .4 }} className={`h-1.5 rounded-full origin-start ${i <= phase ? 'w-8 bg-cyan-400' : 'w-4 bg-white/10'}`} />)}</div>
      </Card>
      <div className="grid md:grid-cols-3 gap-4 mt-4 stagger"><div className="skeleton h-32" /><div className="skeleton h-32" /><div className="skeleton h-32" /></div>
      <div className="text-center mt-6"><Link to="/" className="text-xs text-slate-500 hover:text-white transition-colors">{t('Continue →')}</Link></div>
    </div>
  );
}
