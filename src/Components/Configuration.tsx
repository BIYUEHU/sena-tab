import { REFER_URL } from '@/constants/mapping'
import { f, t } from '@/i18n'
import { useState } from 'react'

interface ConfigurationProps {
  state: boolean
  initial: string
  onSave: (content: string) => void
  onCancel: (content: string) => void
}

const Configuration: React.FC<ConfigurationProps> = ({ state, initial, onSave, onCancel }) => {
  const [content, setContent] = useState(initial ?? '')

  return (
    <div>
      {state && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t`configuration.title`}</h2>
            <p
              // biome-ignore lint:
              dangerouslySetInnerHTML={{
                __html: f(
                  'configuration.tips',
                  `<a style="color: #007bff;" href="${REFER_URL}" target="_blank">👉#</a>`
                )
              }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder={t`configuration.placeholder`}
            />
            <div className="modal-footer">
              <button type="button" onClick={() => onSave(content)}>
                {t`configuration.saveBtn`}
              </button>
              <button type="button" onClick={() => onCancel(content)}>
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
