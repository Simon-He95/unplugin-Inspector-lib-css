import { loadConfig } from '@unocss/config'
import { createGenerator } from 'unocss'

async function vitePlugin() {
  let styles = ''
  const { config } = await loadConfig()

  return [
    {
      name: 'unplugin-inspector-lib-css',
      enforce: 'pre',
      apply: 'build',
      writeBundle: {
        order: 'post',
        handler(options: any, bundle: any) {
          if (!styles)
            return
          const outputPath
            = options.file
            || `${options.dir}/${typeof options.entryFileNames === 'string'
              ? options.entryFileNames
              : options.entryFileNames(options.chunkFileNames)
            }`
          const cssCode = JSON.stringify(styles.replace(/\n/g, ' '))
          const insertStyle = `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.appendChild(elementStyle);}}catch(e){console.error('unplugin-Inspector-lib-css', e);}`
          const { code } = Object.values(bundle)[0] as any
          import('node:fs/promises').then((fs) => {
            fs.writeFile(
              outputPath,
              `${insertStyle}
              ${code}`,
              'utf-8',
            )
          })
        },
      },
      transform(code: string) {
        createGenerator({}, config)
          .generate(code || '')
          .then((result) => {
            const match = result
              .getLayers()
              .match(/\/\*\s*layer\:\s*default\s*\*\/\n(.*)/ms)
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
}
export {
  vitePlugin as default,
}
