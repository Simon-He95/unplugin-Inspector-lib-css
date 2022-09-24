## vite-plugin-inspector-lib-css
将库模式下的unocss样式打包注入到bundle

## Install
```bash
npm i vite-plugin-inspector-lib-css -D
```

## Usage
```js
// vite.config.js
import { defineConfig } from 'vite'
import vitePluginInspectorLibCss from 'vite-plugin-inspector-lib-css'
export default defineConfig({
  plugins: [
    vitePluginInspectorLibCss()
  ]
})
```

## Warning
- ts | js | tsx | jsx 文件中头部需要加上// @unocss-include否则不会被注入



## :coffee: 
<a href="https://github.com/Simon-He95/sponsor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>



## :question: 问题
[issues](https://github.com/Simon-He95/vite-plugin-inspector-lib-css/issues)

## 依赖
`unocss`
