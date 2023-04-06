import path from 'path'
import fs from 'fs/promises'
import { createGenerator, presetAttributify, presetUno } from 'unocss'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Options } from './types'

const unplugin = createUnplugin((options: Options = {}): any => {
  const filter = createFilter(options.include, options.exclude)
  let styles = ''
  const defaultConfig = Object.assign({
    presets: [
      presetUno(),
      presetAttributify(),
    ],
  }, options)
  return [
    {
      name: 'unplugin-inspector-lib-css',
      enforce: 'pre',
      transformInclude(id: string) {
        return filter(id)
      },
      apply: 'build',
      writeBundle: {
        order: 'post',
        handler(options: any, bundle: any) {
          if (!styles)
            return
          const outputPath = options.file || path.resolve(options.dir, options.entryFileNames)
          const cssCode = JSON.stringify(styles.replace(/\n/g, ' '))
          const insertStyle = `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('vite-plugin-Inspector-lib-css', e);}`
          const { code } = Object.values(bundle)[0] as any
          fs.writeFile(outputPath, `${insertStyle}
  ${code}`, 'utf-8')
        },
      },
      transform: {
        order: 'pre',
        handler(code: string) {
          if (!code.startsWith('// @unocss-include'))
            return code
          createGenerator({}, defaultConfig).generate(code || '').then((result) => {
            const css = result.getLayers()
            if (!styles.includes(css))
              styles += `${css} `
          })
        },
      },
    },
  ]
})

export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const webpackPlugin = unplugin.webpack
export const esbuildPlugin = unplugin.esbuild

