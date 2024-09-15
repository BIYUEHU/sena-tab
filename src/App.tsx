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

const App: React.FC = () => {
  const [isOpenConfiguration, setIsOpenConfiguration] = useState(false)
  const settings = useStore((state) => state.settings)
  const language = useStore((state) => state.settings.language)
  const backgroundMask = useStore((state) => state.cache.backgroundMask)
  const toggleBackgroundMask = useStore((state) => state.toggleBackgroundMask)
  const setSettings = useStore((state) => state.setSettings)

  const handleConfigurationSave = (content: string) => {
    let json: unknown
    try {
      json = JSON.parse(content)
    } catch (e) {
      alert(`Invalid JSON format: ${e instanceof Error ? e.message : e}`)
      return
    }
    const result = settingsSchema.parseSafe(json)
    if (!result.value) {
      alert(`Invalid configuration: ${result.error.message}`)
      return
    }
    setSettings(result.data)
    alert('Settings saved successfully')
    setIsOpenConfiguration(false)
  }

  return (
    <div className="layout">
      <Background settings={settings.background} />
      <header>
        <img src={Settings} alt="Settings" title="Settings" onClick={() => setIsOpenConfiguration(true)} />
        <img
          src={backgroundMask ? EyeOff : Eye}
          onClick={() => toggleBackgroundMask()}
          alt="Toggle Mask"
          title="Toggle Mask"
        />
        <img
          src={document.fullscreenElement ? Minimize : Maximize}
          alt="Toggle Fullscreen"
          title="Toggle Fullscreen"
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
