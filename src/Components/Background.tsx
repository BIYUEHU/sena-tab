import { useEffect, useState } from 'react'
import useStore from '@/store'
import type { Settings } from '@/store/schema'
import ArrowLeft from '@/assets/arrow-left.svg'
import ArrowRight from '@/assets/arrow-right.svg'
import Play from '@/assets/play.svg'
import Pause from '@/assets/pause.svg'
import { t } from '@/i18n'

interface BackgroundProps {
  settings: Settings['background']
}

const Background: React.FC<BackgroundProps> = ({ settings }) => {
  const backgroundPlaying = useStore((state) => state.cache.backgroundPlaying)
  const backgroundMask = useStore((state) => state.cache.backgroundMask)
  const toggleBackgroundPlaying = useStore((state) => state.toggleBackgroundPlaying)
  const getUnsplashBackground = useStore((state) => state.getUnsplashBackground)
  const isUnsplashFirstIndex = useStore((state) => state.isUnsplashFirstIndex)
  const isUnsplashUpdatedExpired = useStore((state) => state.isUnsplashUpdatedExpired)
  const getBingBackground = useStore((state) => state.getBingBackground)
  const [isLight, setIsLight] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [info, setInfo] = useState('')
  const [isNext, setIsNext] = useState(false)

  useEffect(() => {
    const generateMaskStyle = ({ blur, luminosity }: { blur: number; luminosity: number }): React.CSSProperties => {
      if (!backgroundMask) return {}
      if (luminosity < 0) setIsLight(true)
      return { filter: `blur(${blur}px)`, transform: `scale(${blur * 0.002} + 1)`, opacity: Math.abs(luminosity / 100) }
    }

    switch (settings.type) {
      case 'unsplash':
        getUnsplashBackground(isNext ? 1 : 0).then((result) => {
          setStyle({ backgroundImage: `url(${result.url})`, ...generateMaskStyle(settings) })
          setInfo(
            /* html */ `<a href="${result.htmlLink}" target="_blank">Photo</a>, <a href="${result.userLink}" target="_blank">${result.user}</a>, <a href="https://unsplash.com" target="_blank">Unsplash</a>`
          )
        })
        if (isNext) setIsNext(false)
        break
      case 'bing':
        getBingBackground().then((result) => {
          setStyle({ backgroundImage: `url(${result[0]})`, ...generateMaskStyle(settings) })
          setInfo(
            /* html */ `<a href="${result[0]}" target="_blank">${result[1]}</a>, <a href="https://bing.com" target="_blank">Bing</a>`
          )
        })
        break
      case 'url':
        setStyle({
          backgroundImage: `url(${settings.url[Math.floor(Math.random() * settings.url.length)]})`,
          ...generateMaskStyle(settings)
        })
        break
      case 'gradient-color':
        setStyle({
          backgroundImage: `linear-gradient(${settings.angle}deg, ${settings.fromColor}, ${settings.toColor})`
        })
        break
      default:
        setStyle({ backgroundColor: settings.color })
        break
    }
  }, [settings, backgroundMask, getUnsplashBackground, getBingBackground, isNext])

  setInterval(() => {
    if (isUnsplashUpdatedExpired()) setIsNext(true)
  }, 1000)

  return (
    <>
      <div className={`background ${isLight ? 'light' : 'dark'}`} style={style} />
      <footer>
        <div>
          {/* biome-ignore lint: */}
          {['unsplash', 'bing'].includes(settings.type) && <div dangerouslySetInnerHTML={{ __html: info }} />}
        </div>
        <div>
          {settings.type === 'unsplash' && (
            <>
              {isUnsplashFirstIndex() || (
                <img
                  src={ArrowLeft}
                  alt={t`unsplash.previous`}
                  title={t`unsplash.previous`}
                  onClick={() => getUnsplashBackground(-1)}
                />
              )}
              <img
                src={backgroundPlaying ? Pause : Play}
                alt={t`unsplash.play`}
                title={t`unsplash.play`}
                onClick={() => toggleBackgroundPlaying()}
              />
              <img
                src={ArrowRight}
                alt={t`unsplash.next`}
                title={t`unsplash.next`}
                onClick={() => getUnsplashBackground(1)}
              />
            </>
          )}
        </div>
      </footer>
    </>
  )
}

export default Background
