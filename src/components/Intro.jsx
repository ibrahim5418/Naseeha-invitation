import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import config from '../config';

const SAFETY_MS = 14000;
const STILLS_MS = 6000;
const { art } = config;

function Flourish({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 40" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M120 20 C 104 6, 88 6, 80 16 C 74 24, 82 31, 89 26 C 95 21, 90 13, 82 14" />
        <path d="M80 16 C 60 30, 34 30, 6 20" />
        <path d="M120 20 C 136 6, 152 6, 160 16 C 166 24, 158 31, 151 26 C 145 21, 150 13, 158 14" />
        <path d="M160 16 C 180 30, 206 30, 234 20" />
      </g>
      <path d="M120 13 L125 20 L120 27 L115 20 Z" fill="currentColor" />
    </svg>
  );
}

// Fallback when the film is missing: glow bloom → curtains sweep left →
// slow pan across the arch wall → settle on the stage (~6s).
function Stills() {
  return (
    <>
      <motion.div
        className="stills-arch"
        style={{ backgroundImage: `url(${art.archWall})` }}
        initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
        animate={{ opacity: 1, backgroundPosition: '100% 50%' }}
        transition={{
          opacity: { delay: 1.4, duration: 0.01 },
          backgroundPosition: { delay: 1.5, duration: 3.4, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className="stills-glow"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 2.2] }}
        transition={{ duration: 1.8, times: [0, 0.55, 1], ease: 'easeOut' }}
      />
      <motion.img
        src={art.curtains}
        alt=""
        className="intro-media"
        initial={{ opacity: 0, x: '-50%' }}
        animate={{ opacity: [0, 1, 1], x: ['-50%', '-50%', '-160%'] }}
        transition={{ delay: 0.6, duration: 2.6, times: [0, 0.32, 1], ease: 'easeInOut' }}
      />
      <motion.img
        src={art.stage}
        alt=""
        className="intro-media"
        initial={{ opacity: 0, x: '-50%' }}
        animate={{ opacity: 1, x: '-50%' }}
        transition={{ delay: 4.6, duration: 1.2, ease: 'easeInOut' }}
      />
    </>
  );
}

export default function Intro({ onTap, onReveal, onDone }) {
  // tap → starting → film | stills → leaving
  const [phase, setPhase] = useState('tap');
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [hasFilm, setHasFilm] = useState(null);
  const videoRef = useRef(null);
  const filmCheck = useRef(null);
  const finished = useRef(false);
  const timers = useRef([]);

  // Detect the film with a HEAD request (a probe <video> won't load on iOS).
  useEffect(() => {
    filmCheck.current = fetch(art.introFilm, { method: 'HEAD', cache: 'no-store' })
      .then((r) => r.ok && (r.headers.get('content-type') || '').startsWith('video'))
      .catch(() => false)
      .then((ok) => {
        setHasFilm(ok);
        return ok;
      });
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    setPhase('leaving');
    onReveal();
  };

  const runStills = () => {
    setPhase('stills');
    timers.current.push(setTimeout(finish, STILLS_MS));
  };

  const playFilm = () =>
    videoRef.current
      .play()
      .then(() => setPhase((p) => (p === 'leaving' ? p : 'film')))
      .catch(runStills);

  const handleTap = () => {
    if (phase !== 'tap') {
      if (phase !== 'leaving') finish(); // second tap skips the intro
      return;
    }
    setPhase('starting');
    onTap();
    timers.current.push(setTimeout(finish, SAFETY_MS));
    if (hasFilm && videoRef.current) {
      playFilm();
    } else {
      filmCheck.current.then((ok) => {
        if (finished.current) return;
        // The <video> mounts once the HEAD check resolves; wait a frame for it.
        if (ok) requestAnimationFrame(() => (videoRef.current ? playFilm() : runStills()));
        else runStills();
      });
    }
  };

  return (
    <motion.div
      className="intro"
      role="button"
      aria-label={config.tap.label}
      tabIndex={0}
      onClick={handleTap}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTap()}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'leaving' ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      onAnimationComplete={() => phase === 'leaving' && onDone()}
    >
      <div className="intro__col">
        <div className="intro-media intro-scene">
          <img src={art.tapScene} alt="" className="intro-scene__img" />
          <motion.div
            className="tap"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'tap' ? 1 : 0 }}
            transition={{ duration: phase === 'tap' ? 1 : 0.4, delay: phase === 'tap' ? 0.3 : 0 }}
          >
            <span className="tap__ring" />
            <Flourish className="tap__flourish" />
            <span className="tap__label">{config.tap.label}</span>
            <span className="tap__line" />
          </motion.div>
        </div>

        {hasFilm && (
          <video
            ref={videoRef}
            className="intro-media intro-film"
            style={{ opacity: filmPlaying ? 1 : 0 }}
            src={art.introFilm}
            muted
            playsInline
            preload="auto"
            onPlaying={() => setFilmPlaying(true)}
            onEnded={finish}
          />
        )}

        {phase === 'stills' && <Stills />}
      </div>
    </motion.div>
  );
}
