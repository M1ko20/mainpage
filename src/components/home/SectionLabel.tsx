interface SectionLabelProps {
  index: string
  children: string
  tone?: 'light' | 'dark'
}

export function SectionLabel({ index, children, tone = 'light' }: SectionLabelProps) {
  return (
    <p
      className={`flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.14em] ${
        tone === 'dark' ? 'text-mute-dark' : 'text-mute'
      }`}
    >
      <span className="tabular-nums">({index})</span>
      <span className={`h-px w-8 ${tone === 'dark' ? 'bg-white/20' : 'bg-ink/20'}`} aria-hidden="true" />
      {children}
    </p>
  )
}
