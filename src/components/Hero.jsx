import { motion } from 'framer-motion';
import config from '../config';
import { DiamondRule, Fit } from './Ornaments';

export default function Hero({ revealed }) {
  const h = config.hero;
  const { groom, bride } = config;
  return (
    <section className="hero">
      <div className="stage">
        <img src={config.art.stage} alt="" className="stage__img" fetchpriority="high" />
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 14 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Fit className="h-bismillah" lang="ar" dir="rtl">
            {h.bismillah}
          </Fit>
          <DiamondRule className="h-rule" />
          <div className="h-caps">
            {h.requestLines.map((l) => (
              <Fit key={l} className="h-caps__line">
                {l}
              </Fit>
            ))}
          </div>
          <Fit as="h1" className="h-name">
            {bride.fullName}
          </Fit>
          <p className="h-rel">{h.daughterOf}</p>
          <Fit className="h-parents">{bride.parents}</Fit>
          <p className="h-amp">{h.ampersand}</p>
          <Fit as="h1" className="h-name">
            {groom.fullName}
          </Fit>
          <p className="h-rel">{h.sonOf}</p>
          <Fit className="h-parents">{groom.parents}</Fit>
          <div className="h-caps h-caps--closing">
            {h.closingLines.map((l) => (
              <Fit key={l} className="h-caps__line">
                {l}
              </Fit>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="h-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0.7, delay: revealed ? 0.4 : 0 }}
        >
          <span>{h.scroll}</span>
          <i className="h-scroll__line" />
        </motion.div>
      </div>
    </section>
  );
}
