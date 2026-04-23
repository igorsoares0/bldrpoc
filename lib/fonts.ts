export type FontFamilyOption = {
  value: string
  label: string
  italicSupported: boolean
}

export const DEFAULT_FONT_FAMILY = ''

export const FONT_FAMILIES: FontFamilyOption[] = [
  { value: DEFAULT_FONT_FAMILY, label: 'Default (system)', italicSupported: true },
  { value: 'var(--font-inter), system-ui, sans-serif', label: 'Inter', italicSupported: true },
  {
    value: 'var(--font-space-grotesk), system-ui, sans-serif',
    label: 'Space Grotesk',
    italicSupported: false,
  },
  { value: 'var(--font-lora), Georgia, serif', label: 'Lora (serif)', italicSupported: true },
  {
    value: 'var(--font-playfair), Georgia, serif',
    label: 'Playfair Display (serif)',
    italicSupported: true,
  },
  {
    value: 'var(--font-jetbrains-mono), ui-monospace, monospace',
    label: 'JetBrains Mono',
    italicSupported: true,
  },
]

export function fontSupportsItalic(value: string | undefined): boolean {
  if (!value) return true
  const match = FONT_FAMILIES.find((f) => f.value === value)
  return match ? match.italicSupported : true
}
