import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import config from '../config';
import { DiamondRule, Garland, Kicker } from './Ornaments';
import Reveal from './Reveal';

const REVEAL_AT = 0.45;
const WINDOW_SEED = { x: 0.5, y: 0.61 }; // a point inside the frame's empty window
const WINDOW_WHITE = 236; // min channel value counted as the window's white
const PETAL_COUNT = 34;
const PETAL_COLORS = ['#E9B8B3', '#F3CFC9', '#D99A98', '#B9787A', '#C9A25E', '#E2C27E'];

function paintFoil(ctx, w, h) {
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, '#F4DCD6');
  base.addColorStop(0.45, '#E8BFBA');
  base.addColorStop(1, '#F6E3DD');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const sheen = ctx.createLinearGradient(0, h, w, 0);
  sheen.addColorStop(0.2, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.42, 'rgba(255,255,255,0.6)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  sheen.addColorStop(0.58, 'rgba(255,255,255,0.45)');
  sheen.addColorStop(0.8, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  const golds = ['#C9A25E', '#E2C27E', '#B8893F', '#F1DCA6'];
  const dots = Math.round((w * h) / 70);
  for (let i = 0; i < dots; i++) {
    ctx.globalAlpha = 0.45 + Math.random() * 0.55;
    ctx.fillStyle = golds[i % golds.length];
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 0.35 + Math.random() * 1.05, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// A burst of petals thrown up from `origin` that then tumble down the screen.
function PetalRain({ origin, onDone }) {
  const petals = useMemo(() => {
    const vh = window.innerHeight;
    return Array.from({ length: PETAL_COUNT }, (_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
      const speed = 120 + Math.random() * 190;
      const upX = Math.cos(angle) * speed;
      const upY = Math.sin(angle) * speed;
      const drift = (Math.random() - 0.5) * 180;
      const fall = vh - origin.y + 60 + Math.random() * 40;
      return {
        id: i,
        color: PETAL_COLORS[i % PETAL_COLORS.length],
        size: 9 + Math.random() * 11,
        x: [0, upX, upX + drift * 0.55, upX + drift],
        y: [0, upY, upY + (fall - upY) * 0.45, fall],
        rotate: [0, Math.random() * 180, Math.random() * 360 + 180, Math.random() * 360 + 420],
        rotateY: [0, 180, 360, 540 + Math.random() * 180],
        duration: 3.4 + Math.random() * 0.9,
        delay: Math.random() * 0.12,
      };
    });
  }, [origin]);

  useEffect(() => {
    const t = setTimeout(onDone, 5500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin]);

  // Portalled to <body> so position: fixed is relative to the screen, not the animated section.
  return createPortal(
    <div className="petals" aria-hidden="true" style={{ left: origin.x, top: origin.y }}>
      {petals.map((p) => (
        <motion.svg
          key={p.id}
          className="petal"
          viewBox="0 0 20 26"
          width={p.size}
          height={p.size * 1.3}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, rotateY: p.rotateY, opacity: [0, 1, 1, 0.85] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            times: [0, 0.18, 0.55, 1],
            ease: ['easeOut', 'easeIn', 'linear'],
          }}
        >
          <path d="M10 0 C 18 6, 19 18, 10 26 C 1 18, 2 6, 10 0 Z" fill={p.color} />
          <path d="M10 3 C 12 10, 12 17, 10 23" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
        </motion.svg>
      ))}
    </div>,
    document.body
  );
}

// Finds the frame's empty window by flood-filling the near-white pixels connected
// to its centre, so the foil fills the opening exactly and tucks behind the
// chandelier and curtains. Returns an alpha mask plus the window's bounding box.
function buildWindowMask(img) {
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, W, H).data;
  const empty = (p) => Math.min(d[p * 4], d[p * 4 + 1], d[p * 4 + 2]) >= WINDOW_WHITE;

  const inside = new Uint8Array(W * H);
  const seed = Math.round(H * WINDOW_SEED.y) * W + Math.round(W * WINDOW_SEED.x);
  const stack = [seed];
  inside[seed] = 1;
  let minX = W, maxX = 0, minY = H, maxY = 0;
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p - x) / W;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (x > 0 && !inside[p - 1] && empty(p - 1)) (inside[p - 1] = 1), stack.push(p - 1);
    if (x < W - 1 && !inside[p + 1] && empty(p + 1)) (inside[p + 1] = 1), stack.push(p + 1);
    if (y > 0 && !inside[p - W] && empty(p - W)) (inside[p - W] = 1), stack.push(p - W);
    if (y < H - 1 && !inside[p + W] && empty(p + W)) (inside[p + W] = 1), stack.push(p + W);
  }

  // Grow the mask by a pixel so it also covers the soft edges of the artwork.
  const out = ctx.createImageData(W, H);
  for (let p = 0; p < W * H; p++) {
    if (inside[p] || inside[p - 1] || inside[p + 1] || inside[p - W] || inside[p + W]) out.data[p * 4 + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return { mask: c, W, H, box: { x: minX - 1, y: minY - 1, w: maxX - minX + 3, h: maxY - minY + 3 } };
}

function ScratchCard({ revealed, onReveal }) {
  const s = config.scratchDate;
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const state = useRef({ drawing: false, last: null, w: 0, h: 0, moves: 0, samples: [] });
  const [win, setWin] = useState(null);
  const [ready, setReady] = useState(false);
  const [foilGone, setFoilGone] = useState(false);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = config.art.scratchFrame;
    img.decode().then(() => alive && setWin(buildWindowMask(img)), () => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !win) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || (rect.width === state.current.w && rect.height === state.current.h)) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.current.w = rect.width;
      state.current.h = rect.height;
      paintFoil(ctx, rect.width, rect.height);
      // Keep the foil only where the window is.
      const { mask, box } = win;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, box.x, box.y, box.w, box.h, 0, 0, rect.width, rect.height);
      ctx.globalCompositeOperation = 'source-over';
      // Remember which pixels hold foil, to measure how much has been scratched.
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const samples = [];
      for (let i = 3; i < data.length; i += 4 * 13) if (data[i] > 200) samples.push(i);
      state.current.samples = samples;
      setReady(true);
    };
    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [win]);

  const clearedRatio = () => {
    const canvas = canvasRef.current;
    const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    const { samples } = state.current;
    let clear = 0;
    for (const i of samples) if (data[i] < 40) clear++;
    return samples.length ? clear / samples.length : 0;
  };

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // Round-brush erase.
  const scratch = (from, to) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = Math.max(28, state.current.w * 0.11);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  const check = () => {
    if (!revealed && clearedRatio() >= REVEAL_AT) {
      const rect = textRef.current.getBoundingClientRect();
      onReveal({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  };

  const onDown = (e) => {
    if (revealed || !ready) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = point(e);
    state.current.drawing = true;
    state.current.last = p;
    scratch(p, { x: p.x + 0.01, y: p.y });
  };

  const onMove = (e) => {
    const st = state.current;
    if (!st.drawing || revealed) return;
    const p = point(e);
    scratch(st.last, p);
    st.last = p;
    if (++st.moves % 6 === 0) check();
  };

  const onUp = () => {
    if (!state.current.drawing) return;
    state.current.drawing = false;
    check();
  };

  return (
    <div className="scratch">
      <div className="scratch__frame">
        <img src={config.art.scratchFrame} alt="" loading="lazy" decoding="async" />
      </div>
      {/* hidden until the foil is painted over it, so the date can't be read early */}
      <div ref={textRef} className="scratch__text" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <p className="scratch__invited">{s.invited}</p>
        <p className="scratch__date">{s.date}</p>
        <p className="scratch__when">{s.when}</p>
      </div>
      {win && !foilGone && (
        <canvas
          ref={canvasRef}
          className={`scratch__foil ${revealed ? 'is-gone' : ''}`}
          style={{
            left: `${(win.box.x / win.W) * 100}%`,
            top: `${(win.box.y / win.H) * 100}%`,
            width: `${(win.box.w / win.W) * 100}%`,
            height: `${(win.box.h / win.H) * 100}%`,
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onTransitionEnd={() => revealed && setFoilGone(true)}
          aria-label={s.foilLabel}
        />
      )}
    </div>
  );
}

export default function ScratchDate() {
  const s = config.scratchDate;
  const [revealed, setRevealed] = useState(false);
  const [petalOrigin, setPetalOrigin] = useState(null);

  const reveal = (origin) => {
    if (revealed) return;
    setRevealed(true);
    setPetalOrigin(origin);
  };

  return (
    <>
      <Garland />
      <Reveal className="sec sec--beige scratch-date">
        <Kicker>{s.kicker}</Kicker>
        <div className="xfade">
          <motion.h2 className="script-heading" animate={{ opacity: revealed ? 0 : 1 }} transition={{ duration: 0.8 }}>
            {s.heading}
          </motion.h2>
          <motion.h2
            className="script-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            aria-hidden={!revealed}
          >
            {s.revealedHeading}
          </motion.h2>
        </div>
        <DiamondRule />
        <ScratchCard revealed={revealed} onReveal={reveal} />
      </Reveal>
      {petalOrigin && <PetalRain origin={petalOrigin} onDone={() => setPetalOrigin(null)} />}
    </>
  );
}
