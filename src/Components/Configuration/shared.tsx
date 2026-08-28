interface FieldProps {
  label: string
  children: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({ label, children }) => (
  <div className="field">
    <span>{label}</span>
    {children}
  </div>
)

interface SelectFieldProps<T extends string> {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}

export const SelectField = <T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) => (
  <Field label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </Field>
)

interface NumberFieldProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export const NumberField: React.FC<NumberFieldProps> = ({ label, value, min, max, onChange }) => (
  <Field label={label}>
    <input type="number" value={value} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))} />
  </Field>
)

interface TextFieldProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export const TextField: React.FC<TextFieldProps> = ({ label, value, placeholder, onChange }) => (
  <Field label={label}>
    <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  </Field>
)

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => (
  <Field label={label}>
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
  </Field>
)

interface BooleanFieldProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export const BooleanField: React.FC<BooleanFieldProps> = ({ label, value, onChange }) => (
  <label className="field field-boolean">
    <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
)
