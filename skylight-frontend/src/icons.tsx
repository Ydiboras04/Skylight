// Small line icons. They use the text color (currentColor), set the size with `size`.
// The stroke style comes from the .ic class in index.css.

type Props = { size?: number; class?: string }

function Svg({ size = 24, class: cls = '', children }: Props & { children: preact.ComponentChildren }) {
  return (
    <svg class={`ic ${cls}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export function SunIcon(props: Props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </Svg>
  )
}

export function CloudIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M7 18h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.1 9.1 4.5 4.5 0 0 0 7 18z" />
    </Svg>
  )
}

export function RainIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M7 15h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.1 6.1 4.5 4.5 0 0 0 7 15z" />
      <path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" />
    </Svg>
  )
}

export function PinIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </Svg>
  )
}

export function ChevronIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  )
}

export function CheckIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function CloseIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

export function SparkleIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </Svg>
  )
}

// A round face; `mouth` is the SVG path from MOODS in moods.ts
export function MoodFace({ mouth, ...props }: Props & { mouth: string }) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9 9.8v.4M15 9.8v.4" />
      <path d={mouth} />
    </Svg>
  )
}

export function MoonIcon(props: Props) {
  return (
    <Svg {...props}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </Svg>
  )
}

export function SearchIcon(props: Props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </Svg>
  )
}
