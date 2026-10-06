import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '../lib/store';

/** Cyber Lab Core — calm, lightweight, interactive 3D. Falls back to 2D canvas. */
export default function Cyber3D({ compact = false, fill = false, className = '' }: { compact?: boolean; fill?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { settings } = useStore();
  const quality = settings.quality;
  const enabled = settings.threeD;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    const w = fill ? window.innerWidth : (el.clientWidth || 600);
    const h = fill ? window.innerHeight : compact ? 320 : (el.clientHeight || 480);

    // 2D fallback
    const fallback2D = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.style.width = '100%'; c.style.height = '100%';
      el.appendChild(c);
      const ctx = c.getContext('2d');
      if (!ctx) return () => {};
      let raf = 0; let t = 0;
      const nodes = Array.from({ length: 26 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
      const draw = () => {
        t += .01;
        ctx.fillStyle = 'rgba(5,8,15,.28)'; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(34,211,238,.14)';
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]; const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) { ctx.globalAlpha = (1 - d / 140) * .5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.globalAlpha = 1;
        nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; ctx.fillStyle = 'rgba(34,211,238,.8)'; ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, 7); ctx.fill(); });
        ctx.strokeStyle = 'rgba(139,92,246,.5)'; ctx.beginPath(); ctx.arc(w / 2, h / 2, 70 + Math.sin(t * 2) * 6, 0, 7); ctx.stroke();
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(raf);
    };

    if (!enabled) return fallback2D();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: quality === 'high', alpha: true });
    } catch { return fallback2D(); }

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, .1, 100);
    camera.position.set(0, 1.2, 7);

    const accent = new THREE.Color('#22d3ee');
    const accent2 = new THREE.Color('#8b5cf6');

    // core
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), new THREE.MeshStandardMaterial({ color: '#0b1526', metalness: .7, roughness: .3, flatShading: true }));
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: .55 }));
    const glow = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .05, wireframe: true }));
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, .012, 8, 90), new THREE.MeshBasicMaterial({ color: accent2, transparent: true, opacity: .6 }));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, .008, 8, 90), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .35 }));
    ring1.rotation.x = Math.PI / 2.4; ring2.rotation.x = Math.PI / 1.8; ring2.rotation.y = .5;
    scene.add(core, wire, glow, ring1, ring2);

    // nodes
    const N = quality === 'high' ? 26 : 12;
    const nodeGeo = new THREE.SphereGeometry(.06, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: accent });
    const nodes: THREE.Mesh[] = [];
    const nodePos: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const m = new THREE.Mesh(nodeGeo, nodeMat);
      const v = new THREE.Vector3().setFromSphericalCoords(2.4 + Math.random() * 1.2, Math.acos(2 * Math.random() - 1), Math.random() * Math.PI * 2);
      m.position.copy(v); nodes.push(m); nodePos.push(v); scene.add(m);
    }
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(N * 2 * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: .18 })));

    // particles
    const P = quality === 'high' ? 320 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) { pArr[i * 3] = (Math.random() - .5) * 12; pArr[i * 3 + 1] = (Math.random() - .5) * 7; pArr[i * 3 + 2] = (Math.random() - .5) * 6 - 1; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: '#7dd3fc', size: .02, transparent: true, opacity: .6 })));

    scene.add(new THREE.AmbientLight('#ffffff', .7));
    const pl = new THREE.PointLight(accent, 30, 20); pl.position.set(3, 4, 4); scene.add(pl);
    const pl2 = new THREE.PointLight(accent2, 20, 20); pl2.position.set(-4, -2, 2); scene.add(pl2);

    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 1.4;
      ty = ((e.clientY - r.top) / r.height - .5) * 1.0;
    };
    window.addEventListener('pointermove', onMove);

    const reduced = settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0; const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      const sp = reduced ? .03 : .36;
      const pulse = 1 + Math.sin(t * 1.7) * .022;
      core.scale.setScalar(pulse); wire.scale.setScalar(pulse); glow.scale.setScalar(1 + Math.sin(t * 1.1) * .03);
      core.rotation.y += sp * .02; core.rotation.x += sp * .008;
      wire.rotation.copy(core.rotation); glow.rotation.y -= sp * .01;
      ring1.rotation.z += sp * .02; ring2.rotation.z -= sp * .014;
      nodes.forEach((m, i) => { m.position.y = nodePos[i].y + Math.sin(t * .8 + i) * .12; });
      const pos = lineGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < N; i++) {
        const a = i === 0 ? new THREE.Vector3(0, 0, 0) : nodes[i - 1].position;
        const b = nodes[i].position;
        pos.setXYZ(i * 2, a.x, a.y, a.z); pos.setXYZ(i * 2 + 1, b.x, b.y, b.z);
      }
      pos.needsUpdate = true;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      camera.position.x = mx * 1.4; camera.position.y = 1.2 - my; camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const nw = fill ? window.innerWidth : el.clientWidth, nh = fill ? window.innerHeight : compact ? 320 : el.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); renderer.dispose(); el.innerHTML = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, quality, compact, fill, settings.reduceMotion]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div ref={ref} style={{ width: '100%', height: fill ? '100vh' : compact ? 320 : 480 }} aria-hidden={!enabled} role="img" aria-label="Cyber Lab 3D core visualization" />
      {!enabled && !fill && <div className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full glass text-slate-300">2D fallback · 3D disabled</div>}
    </div>
  );
}
