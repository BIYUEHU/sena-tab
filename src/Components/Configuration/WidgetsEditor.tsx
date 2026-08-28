import { useState } from 'react'
import { ENGINES, QUOTES } from '@/constants/mapping'
import { f, t } from '@/i18n'
import type { Settings } from '@/store/schema'
import { BooleanField, SelectField, TextField } from './shared'

type Widget = Settings['widgets'][number]

interface WidgetsEditorProps {
  value: Settings['widgets']
  onChange: (value: Settings['widgets']) => void
}

const TYPE_OPTIONS = [
  { value: 'time' as const, label: t`config.widget.type.time` },
  { value: 'greeting' as const, label: t`config.widget.type.greeting` },
  { value: 'search' as const, label: t`config.widget.type.search` },
  { value: 'quote' as const, label: t`config.widget.type.quote` },
  { value: 'links' as const, label: t`config.widget.type.links` }
]

const DEFAULTS_BY_TYPE: Record<Widget['type'], Widget> = {
  time: { type: 'time', format: '24h', showDate: false, showMinutes: true, showSeconds: false },
  greeting: { type: 'greeting', name: '' },
  search: { type: 'search', engine: 'google' },
  quote: { type: 'quote', quote: 'ce' },
  links: { type: 'links', showIcon: true, links: [] }
}

const TIME_FORMAT_OPTIONS = [
  { value: 'clock' as const, label: t`config.widget.time.format.clock` },
  { value: '12h' as const, label: t`config.widget.time.format.12h` },
  { value: '24h' as const, label: t`config.widget.time.format.24h` }
]

const QUOTE_OPTIONS = [
  { value: 'hitokoto' as const, label: t`config.widget.quote.hitokoto` },
  ...(Object.keys(QUOTES) as (keyof typeof QUOTES)[]).map((key) => ({
    value: key,
    label: f(`config.widget.quote.${key}`)
  })),
  { value: 'custom' as const, label: t`config.widget.quote.custom` }
]

const SEARCH_ENGINE_OPTIONS = ENGINES.map(({ key, name }) => ({ value: key, label: name }))

const WidgetFields: React.FC<{ widget: Widget; onChange: (widget: Widget) => void }> = ({ widget, onChange }) => {
  switch (widget.type) {
    case 'time':
      return (
        <>
          <SelectField
            label={t`config.widget.time.format`}
            value={widget.format}
            options={TIME_FORMAT_OPTIONS}
            onChange={(format) => onChange({ ...widget, format })}
          />
          <BooleanField
            label={t`config.widget.time.showDate`}
            value={widget.showDate}
            onChange={(showDate) => onChange({ ...widget, showDate })}
          />
          <BooleanField
            label={t`config.widget.time.showMinutes`}
            value={widget.showMinutes}
            onChange={(showMinutes) => onChange({ ...widget, showMinutes })}
          />
          <BooleanField
            label={t`config.widget.time.showSeconds`}
            value={widget.showSeconds}
            onChange={(showSeconds) => onChange({ ...widget, showSeconds })}
          />
        </>
      )
    case 'greeting':
      return (
        <TextField
          label={t`config.widget.greeting.name`}
          value={widget.name}
          onChange={(name) => onChange({ ...widget, name })}
        />
      )
    case 'search':
      return (
        <SelectField
          label={t`config.widget.search.engine`}
          value={widget.engine}
          options={SEARCH_ENGINE_OPTIONS}
          onChange={(engine) => onChange({ ...widget, engine })}
        />
      )
    case 'quote':
      return (
        <>
          <SelectField
            label={t`config.widget.quote.source`}
            value={widget.quote}
            options={QUOTE_OPTIONS}
            onChange={(quote) =>
              onChange(quote === 'custom' ? { type: 'quote', quote: 'custom', code: '' } : { type: 'quote', quote })
            }
          />
          {widget.quote === 'custom' && (
            <TextField
              label={t`config.widget.quote.code`}
              value={widget.code}
              onChange={(code) => onChange({ ...widget, code })}
            />
          )}
        </>
      )
    case 'links':
      return (
        <>
          <BooleanField
            label={t`config.widget.links.showIcon`}
            value={widget.showIcon}
            onChange={(showIcon) => onChange({ ...widget, showIcon })}
          />
          <div className="config-links">
            {widget.links.map((link, index) => (
              <div className="config-links-row" key={link.url || link.name || index.toFixed()}>
                <input
                  type="text"
                  placeholder={t`config.widget.links.name`}
                  value={link.name}
                  onChange={(e) =>
                    onChange({
                      ...widget,
                      links: widget.links.map((item, i) => (i === index ? { ...item, name: e.target.value } : item))
                    })
                  }
                />
                <input
                  type="text"
                  placeholder={t`config.widget.links.url`}
                  value={link.url}
                  onChange={(e) =>
                    onChange({
                      ...widget,
                      links: widget.links.map((item, i) => (i === index ? { ...item, url: e.target.value } : item))
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...widget, links: widget.links.filter((_, i) => i !== index) })}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="config-add-btn"
              onClick={() => onChange({ ...widget, links: [...widget.links, { name: '', url: '' }] })}
            >
              {t`config.widget.links.add`}
            </button>
          </div>
        </>
      )
    default:
      return null
  }
}

const WidgetsEditor: React.FC<WidgetsEditorProps> = ({ value, onChange }) => {
  const [pendingType, setPendingType] = useState<Widget['type']>('time')

  const updateAt = (index: number, widget: Widget): void =>
    onChange(value.map((item, i) => (i === index ? widget : item)))

  const removeAt = (index: number): void => onChange(value.filter((_, i) => i !== index))

  const moveAt = (index: number, offset: number): void => {
    const target = index + offset
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="config-section">
      {value.map((widget, index) => (
        <div className="config-widget-card" key={`${widget.type}-${index.toFixed()}`}>
          <div className="config-widget-header">
            <strong>{TYPE_OPTIONS.find((option) => option.value === widget.type)?.label ?? widget.type}</strong>
            <div className="config-widget-actions">
              <button type="button" disabled={index === 0} onClick={() => moveAt(index, -1)}>
                ↑
              </button>
              <button type="button" disabled={index === value.length - 1} onClick={() => moveAt(index, 1)}>
                ↓
              </button>
              <button type="button" onClick={() => removeAt(index)}>
                ✕
              </button>
            </div>
          </div>
          <WidgetFields widget={widget} onChange={(next) => updateAt(index, next)} />
        </div>
      ))}
      <div className="config-add-row">
        <select value={pendingType} onChange={(e) => setPendingType(e.target.value as Widget['type'])}>
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="config-add-btn"
          onClick={() => onChange([...value, DEFAULTS_BY_TYPE[pendingType]])}
        >
          {t`config.widget.add`}
        </button>
      </div>
    </div>
  )
}

export default WidgetsEditor
