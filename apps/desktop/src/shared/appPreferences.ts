export type TriggerMode = 'auto' | 'shortcut'

export interface AppPreferences {
  triggerMode: TriggerMode
  shortcut: string
}

export function getDefaultShortcutForPlatform(platform: NodeJS.Platform): string {
  return platform === 'darwin' ? 'Command+Shift+C' : 'Control+Shift+C'
}

export function createDefaultPreferences(platform: NodeJS.Platform): AppPreferences {
  return {
    triggerMode: 'auto',
    shortcut: getDefaultShortcutForPlatform(platform)
  }
}

export function isTriggerMode(value: string): value is TriggerMode {
  return value === 'auto' || value === 'shortcut'
}

const MODIFIER_ALIASES: Record<string, string> = {
  cmd: 'Command',
  command: 'Command',
  commandorcontrol: 'CommandOrControl',
  ctrl: 'Control',
  control: 'Control',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  super: 'Super',
  meta: 'Command'
}

export function normalizeAccelerator(raw: string): string | null {
  const parts = raw
    .trim()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) return null

  const normalized = parts.map((part, index) => {
    const isLast = index === parts.length - 1
    if (isLast) {
      if (part.length === 1) return part.toUpperCase()
      return part.slice(0, 1).toUpperCase() + part.slice(1)
    }
    const key = part.toLowerCase()
    return MODIFIER_ALIASES[key] ?? part
  })

  const modifiers = normalized.slice(0, -1)
  const key = normalized[normalized.length - 1]
  const hasModifier = modifiers.some((part) =>
    ['Command', 'Control', 'Alt', 'Shift', 'Super', 'CommandOrControl'].includes(part)
  )

  if (!hasModifier || !key) return null
  return normalized.join('+')
}
