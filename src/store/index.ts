import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Settings } from './schema'

interface UnsplashImage {
  url: string
  user: string
  htmlLink: string
  userLink: string
}

interface StoreState {
  cache: {
    unsplash: UnsplashImage[]
    unsplashIndex: number
    unsplashUpdated: number
    bingDate: number
    bingUrl: string
    bingInfo: string
    backgroundMask: boolean
    backgroundPlaying: boolean
  }
  settings: typeof DEFAULT_SETTINGS
  isUnsplashUpdatedExpired: () => boolean
  isUnsplashFirstIndex: () => boolean
  getUnsplashBackground: (index?: number) => Promise<UnsplashImage>
  getBingBackground: () => Promise<[string, string]>
  setSettings: (newSettings: typeof DEFAULT_SETTINGS) => void
  getBackgroundMask: () => boolean
  toggleBackgroundMask: () => void
  getBackgroundPlaying: () => boolean
  toggleBackgroundPlaying: () => void
}

export const DEFAULT_SETTINGS: Settings = {
  background: {
    type: 'unsplash',
    minutes: 15,
    blur: 0,
    luminosity: -80
  },
  widgets: [
    {
      type: 'time',
      format: '24h',
      showDate: false,
      showMinutes: true,
      showSeconds: false
    },
    {
      type: 'greeting',
      name: ''
    },
    {
      type: 'search',
      engine: 'google'
    },
    {
      type: 'quote',
      quote: 'hitokoto'
    }
  ],
  language: 'en_US'
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cache: {
        unsplash: [],
        unsplashIndex: 0,
        unsplashUpdated: 0,
        bingDate: 0,
        bingUrl: '',
        bingInfo: '',
        backgroundMask: true,
        backgroundPlaying: true
      } as StoreState['cache'],
      settings: DEFAULT_SETTINGS,

      isUnsplashUpdatedExpired() {
        const { settings, cache } = get()
        return (
          settings.background.type === 'unsplash' &&
          cache.backgroundPlaying &&
          Date.now() - cache.unsplashUpdated > settings.background.minutes * 60 * 1000
        )
      },

      isUnsplashFirstIndex() {
        return get().cache.unsplashIndex === 0
      },

      async getUnsplashBackground(offset = 0) {
        if (offset !== 0) {
          set(({ cache }) => ({
            cache: { ...cache, unsplashIndex: cache.unsplashIndex + offset, unsplashUpdated: Date.now() }
          }))
        }

        if (get().cache.unsplashIndex >= 20 || get().cache.unsplash.length > 20) {
          set(({ cache }) => ({ cache: { ...cache, unsplash: cache.unsplash.slice(10, 20), unsplashIndex: 10 } }))
        }

        if (!get().cache.unsplash[get().cache.unsplashIndex]) {
          // biome-ignore lint:
          const res: any[] = await fetch('https://api.unsplash.com/photos/random?count=10&collections=1053828', {
            headers: {
              Authorization: 'Client-ID 1351e7003b0e869c6d7b221fe548c25216b16571ad28866446c06196ba1902d7'
            },
            cache: 'no-cache'
          }).then((res) => res.json())
          set(({ cache }) => ({
            cache: {
              ...cache,
              unsplash: [
                ...cache.unsplash,
                ...res.map(({ urls, links, user }) => ({
                  url: urls.raw,
                  user: user.name,
                  htmlLink: links.html,
                  userLink: user.links.html
                }))
              ]
            }
          }))
        }

        return get().cache.unsplash[get().cache.unsplashIndex]
      },

      async getBingBackground() {
        const { cache } = get()
        if (cache.bingDate === new Date().getDate()) return [cache.bingUrl, cache.bingInfo]

        const { url, copyright } = (
          await fetch('https://api.hotaru.icu/api/bing?format=json').then((res) => res.json())
        ).data
        set(({ cache }) => ({
          cache: {
            ...cache,
            bingUrl: url,
            bingInfo: copyright.split(',')[0].trim() ?? '',
            bingDate: new Date().getDate()
          }
        }))

        return [url, copyright.split(',')[0].trim() ?? '']
      },

      getBackgroundMask() {
        return get().cache.backgroundMask
      },

      toggleBackgroundMask() {
        set(({ cache }) => ({ cache: { ...cache, backgroundMask: !cache.backgroundMask } }))
      },

      getBackgroundPlaying() {
        return get().cache.backgroundPlaying
      },

      toggleBackgroundPlaying() {
        set(({ cache }) => ({ cache: { ...cache, backgroundPlaying: !cache.backgroundPlaying } }))
      },

      setSettings(newSettings) {
        set(({ settings }) => ({
          settings: { ...settings, ...newSettings }
        }))
      }
    }),
    {
      name: 'new-tab',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useStore
