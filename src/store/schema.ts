import { QUOTES } from '@/constants/mapping'
import Tsu from 'tsukiko'

const backgroundDisplaySchema = {
  blur: Tsu.Number().int().range(0, 50),
  luminosity: Tsu.Number().int().range(-100, 100)
}

export const settingsSchema = Tsu.Object({
  background: Tsu.Custom<
    | { type: 'url'; url: string[]; blur: number; luminosity: number }
    | { type: 'bing'; blur: number; luminosity: number }
    | { type: 'unsplash'; minutes: number; blur: number; luminosity: number }
    | { type: 'solid-color'; color: string }
    | { type: 'gradient-color'; fromColor: string; toColor: string; angle: number }
  >((input) => {
    if (!input || typeof input !== 'object') return false
    if (!('type' in input) || typeof input.type !== 'string') return false
    switch (input.type) {
      case 'url':
        return Tsu.Object({
          type: Tsu.Literal('url'),
          url: Tsu.Array(Tsu.String()),
          ...backgroundDisplaySchema
        }).check(input)
      case 'solid-color':
        return Tsu.Object({
          type: Tsu.Literal('solid-color'),
          color: Tsu.String()
        }).check(input)
      case 'gradient-color':
        return Tsu.Object({
          type: Tsu.Literal('gradient-color'),
          fromColor: Tsu.String(),
          toColor: Tsu.String(),
          angle: Tsu.Number().int().range(0, 360)
        }).check(input)
      case 'bing':
        return Tsu.Object({
          type: Tsu.Literal('bing'),
          ...backgroundDisplaySchema
        }).check(input)
      case 'unsplash':
        return Tsu.Object({
          type: Tsu.Literal('unsplash'),
          minutes: Tsu.Number().positive().int(),
          ...backgroundDisplaySchema
        }).check(input)
      default:
        return false
    }
  }),
  widgets: Tsu.Array(
    Tsu.Union(
      Tsu.Object({
        type: Tsu.Literal('time'),
        format: Tsu.Enum(Tsu.Literal('clock'), Tsu.Literal('12h'), Tsu.Literal('24h')),
        showDate: Tsu.Boolean(),
        showMinutes: Tsu.Boolean(),
        showSeconds: Tsu.Boolean()
      }),
      Tsu.Intersection(
        Tsu.Object({
          type: Tsu.Literal('quote')
        }),
        Tsu.Union(
          Tsu.Object({
            quote: Tsu.Enum(
              Tsu.Literal('hitokoto'),
              ...Object.keys(QUOTES).map((k) => Tsu.Literal(k as keyof typeof QUOTES))
            )
          }),
          Tsu.Object({
            quote: Tsu.Literal('custom'),
            code: Tsu.String()
          })
        )
      ),
      Tsu.Object({
        type: Tsu.Literal('greeting'),
        name: Tsu.String()
      }),
      Tsu.Object({
        type: Tsu.Literal('search'),
        engine: Tsu.String()
      }),
      Tsu.Object({
        type: Tsu.Literal('links'),
        showIcon: Tsu.Boolean(),
        links: Tsu.Array(
          Tsu.Object({
            name: Tsu.String(),
            url: Tsu.String()
          })
        )
      })
    )
  ),
  language: Tsu.Enum(Tsu.Literal('en_US'), Tsu.Literal('ja_JP'), Tsu.Literal('zh_TW'))
})

export type Settings = Tsu.infer<typeof settingsSchema>
