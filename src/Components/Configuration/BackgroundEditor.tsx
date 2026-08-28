import { t } from '@/i18n'
import type { Settings } from '@/store/schema'
import { ColorField, NumberField, SelectField, TextField } from './shared'

const readFileAsDataUrl = (file: File, onLoad: (dataUrl: string) => void): void => {
  const reader = new FileReader()
  reader.onload = () => onLoad(reader.result as string)
  reader.readAsDataURL(file)
}

interface BackgroundEditorProps {
  value: Settings['background']
  onChange: (value: Settings['background']) => void
}

const TYPE_OPTIONS = [
  { value: 'url' as const, label: t`config.background.type.url` },
  { value: 'bing' as const, label: t`config.background.type.bing` },
  { value: 'unsplash' as const, label: t`config.background.type.unsplash` },
  { value: 'solid-color' as const, label: t`config.background.type.solidColor` },
  { value: 'gradient-color' as const, label: t`config.background.type.gradientColor` }
]

const DEFAULTS_BY_TYPE: Record<Settings['background']['type'], Settings['background']> = {
  url: { type: 'url', url: [''], blur: 0, luminosity: 0 },
  bing: { type: 'bing', blur: 0, luminosity: 0 },
  unsplash: { type: 'unsplash', minutes: 15, blur: 0, luminosity: -80 },
  'solid-color': { type: 'solid-color', color: '#333' },
  'gradient-color': { type: 'gradient-color', fromColor: '#333', toColor: '#666666', angle: 45 }
}

const BackgroundEditor: React.FC<BackgroundEditorProps> = ({ value, onChange }) => (
  <div className="config-section">
    <SelectField
      label={t`config.background.type`}
      value={value.type}
      options={TYPE_OPTIONS}
      onChange={(type) => onChange(DEFAULTS_BY_TYPE[type])}
    />
    {value.type === 'url' && (
      <>
        <TextField
          label={t`config.background.urls`}
          value={value.url.join(',')}
          onChange={(url) => onChange({ ...value, url: url.split(',').map((item) => item.trim()) })}
        />
        <label className="field">
          <span>{t`config.background.localImage`}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              file &&
                readFileAsDataUrl(file, (dataUrl) =>
                  onChange({ ...value, url: [...value.url.filter(Boolean), dataUrl] })
                )
              e.target.value = ''
            }}
          />
        </label>
      </>
    )}
    {value.type === 'unsplash' && (
      <NumberField
        label={t`config.background.minutes`}
        value={value.minutes}
        min={1}
        onChange={(minutes) => onChange({ ...value, minutes })}
      />
    )}
    {value.type === 'solid-color' && (
      <ColorField
        label={t`config.background.color`}
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
    )}
    {value.type === 'gradient-color' && (
      <>
        <ColorField
          label={t`config.background.fromColor`}
          value={value.fromColor}
          onChange={(fromColor) => onChange({ ...value, fromColor })}
        />
        <ColorField
          label={t`config.background.toColor`}
          value={value.toColor}
          onChange={(toColor) => onChange({ ...value, toColor })}
        />
        <NumberField
          label={t`config.background.angle`}
          value={value.angle}
          min={0}
          max={360}
          onChange={(angle) => onChange({ ...value, angle })}
        />
      </>
    )}
    {(value.type === 'url' || value.type === 'bing' || value.type === 'unsplash') && (
      <>
        <NumberField
          label={t`config.background.blur`}
          value={value.blur}
          min={0}
          max={50}
          onChange={(blur) => onChange({ ...value, blur })}
        />
        <NumberField
          label={t`config.background.luminosity`}
          value={value.luminosity}
          min={-100}
          max={100}
          onChange={(luminosity) => onChange({ ...value, luminosity })}
        />
      </>
    )}
  </div>
)

export default BackgroundEditor
