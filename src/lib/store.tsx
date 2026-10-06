import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tr } from './i18n';

/* ---------- types ---------- */
export type Theme = 'dark' | 'light';
export type Accent = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type FontSize = 'small' | 'medium' | 'large';

export interface UISettings {
  theme: Theme;
  accent: Accent;
  density: Density;
  fontSize: FontSize;
  animations: boolean;
  threeD: boolean;
  quality: 'high' | 'low';
  reduceMotion: boolean;
  language: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  navPosition: 'side' | 'top';
  searchPosition: 'start' | 'center' | 'end';
  controlsPosition: 'start' | 'end';
  cardLayout: 'grid' | 'list';
  cardStyle: 'glass' | 'solid' | 'bordered' | 'minimal';
  contentWidth: 'narrow' | 'comfortable' | 'wide';
  radius: 'rounded' | 'sharp' | 'large';
  glow: 'normal' | 'strong' | 'off';
  blur: boolean;
}

export interface Toast { id: number; title: string; desc?: string; kind?: 'info' | 'success' | 'warn' | 'error'; }

const ACCENTS: Record<Accent, { a: string; b: string; soft: string }> = {
  cyan: { a: '#22d3ee', b: '#8b5cf6', soft: 'rgba(34,211,238,.14)' },
  violet: { a: '#8b5cf6', b: '#22d3ee', soft: 'rgba(139,92,246,.16)' },
  emerald: { a: '#34d399', b: '#22d3ee', soft: 'rgba(52,211,153,.14)' },
  amber: { a: '#fbbf24', b: '#fb7185', soft: 'rgba(251,191,36,.14)' },
  rose: { a: '#fb7185', b: '#8b5cf6', soft: 'rgba(251,113,133,.14)' },
};

/* darker variants keep contrast on light backgrounds */
const ACCENTS_LIGHT: Record<Accent, { a: string; b: string; soft: string }> = {
  cyan: { a: '#0e7490', b: '#7c3aed', soft: 'rgba(8,145,178,.12)' },
  violet: { a: '#7c3aed', b: '#22d3ee', soft: 'rgba(124,58,237,.12)' },
  emerald: { a: '#047857', b: '#22d3ee', soft: 'rgba(5,150,105,.12)' },
  amber: { a: '#b45309', b: '#fb7185', soft: 'rgba(217,119,6,.12)' },
  rose: { a: '#be123c', b: '#8b5cf6', soft: 'rgba(225,29,72,.12)' },
};

/* ---------- store ---------- */
interface Store {
  settings: UISettings;
  setSettings: (p: Partial<UISettings>) => void;
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
  bookmarks: string[];
  favorites: string[];
  toggleBookmark: (id: string) => void;
  toggleFavorite: (id: string) => void;
  accent: { a: string; b: string; soft: string };
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  t: (s: string) => string;
}

const Ctx = createContext<Store | null>(null);

const DEFAULTS: UISettings = { theme: 'dark', accent: 'cyan', density: 'comfortable', fontSize: 'medium', animations: true, threeD: true, quality: 'high', reduceMotion: false, language: 'en', dir: 'ltr', navPosition: 'side', searchPosition: 'center', controlsPosition: 'end', cardLayout: 'grid', cardStyle: 'glass', contentWidth: 'comfortable', radius: 'rounded', glow: 'normal', blur: true };

