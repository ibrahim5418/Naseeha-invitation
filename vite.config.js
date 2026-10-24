import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from './src/config.js';

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Fills the %…% placeholders in index.html from src/config.js, so the title and
// WhatsApp preview are written into the HTML (link previews don't run JavaScript).
function htmlFromConfig() {
  const { share, art } = config;
  const site = share.siteUrl.replace(/\/$/, '');
  const values = {
    SHARE_TITLE: share.title,
    SHARE_DESCRIPTION: share.description,
    SHARE_IMAGE: site + share.image,
    SHARE_URL: site || '/',
    TAP_SCENE: art.tapScene,
  };
  return {
    name: 'html-from-config',
    transformIndexHtml: {
      order: 'pre', // before Vite parses the HTML's URLs
      handler: (html) => html.replace(/%([A-Z_]+)%/g, (m, key) => (key in values ? escapeHtml(values[key]) : m)),
    },
  };
}

export default defineConfig({
  plugins: [react(), htmlFromConfig()],
  server: { host: true },
});
