import { ofetch } from 'ofetch'

export const $fetch = ofetch.create({
  baseURL: 'https://api.everhour.com',
  onRequest: ({ options }) => {
    const apiKey = '1a74-ec8c-9891f6-c4494d-e2843f3f'
    options.headers = options.headers || {}
    // @ts-expect-error
    options.headers['X-Api-Key'] = apiKey
  },
})