function load(): UISettings {
  try {
    const raw = localStorage.getItem('cyberlab-ui');
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULTS;
}

let toastId = 1;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setS] = useState<UISettings>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('cyberlab-bookmarks') || '[]'); } catch { return []; } });
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('cyberlab-favorites') || '[]'); } catch { return []; } });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const setSettings = useCallback((p: Partial<UISettings>) => setS(s => ({ ...s, ...p })), []);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastId++;
    setToasts(ts => [...ts, { ...t, id }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 3800);
  }, []);
  const dismiss = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(b => { const n = b.includes(id) ? b.filter(x => x !== id) : [...b, id]; localStorage.setItem('cyberlab-bookmarks', JSON.stringify(n)); return n; });
  }, []);
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(b => { const n = b.includes(id) ? b.filter(x => x !== id) : [...b, id]; localStorage.setItem('cyberlab-favorites', JSON.stringify(n)); return n; });
  }, []);

  useEffect(() => {
    localStorage.setItem('cyberlab-ui', JSON.stringify(settings));
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.classList.toggle('light', settings.theme === 'light');
    root.setAttribute('data-density', settings.density);
    root.setAttribute('data-cardstyle', settings.cardStyle);
    root.setAttribute('data-contentwidth', settings.contentWidth);
    root.setAttribute('data-radius', settings.radius);
    root.setAttribute('data-glow', settings.glow);
    root.setAttribute('data-blur', settings.blur ? 'on' : 'off');
    root.setAttribute('data-fontsize', settings.fontSize);
    root.setAttribute('data-animations', settings.animations && !settings.reduceMotion ? 'on' : 'off');
    root.setAttribute('dir', settings.dir);
    root.setAttribute('lang', settings.language);
  }, [settings]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) setS(s => ({ ...s, reduceMotion: true }));
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandPaletteOpen(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const accent = settings.theme === 'light' ? ACCENTS_LIGHT[settings.accent] : ACCENTS[settings.accent];
  const t = useCallback((s: string) => tr(settings.language, s), [settings.language]);
  const value = useMemo(() => ({ settings, setSettings, toasts, push, dismiss, bookmarks, favorites, toggleBookmark, toggleFavorite, accent, commandPaletteOpen, setCommandPaletteOpen, t }), [settings, setSettings, toasts, push, dismiss, bookmarks, favorites, toggleBookmark, toggleFavorite, accent, commandPaletteOpen, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('store missing');
  return v;
}

/* ---------- placeholder data (no real educational content) ---------- */
export interface Item { id: string; name: string; category: string; desc: string; tags: string[]; updated: string; level?: string; duration?: string; status?: 'idle' | 'running' | 'done' | 'error'; progress?: number; usage?: string; example?: string; exampleExplained?: string; exampleOutput?: string; install?: string; runCmd?: string; overview?: string; features?: string[]; author?: string; license?: string; platform?: string; }

const CATS = ['Network', 'Web', 'Forensics', 'Crypto', 'System', 'Cloud'];
const pick = (arr: string[], i: number) => arr[i % arr.length];

/* Ten essential Linux system commands (basic shell literacy, no tooling). */
export function makeCommands(): Item[] {
  return [
    { id: 'cmd-pwd', name: 'pwd', category: 'System', level: 'Intro', tags: ['navigation', 'basics'], updated: '—',
      desc: 'Print the full path of the directory you are currently working in.',
      usage: 'pwd', example: 'pwd',
      exampleExplained: 'Shows the full path of your current folder, so you always know where you are.',
      exampleOutput: '/home/user/documents' },
    { id: 'cmd-ls', name: 'ls', category: 'System', level: 'Intro', tags: ['files', 'basics'], updated: '—',
      desc: 'List the files and folders inside the current directory.',
      usage: 'ls', example: 'ls',
      exampleExplained: 'Lists everything in the current folder by name.',
      exampleOutput: 'documents  photos  notes.txt' },
    { id: 'cmd-cd', name: 'cd', category: 'System', level: 'Intro', tags: ['navigation', 'basics'], updated: '—',
      desc: 'Change from one directory to another.',
      usage: 'cd <folder>', example: 'cd documents',
      exampleExplained: 'Moves you into the “documents” folder; your next commands run there.',
      exampleOutput: '~/documents' },
    { id: 'cmd-echo', name: 'echo', category: 'System', level: 'Intro', tags: ['terminal', 'basics'], updated: '—',
      desc: 'Print text to the terminal.',
      usage: 'echo <text>', example: 'echo hello',
      exampleExplained: 'Displays the word “hello” on the screen.',
      exampleOutput: 'hello' },
    { id: 'cmd-cat', name: 'cat', category: 'System', level: 'Intro', tags: ['files', 'basics'], updated: '—',
      desc: 'Display the contents of a file.',
      usage: 'cat <file>', example: 'cat notes.txt',
      exampleExplained: 'Prints the full text stored inside “notes.txt” to the screen.',
      exampleOutput: 'hello world' },
    { id: 'cmd-touch', name: 'touch', category: 'System', level: 'Intro', tags: ['files', 'basics'], updated: '—',
      desc: 'Create a new empty file.',
      usage: 'touch <file>', example: 'touch notes.txt',
      exampleExplained: 'Creates an empty file called “notes.txt” in the current directory.',
      exampleOutput: 'notes.txt' },
    { id: 'cmd-mkdir', name: 'mkdir', category: 'System', level: 'Core', tags: ['files', 'folders'], updated: '—',
      desc: 'Create a new empty directory.',
      usage: 'mkdir <name>', example: 'mkdir photos',
      exampleExplained: 'Creates a new folder called “photos” inside the current directory.',
      exampleOutput: 'photos/' },
    { id: 'cmd-cp', name: 'cp', category: 'System', level: 'Core', tags: ['files', 'copy'], updated: '—',
      desc: 'Copy a file to a new location or name.',
      usage: 'cp <source> <copy>', example: 'cp notes.txt backup.txt',
      exampleExplained: 'Makes a duplicate called “backup.txt” while keeping the original.',
      exampleOutput: 'backup.txt' },
    { id: 'cmd-mv', name: 'mv', category: 'System', level: 'Core', tags: ['files', 'rename'], updated: '—',
      desc: 'Move a file or rename it.',
      usage: 'mv <old> <new>', example: 'mv draft.txt final.txt',
      exampleExplained: 'Renames “draft.txt” to “final.txt” in the same folder.',
      exampleOutput: 'final.txt' },
    { id: 'cmd-rm', name: 'rm', category: 'System', level: 'Core', tags: ['files', 'delete'], updated: '—',
      desc: 'Delete a file permanently.',
      usage: 'rm <file>', example: 'rm temp.txt',
      exampleExplained: 'Deletes “temp.txt”. In real use this cannot be undone, so double-check the name first.',
      exampleOutput: '(no output — file removed)' },
  ];
}
/* Ten professional security-auditing tools (lab scope only — see authorization notice in UI). */
export function makeTools(): Item[] {
  return [
    { id: 'tool-nmap', name: 'nmap', category: 'Network', level: 'Core', tags: ['scan', 'network'], updated: '—',
      desc: 'Map hosts and open services on networks you are authorized to audit.',
      install: 'sudo apt install nmap', runCmd: 'nmap 192.0.2.0/24',
      overview: 'Nmap discovers which devices and services are reachable inside a lab network you own, the first step of any authorized audit.',
      features: ['Discover live hosts in a lab range.', 'List open ports and services.', 'Detect operating systems and versions.'],
      author: 'Gordon Lyon', license: 'NPSL', platform: 'Cross-platform' },
    { id: 'tool-wireshark', name: 'wireshark', category: 'Network', level: 'Core', tags: ['packets', 'analysis'], updated: '—',
      desc: 'Capture and inspect your own network traffic packet by packet.',
      install: 'sudo apt install wireshark', runCmd: 'wireshark',
      overview: 'Wireshark records traffic on your own interface so you can study how protocols behave in your lab.',
      features: ['Capture live traffic on your interface.', 'Filter packets by protocol or address.', 'Follow full TCP conversations.'],
      author: 'Gerald Combs', license: 'GPL', platform: 'Cross-platform' },
    { id: 'tool-burp', name: 'burpsuite', category: 'Web', level: 'Core', tags: ['web', 'proxy'], updated: '—',
      desc: 'Intercept and review requests from your own browser to your own apps.',
      install: 'sudo apt install burpsuite', runCmd: 'burpsuite',
      overview: 'Burp Suite routes your own browser traffic through a proxy so you can inspect what your lab apps send.',
      features: ['Inspect requests from your own browser.', 'Replay requests to your lab server.', 'Map the pages of your own app.'],
      author: 'PortSwigger', license: 'Commercial', platform: 'Cross-platform' },
    { id: 'tool-metasploit', name: 'metasploit', category: 'System', level: 'Core', tags: ['framework', 'lab'], updated: '—',
      desc: 'Industry testing framework for authorized exercises in isolated labs.',
      install: 'sudo apt install metasploit-framework', runCmd: 'msfconsole',
      overview: 'Metasploit organizes security checks in one console; professionals use it strictly inside authorized lab scopes.',
      features: ['Browse audit modules by keyword.', 'Read module documentation offline.', 'Practice console workflow safely.'],
      author: 'Rapid7', license: 'BSD', platform: 'Cross-platform' },
    { id: 'tool-john', name: 'john', category: 'System', level: 'Core', tags: ['passwords', 'audit'], updated: '—',
      desc: 'Audit password strength using hashes you own.',
      install: 'sudo apt install john', runCmd: 'john --wordlist=list.txt hash.txt',
      overview: 'John tests password hashes from your own systems to reveal weak choices before attackers do.',
      features: ['Test hashes you own against lists.', 'Measure real password strength.', 'Report weak credentials to fix.'],
      author: 'Openwall', license: 'GPL', platform: 'Cross-platform' },
    { id: 'tool-hydra', name: 'hydra', category: 'Network', level: 'Core', tags: ['login', 'audit'], updated: '—',
      desc: 'Audit login resilience on services you are authorized to test.',
      install: 'sudo apt install hydra', runCmd: 'hydra -l admin -P list.txt 192.0.2.10 ssh',
      overview: 'Hydra measures whether your own lab logins resist guessing, strictly within authorized scope.',
      features: ['Test your own lab login pages.', 'Enforce lockout policies you set.', 'Document weak default credentials.'],
      author: 'THC', license: 'AGPL', platform: 'Cross-platform' },
    { id: 'tool-sqlmap', name: 'sqlmap', category: 'Web', level: 'Core', tags: ['database', 'audit'], updated: '—',
      desc: 'Detect database flaws in web apps you own.',
      install: 'sudo apt install sqlmap', runCmd: 'sqlmap -u "http://example.com/page?id=1" --batch',
      overview: 'sqlmap probes web addresses of your own lab apps for database weaknesses, with your explicit authorization.',
      features: ['Probe your own lab URLs safely.', 'Confirm flaws before reporting.', 'Suggest fixes for your developers.'],
      author: 'Bernardo Damele', license: 'GPL', platform: 'Cross-platform' },
    { id: 'tool-aircrack', name: 'aircrack', category: 'Network', level: 'Core', tags: ['wifi', 'audit'], updated: '—',
      desc: 'Analyze wireless captures recorded from your own network.',
      install: 'sudo apt install aircrack-ng', runCmd: 'aircrack-ng capture.cap',
      overview: 'Aircrack-ng examines capture files from your own access point to evaluate its configuration.',
      features: ['Review captures from your own AP.', 'Check encryption settings in use.', 'Document findings for hardening.'],
      author: 'Thomas dOtreppe', license: 'GPL', platform: 'Cross-platform' },
    { id: 'tool-nikto', name: 'nikto', category: 'Web', level: 'Intro', tags: ['scanner', 'web'], updated: '—',
      desc: 'Scan web servers you own for known misconfigurations.',
      install: 'sudo apt install nikto', runCmd: 'nikto -h http://example.com',
      overview: 'Nikto checks your own web server against a database of known risky defaults.',
      features: ['Flag outdated server software.', 'Spot dangerous default files.', 'Export a checklist to fix.'],
      author: 'Chris Sullo', license: 'GPL', platform: 'Cross-platform' },
    { id: 'tool-theharvester', name: 'theharvester', category: 'Web', level: 'Intro', tags: ['osint', 'passive'], updated: '—',
      desc: 'Gather public information about a domain passively.',
      install: 'sudo apt install theharvester', runCmd: 'theHarvester -d example.com -b google',
      overview: 'theHarvester collects only publicly visible data about a domain without touching its servers.',
      features: ['Find public emails and hosts.', 'Use only passive public sources.', 'Map exposure before hardening.'],
      author: 'laramies', license: 'GPL', platform: 'Cross-platform' },
  ];
}
export function makeLabs(n = 9): Item[] {
  const st: Item['status'][] = ['idle', 'running', 'done', 'error'];
  return Array.from({ length: n }, (_, i) => ({
    id: `lab-${i + 1}`,
    name: `Lab environment ${String(i + 1).padStart(2, '0')}`,
    category: pick(CATS, i + 3),
    desc: 'Isolated sandbox placeholder. Start / Stop / Reset are visual only.',
    tags: ['sandbox', 'placeholder'],
    updated: '—',
    duration: '—',
    level: pick(['Guided', 'Open', 'Challenge'], i),
    status: st[i % st.length],
    progress: [0, 35, 80, 100, 12, 55, 0, 90, 20][i % 9],
  }));
}

export const NAV_GROUPS = [
  { label: 'Platform', items: [
    { to: '/', label: 'Home' },
    { to: '/commands', label: 'Commands' },
    { to: '/tools', label: 'Tools' },
    { to: '/labs', label: 'Labs' },
  ]},
  { label: 'Workspace', items: [
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/profile', label: 'Profile' },
  ]},
  { label: 'General', items: [
    { to: '/about', label: 'About' },
    { to: '/settings', label: 'Settings' },
  ]},
];
