import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BellRing, FlaskConical, TerminalSquare, Timer, Trophy } from 'lucide-react';
import { Badge, Btn, Card } from '../components/ui';
import { useStore } from '../lib/store';

/* Labs route is closed in this phase — under-development notice only. */
export default function Labs() {
  const { push, t, accent } = useStore();
  return (
    <div className="max-w-2xl mx-auto text-center py-8 md:py-14 anim-rise">
      <Badge tone="warn">Under development</Badge>
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mt-6 mb-5"
        style={{ background: accent.soft, color: accent.a, border: `1px solid ${accent.a}55`, boxShadow: `0 0 40px -8px ${accent.a}` }}
      >
        <FlaskConical size={32} />
      </motion.div>
      <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{t('Labs are under development')}</h1>
      <p className="text-sm md:text-base text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed">
        {t('The lab environments are still being built. Interactive sandboxes, terminals and scoring will unlock here in a later phase.')}
      </p>

      <Card hover={false} className="mt-8 text-start">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t('Coming soon')}</div>
        {[
          [<FlaskConical key="a" size={15} />, 'Isolated sandboxes'],
          [<TerminalSquare key="b" size={15} />, 'Web terminal'],
          [<Trophy key="c" size={15} />, 'Live scoring'],
          [<Timer key="d" size={15} />, 'Timed challenges'],
        ].map(([icon, label]) => (
          <div key={label as string} className="flex items-center gap-3 py-2.5 border-t border-white/5 first:border-0 text-sm">
            <span className="text-slate-500">{icon}</span>
            <span className="flex-1 text-slate-300">{t(label as string)}</span>
            <Badge>soon</Badge>
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <Btn to="/"><ArrowLeft size={14} className="rtl:rotate-180" /> {t('Back home')}</Btn>
        <Btn variant="outline" onClick={() => push({ title: 'Subscribed (mock)', desc: 'Labs launch notice (mock)', kind: 'success' })}>
          <BellRing size={14} /> {t('Notify me')}
        </Btn>
      </div>
      <Link to="/about#contact" className="inline-block mt-5 text-xs text-slate-500 hover:text-white transition-colors">{t('Questions? Contact us →')}</Link>
    </div>
  );
}
