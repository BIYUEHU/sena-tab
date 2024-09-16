import '@/App.css'
import Settings from '@/assets/settings.svg'
import Maximize from '@/assets/maximize.svg'
import Minimize from '@/assets/minimize.svg'
import Eye from '@/assets/eye.svg'
import EyeOff from '@/assets/eye-off.svg'
import Background from '@/Components/Background'
import useStore from '@/store'
import Widgets from '@/Components/Widgets'
import Configuration from './Components/Configuration'
import { useState } from 'react'
import { settingsSchema } from './store/schema'
import i18n, { f, t } from '@/i18n'

const App: React.FC = () => {
  const language = useStore((state) => state.settings.language)
  i18n.set(language)
  document.title = t`app.title`

  const settings = useStore((state) => state.settings)
  const [isOpenConfiguration, setIsOpenConfiguration] = useState(false)
  const backgroundMask = useStore((state) => state.cache.backgroundMask)
  const toggleBackgroundMask = useStore((state) => state.toggleBackgroundMask)
  const setSettings = useStore((state) => state.setSettings)

  const handleConfigurationSave = (content: string) => {
    let json: unknown
    try {
      json = JSON.parse(content)
    } catch (e) {
      alert(f('configuration.jsonError', e instanceof Error ? e.message : String(e)))
      return
    }
    const result = settingsSchema.parseSafe(json)
    if (!result.value) {
      alert(f('configuration.formatError', result.error.message))
      return
    }
    setSettings(result.data)
    alert(t`configuration.save`)
    setIsOpenConfiguration(false)
  }

  // Register header icon keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    if (isOpenConfiguration) return
    switch (event.key) {
      case 'c':
        setIsOpenConfiguration(true)
        break
      // TODO: fix this
      // case 'm':
      //   setTimeout(() => toggleBackgroundMask(), 0)
      //   break
      case 'f':
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
        break
      default:
    }
  })

  return (
    <div className="layout">
      <Background settings={settings.background} />
      <header>
        <img
          src={Settings}
          alt={t`icon.settings`}
          title={t`icon.settings`}
          onClick={() => setIsOpenConfiguration(true)}
        />
        <img
          src={backgroundMask ? EyeOff : Eye}
          onClick={() => toggleBackgroundMask()}
          alt={t`icon.mask`}
          title={t`icon.mask`}
        />
        <img
          src={document.fullscreenElement ? Minimize : Maximize}
          alt={t`icon.fullscreen`}
          title={t`icon.fullscreen`}
          onClick={() =>
            document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
          }
        />
      </header>
      <main>
        {backgroundMask && <Widgets widgets={settings.widgets} language={language} />}
        <Configuration
          initial={JSON.stringify(settings, null, 2)}
          state={isOpenConfiguration}
          onSave={handleConfigurationSave}
          onCancel={() => setIsOpenConfiguration(false)}
        />
      </main>
      <footer>
        Made with <span style={{ color: 'red' }}>❤</span> by{' '}
        <a href="https://github.com/biyuehu" target="_blank" rel="noopener noreferrer">
          Arimura Sena
        </a>
      </footer>
    </div>
  )
}

export default App
