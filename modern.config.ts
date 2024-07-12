import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import { bffPlugin } from '@modern-js/plugin-bff';
import { expressPlugin } from '@modern-js/plugin-express';
// import { ssgPlugin } from '@modern-js/plugin-ssg';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  source: {
    include: [/\/node_modules\/@semi-bot\//],
  },
  runtime: {
    router: true,
  },
  server: {
    ssr: false,
  },
  output: {
    ssg: false,
    disableSourceMap: process.env.NODE_ENV === 'production',
  },
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
    tailwindcssPlugin(),
    bffPlugin(),
    expressPlugin(),
    // ssgPlugin(),
  ],
});
