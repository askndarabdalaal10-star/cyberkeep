import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Fingerprint, MailCheck, ShieldCheck } from 'lucide-react';
import { Btn, inputCls } from '../components/ui';
import { Logo } from '../components/Layout';
import { useStore } from '../lib/store';
import Cyber3D from '../components/Cyber3D';

function Frame({ kicker, title, desc, children }: { kicker: string; title: string; desc: string; children: React.ReactNode }) {
  const { t } = useStore();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md anim-rise">
          <Logo />
          <div className="text-[11px] tracking-[.22em] uppercase text-cyan-300/80 mt-8 mb-3">{t(kicker)}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{t(title)}</h1>
          <p className="text-sm text-slate-400 mt-3 mb-8">{t(desc)}</p>
          {children}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white hover:gap-3 transition-all mt-8"><ArrowLeft size={13} className="rtl:rotate-180" /> {t('Back to home')}</Link>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden border-s border-white/10">
        <Cyber3D compact={false} className="absolute inset-0 [&>div]:!h-full" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="absolute bottom-8 left-8 right-8 glass rounded-2xl p-5 text-sm text-slate-300">
          {t('Secure sign-in for your workspace.')}
        </motion.div>
      </div>
    </div>
  );
}

export default function Auth({ page }: { page: 'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'twofactor' }) {
  const { push, t } = useStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const mock = (title: string) => push({ title, desc: 'Auth UI preview — no request sent', kind: 'success' });

  if (page === 'login') return (
    <Frame kicker="authentication · login" title="Welcome back" desc="Sign in to your account.">
      <div className="space-y-4">
        <div><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Email')}</div><input placeholder="you@example.com" className={inputCls} /></div>
        <div><div className="text-xs uppercase tracking-widest text-slate-500 mb-1.5">{t('Password')}</div><input type="password" placeholder="••••••••" className={inputCls} /></div>
        <Btn className="w-full" onClick={() => mock('Signed in (mock)')}>{t('Sign in')}</Btn>
        <div className="flex justify-between text-xs"><Link to="/forgot-password" className="text-cyan-300 hover:underline">{t('Forgot password?')}</Link><Link to="/register" className="text-slate-400 hover:text-white transition-colors">{t('Create account →')}</Link></div>
      </div>
    </Frame>
  );
  if (page === 'register') return (
    <Frame kicker="authentication · register" title="Create account" desc="Create your account in seconds.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3"><input placeholder={t('First name')} className={inputCls} aria-label={t('First name')} /><input placeholder={t('Last name')} className={inputCls} aria-label={t('Last name')} /></div>
        <input placeholder="you@example.com" className={inputCls} aria-label={t('Email')} />
        <input type="password" placeholder={t('Choose a password')} className={inputCls} aria-label={t('Password')} />
        <div className="flex gap-1">{[40, 25, 15, 20].map((w, i) => <motion.span key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .3 + i * .12 }} className="h-1 rounded-full bg-cyan-400/60 origin-start" style={{ width: `${w}%` }} />)}</div>
        <p className="text-[11px] text-slate-500">{t('Use 8+ characters with letters and numbers.')}</p>
        <Btn className="w-full" onClick={() => mock('Account created (mock)')}>{t('Create account')}</Btn>
        <div className="text-xs text-slate-400">{t('Have an account? ')}<Link to="/login" className="text-cyan-300 hover:underline">{t('Sign in →')}</Link></div>
      </div>
    </Frame>
  );
  if (page === 'forgot') return (
    <Frame kicker="authentication · recovery" title="Forgot password" desc="Enter your email to receive a reset link.">
      <input placeholder="you@example.com" className={inputCls} aria-label={t('Email')} />
      <Btn className="w-full mt-4" onClick={() => mock('Reset link sent (mock)')}>{t('Send reset link')}</Btn>
      <div className="text-xs text-slate-400 mt-4">{t('Remembered it? ')}<Link to="/login" className="text-cyan-300 hover:underline">{t('Back to login →')}</Link></div>
    </Frame>
  );
  if (page === 'reset') return (
    <Frame kicker="authentication · reset" title="Set new password" desc="Choose a new password and confirm it below.">
      <div className="space-y-4"><input type="password" placeholder={t('New password')} className={inputCls} aria-label={t('New password')} /><input type="password" placeholder={t('Confirm password')} className={inputCls} aria-label={t('Confirm password')} />
        <Btn className="w-full" onClick={() => mock('Password updated (mock)')}>{t('Update password')}</Btn></div>
    </Frame>
  );
  if (page === 'verify') return (
    <Frame kicker="authentication · verify" title="Verify email" desc="Enter the 6-digit code sent to your email.">
      <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-300 mb-2"><MailCheck size={22} /></motion.div>
      <div className="flex gap-2 my-5" dir="ltr">{code.map((c, i) => (
        <motion.input key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }} value={c} maxLength={1} inputMode="numeric" aria-label={`${t('Digit')} ${i + 1}`}
          onChange={e => setCode(cs => cs.map((x, j) => j === i ? e.target.value : x))}
          className="w-11 h-12 text-center rounded-xl bg-white/5 border border-white/10 font-mono2 focus:border-cyan-400/60 focus:scale-110 transition-all" />))}</div>
      <Btn className="w-full" onClick={() => mock('Email verified (mock)')}>{t('Verify')}</Btn>
      <button onClick={() => mock('Code resent')} className="text-xs text-slate-400 hover:text-white hover:scale-105 transition mt-4 cursor-pointer">{t('Resend code in 0:42')}</button>
    </Frame>
  );
  return (
    <Frame kicker="authentication · 2fa" title="Two-factor check" desc="Approve the sign-in from your second factor.">
      <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-300 mb-2"><Fingerprint size={22} /></motion.div>
      <div className="flex gap-2 my-5">{['App', 'SMS', 'Key'].map((m, i) => (
        <motion.button key={m} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }} onClick={() => mock(`${m} — ${t('challenge sent (mock)')}`)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs hover:bg-white/5 hover:border-white/25 hover:-translate-y-0.5 cursor-pointer transition-all">{t(m)}</motion.button>))}</div>
      <div className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={13} /> {t('Use your fingerprint or face on supported devices.')}</div>
      <Btn className="w-full mt-5" onClick={() => mock('Second factor approved (mock)')}>{t('Approve sign-in')}</Btn>
    </Frame>
  );
}
