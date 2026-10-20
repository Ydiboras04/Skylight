import type { Country } from '../api'

type Props = {
  countries: Country[]
  value: string
  onChange: (code: string) => void
}

export function CountrySelect({ countries, value, onChange }: Props) {
  return (
    <select value={value} onChange={(e) => onChange(e.currentTarget.value)}>
      <option value="">Choose a country</option>
      {countries.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
