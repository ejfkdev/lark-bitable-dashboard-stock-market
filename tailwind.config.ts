import type { Config } from 'tailwindcss';
import { type PluginAPI, type PluginCreator } from 'tailwindcss/types/config';

const test: PluginCreator = ({ matchUtilities, theme }: PluginAPI) => {
  return matchUtilities(
    {
      'font-flex': value => ({
        fontSize: `calc(min(${value}vw, ${value}vh))`,
        lineHeight: `calc(min(${value}vw, ${value}vh))`,
        minHeight: `calc(min(${value}vw, ${value}vh))`,
        display: 'inline-block',
      }),
    },
    { values: theme('fontFlexSize') },
  );
};
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  plugins: [test],
} satisfies Config;
