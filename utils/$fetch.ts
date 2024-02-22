import { ofetch } from 'ofetch'

export const $fetch = ofetch.create({
  baseURL: 'https://api.everhour.com',
  onRequest: ({ options }) => {
    const config = useRuntimeConfig()
    options.headers = options.headers || {}
    // @ts-expect-error
    options.headers['X-Api-Key'] = config.apiKey
  },
})
