import { useEffect, useLayoutEffect, useRef } from 'react';
import config from '../config';

// Hairline — diamond (or star) — hairline divider.
export function DiamondRule({ star = false, className = '' }) {
  return (
    <span className={`rule ${className}`} aria-hidden="true">
      <i />
      {star ? (
        <svg viewBox="0 0 20 20" className="rule__star">
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" />
        </svg>
      ) : (
        <b />
      )}
      <i />
    </span>
  );
}

// Garland on a white background, multiplied into whatever sits behind it.
// Rendered between sections so it straddles the boundary.
export function Garland() {
  return (
    <div className="garland" aria-hidden="true">
      <img src={config.art.garland} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

// Small tracked-caps label above a heading.
export function Kicker({ gold = false, className = '', children }) {
  return <p className={`caps ${gold ? 'caps--gold' : ''} ${className}`}>{children}</p>;
}

// Keeps a single line of text inside its box by scaling the --fit factor
// that the line's CSS font-size is multiplied by.
export function Fit({ as: Tag = 'div', className = '', children, ...rest }) {
  const outer = useRef(null);
  const inner = useRef(null);

  const measure = () => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    o.style.setProperty('--fit', '1');
    const avail = o.clientWidth;
    const need = i.scrollWidth;
    if (need > avail && avail > 0) o.style.setProperty('--fit', String((avail / need) * 0.98));
  };

  useLayoutEffect(measure);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    const ro = new ResizeObserver(measure);
    ro.observe(outer.current);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  return (
    <Tag ref={outer} className={`fit ${className}`} {...rest}>
      <span ref={inner} className="fit__inner">
        {children}
      </span>
    </Tag>
  );
}
