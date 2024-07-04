import fs from 'fs/promises'
import { createGenerator } from 'unocss'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { loadConfig } from '@unocss/config'
import type { Options } from './types'

export const unplugin = createUnplugin((options: Options = {}): any => {
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
        if (!config)
          ({ config } = await loadConfig())
        createGenerator({}, config).generate(code || '').then((result) => {
          const match = result.getLayers().match(/\/\*\s*layer\:\s*default\s*\*\/\n(.*)/ms)
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

