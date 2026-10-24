import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import { Blessed, Festivities, Hearts, Venue } from './components/Sections';
import ScratchDate from './components/ScratchDate';
import Intro from './components/Intro';
import MusicButton, { startMusic } from './components/MusicButton';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);

  // Lock page scroll until the intro has finished.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !introDone);
    if (!introDone) window.scrollTo(0, 0);
  }, [introDone]);

  return (
    <>
      <main className="page">
        <Hero revealed={heroRevealed} />
        <Blessed />
        <ScratchDate />
        <Festivities />
        <Hearts />
        <Venue />
      </main>

      {introDone && <MusicButton />}

      {!introDone && (
        <Intro onTap={startMusic} onReveal={() => setHeroRevealed(true)} onDone={() => setIntroDone(true)} />
      )}
    </>
  );
}
