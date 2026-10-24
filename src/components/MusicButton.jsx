import { useEffect, useState } from 'react';
import config from '../config';

let audio = null;
function getAudio() {
  if (!config.music.src) return null;
  if (!audio) {
    audio = new Audio(config.music.src);
    audio.loop = true;
    audio.preload = 'auto';
  }
  return audio;
}

// Called from the tap on the intro screen (a user gesture, so playback is allowed).
export function startMusic() {
  getAudio()?.play().catch(() => {});
}

// Floating round cocoa button with equalizer bars. Renders nothing if no music is set.
export default function MusicButton() {
  const a = getAudio();
  const [playing, setPlaying] = useState(() => !!a && !a.paused);

  useEffect(() => {
    if (!a) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    a.addEventListener('play', on);
    a.addEventListener('pause', off);
    return () => {
      a.removeEventListener('play', on);
      a.removeEventListener('pause', off);
    };
  }, [a]);

  if (!a) return null;

  return (
    <button
      type="button"
      className={`music-btn ${playing ? 'is-playing' : ''}`}
      aria-label={playing ? config.music.pauseLabel : config.music.playLabel}
      onClick={() => (a.paused ? a.play().catch(() => {}) : a.pause())}
    >
      <span />
      <span />
      <span />
      <span />
    </button>
  );
}
