import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'tsup',
  target: 'esnext',
  format: ['cjs', 'esm'],
  clean: true,
  external: ['vite', 'webpack', 'rollup', 'esbuild', 'fast-glob', 'unocss'],
  dts: {
    resolve: true,
    // build types for `src/index.ts` only
    // otherwise `Options` will not be exported by `tsup`, not sure how this happens, probably a bug in rollup-plugin-dts
  },
})
