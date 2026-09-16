import { defineConfig, presetWind3 } from 'unocss';

export default defineConfig({
  presets: [presetWind3()],
  theme: {
    colors: {
      // Semantic shortcut for alert-styled UI (rows, cards, borders).
      alert: {
        DEFAULT: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
      },
    },
  },
});
