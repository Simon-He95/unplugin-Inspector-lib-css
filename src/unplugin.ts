import type { Options } from './types'
import fs from 'node:fs/promises'
import { createFilter } from '@rollup/pluginutils'
import { loadConfig } from '@unocss/config'
import { createGenerator } from '@unocss/core'
import { createUnplugin } from 'unplugin'

export const unplugin = createUnplugin(async (options: Options = {}) => {
  const filter = createFilter(options.include, options.exclude)
  let styles = ''
  let config: any
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

          const outputPath = options.file || `${options.dir}/${typeof options.entryFileNames === 'string' ? options.entryFileNames : options.entryFileNames(options.chunkFileNames)}`
          const cssCode = JSON.stringify(styles.replace(/\n/g, ' '))
          const insertStyle = `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('unplugin-Inspector-lib-css', e);}`
          const { code } = Object.values(bundle)[0] as any
          fs.writeFile(outputPath, `${insertStyle}
          ${code}`, 'utf-8')
        },
      },
      async transform(code: string) {
        ({ config } = await loadConfig());
        (await createGenerator({}, config as any))
          .generate(code || '')
          .then((result) => {
            const match = result.getLayers().match(/\/\*\s*layer:\s*default\s*\*\/\n(.*)/s)
            if (!match)
              return
            const css = match[1]
            css.split('}\n').forEach((s) => {
              if (!styles.includes(s))
                styles += `${css}} `
            })
          })
      },
    },
  ]
})
