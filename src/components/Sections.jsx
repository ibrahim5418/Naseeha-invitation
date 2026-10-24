import { useLayoutEffect, useRef } from 'react';
import config from '../config';
import { DiamondRule, Fit, Garland, Kicker } from './Ornaments';
import Reveal from './Reveal';

function MapsButton({ href, label, className = '' }) {
  return (
    <a className={`maps-btn ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

// Phrases joined by a "•" on one line; if they don't fit, they stack on separate
// lines (without the bullet) instead of breaking mid-phrase.
function Parts({ items }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const measure = () => {
      el.classList.remove('is-stacked');
      el.style.whiteSpace = 'nowrap';
      el.style.maxWidth = 'none';
      const fits = el.getBoundingClientRect().width <= el.parentElement.clientWidth + 0.5;
      el.style.whiteSpace = '';
      el.style.maxWidth = '';
      el.classList.toggle('is-stacked', !fits);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [items]);

  return (
    <span ref={ref} className="parts">
      {items.map((item, i) => (
        <span key={item} className="part">
          {i > 0 && <span className="part__sep" aria-hidden="true" />}
          {item}
        </span>
      ))}
    </span>
  );
}

export function Blessed() {
  const b = config.blessed;
  return (
    <>
      <Garland />
      <Reveal className="sec sec--ivory blessed">
        <span className="blessed__circle blessed__circle--l" aria-hidden="true" />
        <span className="blessed__circle blessed__circle--r" aria-hidden="true" />
        <h2 className="script-heading">{b.heading}</h2>
        <p className="body-text">{b.text}</p>
        <Fit as="p" className="couple-script">
          {config.couple}
        </Fit>
      </Reveal>
    </>
  );
}

export function Festivities() {
  const f = config.festivities;
  return (
    <>
      <Garland />
      <Reveal className="sec sec--ivory festivities">
        <Kicker>{f.kicker}</Kicker>
        <h2 className="script-heading">{f.heading}</h2>
        <DiamondRule />
        <div className="events">
          {f.events.map((ev) => (
            <article className="event-card" key={ev.name}>
              <h3 className="event-card__name">{ev.name}</h3>
              <p className="event-card__when">
                <Parts items={ev.when} />
              </p>
              <p className="event-card__venue">{ev.venue}</p>
              <MapsButton href={ev.mapUrl} label={f.mapsLabel} />
            </article>
          ))}
        </div>
      </Reveal>
    </>
  );
}

export function Hearts() {
  const h = config.hearts;
  return (
    <>
      <Garland />
      <Reveal className="sec hearts">
        <Kicker>{h.kicker}</Kicker>
        <div className="hearts__script">
          {h.scriptLines.map((l) => (
            <Fit as="p" key={l}>
              {l}
            </Fit>
          ))}
        </div>
        <p className="hearts__text">{h.text}</p>
      </Reveal>
    </>
  );
}

export function Venue() {
  const v = config.venue;
  return (
    <>
      <Garland />
      <Reveal className="sec sec--ivory venue">
        <div className="venue-card">
          <Kicker gold>{v.kicker}</Kicker>
          <DiamondRule star className="rule--venue" />
          {v.photo && <img className="venue-card__photo" src={v.photo} alt={v.name} loading="lazy" />}
          <h3 className="venue-card__name">{v.name}</h3>
          <p className="venue-card__detail">
            <Parts items={v.detail} />
          </p>
          <MapsButton href={v.mapUrl} label={v.mapsLabel} className="maps-btn--light" />
        </div>
      </Reveal>
    </>
  );
}
