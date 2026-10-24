import { motion } from 'framer-motion';

// Fades + slides a section up the first time it scrolls into view.
export default function Reveal({ className, children }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
