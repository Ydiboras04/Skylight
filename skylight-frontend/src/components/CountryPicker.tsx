import { useEffect, useRef, useState } from 'preact/hooks'
import type { Country } from '../api'
import { CheckIcon, ChevronIcon, PinIcon, SearchIcon } from '../icons'

type Props = {
  countries: Country[]
  selected: string
  onSelect: (code: string) => void
}

// A dropdown with a search box. Keyboard: ↑ ↓ to move, Enter to pick, Esc to close.
export function CountryPicker({ countries, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0) // index of the highlighted option
  const boxRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const current = countries.find((c) => c.code === selected)

  // Match on the name or the code: "mad" → Madagascar, "fr" → France
  const query = search.trim().toLowerCase()
  const results = countries.filter(
    (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase() === query,
  )

  // When opening: clear the search and highlight the selected country
  useEffect(() => {
    if (!open) return
    setSearch('')
    setActive(Math.max(0, countries.findIndex((c) => c.code === selected)))
  }, [open])

  // Close when clicking anywhere outside the picker
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keep the highlighted option visible while using the arrow keys
  useEffect(() => {
    const item = listRef.current?.children[active] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  function choose(code: string) {
    onSelect(code)
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(Math.min(active + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(Math.max(active - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) choose(results[active].code)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div class="picker" ref={boxRef}>
      <button
        type="button"
        class={`picker-button ${open ? 'open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <PinIcon size={20} class="picker-pin" />
        <span class="picker-value">{current ? current.name : 'Choose a country'}</span>
        <ChevronIcon size={18} class="picker-chevron" />
      </button>

      {open && (
        <div class="picker-panel">
          <div class="picker-search">
            <SearchIcon size={18} />
            <input
              type="text"
              placeholder="Search a country…"
              aria-label="Search a country"
              value={search}
              autoFocus
              onInput={(e) => {
                setSearch(e.currentTarget.value)
                setActive(0)
              }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {results.length === 0 ? (
            <p class="picker-empty">No country matches “{search}”</p>
          ) : (
            <ul class="picker-list" role="listbox" ref={listRef}>
              {results.map((c, i) => (
                <li
                  key={c.code}
                  role="option"
                  aria-selected={c.code === selected}
                  class={`picker-option ${i === active ? 'active' : ''} ${c.code === selected ? 'selected' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c.code)}
                >
                  <span class="picker-code">{c.code}</span>
                  <span class="picker-name">{c.name}</span>
                  {c.code === selected && <CheckIcon size={18} class="picker-check" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
