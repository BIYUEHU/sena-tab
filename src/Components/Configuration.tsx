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
            <h2>Configuration</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder="Why not add a configuration?"
            />
            <div className="modal-footer">
              <button type="button" onClick={() => onSave(content)}>
                Save
              </button>
              <button type="button" onClick={() => onCancel(content)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuration
