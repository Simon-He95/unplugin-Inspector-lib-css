## unplugin-inspector-lib-css
将库模式下的unocss样式打包注入到bundle

## Why
在使用tsx写vue组件时，vite build将css注入js中，但unocss并未生产对应转换的css被一起注入,才有了这个库

## Install
```bash
npm i unplugin-inspector-lib-css -D
```

## 🌈 Usage

<details>
<summary>Vite</summary>

```ts
// vite.config.ts
import { vitePlugn as vitePluginTransformToUnocss } from 'unplugin-inspector-lib-css'
export default defineConfig({
  plugins: [vitePluginTransformToUnocss(/* options */)],
})
```

</details>
<br>
<details>
<summary>Rollup</summary>

```ts
// rollup.config.js
import { resolve } from 'node:path'
import { vitePlugn as rollupTransformToUnocss } from 'unplugin-inspector-lib-css'
export default {
  plugins: [rollupTransformToUnocss(/* options */)],
}
```

</details>
<br>
<details>
<summary>Webpack</summary>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-inspector-lib-css').webpackPlugin({
      /* options */
    }),
  ],
}
```

</details>
<br>
<details>
<summary>Vue CLI</summary>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-inspector-lib-css').webpackPlugin({
        /* options */
      }),
    ],
  },
}
```

</details>
<br>
<details>
<summary>Esbuild</summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { vitePlugn as esbuilPlugin } from 'unplugin-inspector-lib-css'

build({
  plugins: [esbuilPlugin(/* options */)],
})
```

</details>

## Warning
- ts | js | tsx | jsx 文件中头部需要加上// @unocss-include否则不会被注入

## :coffee:
<a href="https://github.com/Simon-He95/sponsor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>

## :question: 问题
[issues](https://github.com/Simon-He95/unplugin-inspector-lib-css/issues)

## 依赖
`unocss`
