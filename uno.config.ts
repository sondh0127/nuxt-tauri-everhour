import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      cdn: 'https://esm.sh/'
    })
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})
