import { useState } from 'react'
import { REFER_URL } from '@/constants/mapping'
import { f, t } from '@/i18n'
import type { Settings } from '@/store/schema'
import BackgroundEditor from './Configuration/BackgroundEditor'
import { SelectField } from './Configuration/shared'
import WidgetsEditor from './Configuration/WidgetsEditor'

interface ConfigurationProps {
  state: boolean
  initial: Settings
  onSave: (settings: Settings) => void
  onCancel: () => void
}

type Tab = 'background' | 'widgets' | 'language' | 'advanced'

const Configuration: React.FC<ConfigurationProps> = ({ state, initial, onSave, onCancel }) => {
  const tabs: { value: Tab; label: string }[] = [
    { value: 'background', label: t`config.tab.background` },
    { value: 'widgets', label: t`config.tab.widgets` },
    { value: 'language', label: t`config.tab.language` },
    { value: 'advanced', label: t`config.tab.advanced` }
  ]

  const languageOptions = [
    { value: 'en_US' as const, label: t`config.language.en_US` },
    { value: 'ja_JP' as const, label: t`config.language.ja_JP` },
    { value: 'zh_CN' as const, label: t`config.language.zh_CN` },
    { value: 'zh_TW' as const, label: t`config.language.zh_TW` }
  ]
  const [tab, setTab] = useState<Tab>('background')
  const [settings, setSettings] = useState(initial)
  const [jsonText, setJsonText] = useState(JSON.stringify(initial, null, 2))
  const [jsonError, setJsonError] = useState('')

  const syncJsonFromSettings = (next: Settings): void => {
    setSettings(next)
    setJsonText(JSON.stringify(next, null, 2))
  }

  const handleJsonChange = (text: string): void => {
    setJsonText(text)
    try {
      setSettings(JSON.parse(text))
      setJsonError('')
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div>
      {state && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t`configuration.title`}</h2>
            <p
              // biome-ignore lint: *
              dangerouslySetInnerHTML={{
                __html: f(
                  'configuration.tips',
                  `<a style="color: #007bff;" href="${REFER_URL}" target="_blank">👉#</a>`
                )
              }}
            />
            <div className="config-tabs">
              {tabs.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={tab === item.value ? 'active' : ''}
                  onClick={() => setTab(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="config-body">
              {tab === 'background' && (
                <BackgroundEditor
                  value={settings.background}
                  onChange={(background) => syncJsonFromSettings({ ...settings, background })}
                />
              )}
              {tab === 'widgets' && (
                <WidgetsEditor
                  value={settings.widgets}
                  onChange={(widgets) => syncJsonFromSettings({ ...settings, widgets })}
                />
              )}
              {tab === 'language' && (
                <div className="config-section">
                  <SelectField
                    label={t`config.language.label`}
                    value={settings.language}
                    options={languageOptions}
                    onChange={(language) => syncJsonFromSettings({ ...settings, language })}
                  />
                </div>
              )}
              {tab === 'advanced' && (
                <div className="config-section">
                  <textarea
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    rows={16}
                    placeholder={t`configuration.placeholder`}
                  />
                  {jsonError && <p className="config-error">{f('configuration.jsonError', jsonError)}</p>}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" disabled={!!jsonError} onClick={() => onSave(settings)}>
                {t`configuration.saveBtn`}
              </button>
              <button type="button" onClick={onCancel}>
                {t`configuration.cancelBtn`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuration
