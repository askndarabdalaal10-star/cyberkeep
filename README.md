# CyberKeep 🛡️

> **Interactive Arabic platform for learning cybersecurity — explore tools, learn Linux commands, and practice in hands-on labs.**
> **منصة عربية تفاعلية لتعلم الأمن السيبراني.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.172-black?logo=threedotjs&logoColor=white)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Overview

**CyberKeep** is a dark, futuristic, bilingual (Arabic / English) cybersecurity learning interface built with **React + TypeScript + Tailwind CSS + Three.js**. It features a live 3D background, full RTL support, deep interface customization, and real starter content: **10 essential Linux commands** and **10 professional auditing tools**.

---

## 🚀 Features

### 📚 Content
| Area | Status |
|---|---|
| **Commands** | ✅ 10 essential Linux commands (`pwd`, `ls`, `cd`, …) with syntax, examples & explanations |
| **Tools** | ✅ 10 auditing tools (`nmap`, `wireshark`, `metasploit`, …) with install/run guides |
| **Labs** | 🛠️ Under development (isolated sandboxes coming soon) |

### 🎨 Interface
- 🌙 **Dark / Light themes** with auto-tuned accent palette for perfect contrast
- 🌍 **Arabic (RTL) / English (LTR)** full interface translation, one-click switch in the top bar
- 🧊 **Glassmorphism** panels, ambient orbs, grid backdrop & glow system
- 🌀 **Global Three.js background** — interactive Cyber Lab core, mouse-reactive, with 2D fallback
- 🧭 **Sidebar ↔ Top navbar** switchable navigation with animated active indicator
- ⚙️ **Deep customization**: card styles (glass/solid/bordered/minimal), grid/list layouts, content width, corner radius, glow intensity, backdrop blur, animations, motion, fonts & density
- ⌨️ **Command palette** (`Ctrl K`), notifications center, toasts, modals & empty states
- 📱 **Fully responsive** — desktop, tablet & mobile with drawer navigation

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript** + **React Router**
- **Tailwind CSS 4** + **Framer Motion** + **Lucide icons**
- **Three.js** (raw WebGL, zero wrapper overhead)
- **Vite 6** build tooling, `localStorage` persistence (no backend)

---

## ⚡ Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Type-check + production build
npm run build

# 4. Preview the production build (http://localhost:4173)
npm run preview
```

---

## 📁 Project Structure

```
CyberKeep/
├── index.html              # Entry HTML (fonts, title, meta)
├── vite.config.ts          # Vite + Tailwind configuration
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Routes (lazy-loaded pages)
│   ├── index.css           # Design system, themes, animations
│   ├── lib/
│   │   ├── store.tsx       # Global UI store (settings, toasts, bookmarks)
│   │   └── i18n.ts         # Arabic ⇄ English dictionary (~500 keys)
│   ├── components/
│   │   ├── Layout.tsx      # Sidebar / topbar / footer / palette
│   │   ├── Cyber3D.tsx     # Three.js background scene
│   │   └── ui.tsx          # Reusable Button, Card, Modal, Badge…
│   └── pages/
│       ├── Home.tsx        # Hero, search, modules & previews
│       ├── Library.tsx     # Commands & tools catalog + detail card
│       ├── ToolDetail.tsx  # Full tool page (install/run/features)
│       ├── Labs.tsx        # Under-development notice
│       ├── Utility.tsx     # Bookmarks, profile, about (+contact)
│       ├── Settings.tsx    # Live interface controls
│       ├── Auth.tsx        # Login/register/recovery/2FA mockups
│       └── System.tsx      # 404 / 500 / error / loading states
└── dist/                   # Production build output
```

---

## 🗺️ Routes

| Route | Page |
|---|---|
| `/` | Home — hero, search, modules, previews |
| `/commands` | 10 Linux commands + detail cards |
| `/tools` | 10 auditing tools catalog |
| `/tools/:id` | Full tool page (install, run, features) |
| `/labs` | Under-development notice |
| `/bookmarks` `/profile` | Personal workspace |
| `/settings` | Appearance, topbar, motion, 3D, language |
| `/about` | About + contact section (`#contact`) |
| `/login` `/register` `/forgot-password` `/reset-password` `/verify-email` `/two-factor` | Auth UI mockups |
| `/404` `/500` `/error` `/loading` | System states |

---

## ⚠️ Responsible Use

The auditing tools catalog is for **learning and authorized testing only**. Never run security tools against systems you do not own or lack explicit written permission to test. The interface shows an authorization notice wherever tools are listed.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.
