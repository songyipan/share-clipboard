import type { I18nKey } from '@share-clipboard/i18n'

export type CodeCardTheme =
  | 'andromeeda'
  | 'catppuccin-mocha'
  | 'dark-plus'
  | 'dracula'
  | 'github-dark'
  | 'github-light'
  | 'gruvbox-dark'
  | 'material-theme'
  | 'min-dark'
  | 'monokai'
  | 'night-owl'
  | 'nord'
  | 'one-dark-pro'
  | 'rose-pine'
  | 'solarized-dark'
  | 'solarized-light'
  | 'tokyo-night'
  | 'vitesse-dark'

export type WindowTheme = 'none' | 'macos' | 'windows'

export interface CodeCardConfig {
  theme: CodeCardTheme
  windowTheme: WindowTheme
  backgroundColor: string
  padding: number
  showLineNumbers: boolean
}

interface CodeCardThemeConfig {
  label: string
  bg: string
  text: string
  shikiTheme: string
}

export const CODE_CARD_THEMES: Record<CodeCardTheme, CodeCardThemeConfig> = {
  andromeeda: {
    label: 'Andromeeda',
    bg: '#23262e',
    text: '#d5ced9',
    shikiTheme: 'andromeeda'
  },
  'catppuccin-mocha': {
    label: 'Catppuccin Mocha',
    bg: '#1e1e2e',
    text: '#cdd6f4',
    shikiTheme: 'catppuccin-mocha'
  },
  'dark-plus': { label: 'Dark+', bg: '#1e1e1e', text: '#d4d4d4', shikiTheme: 'dark-plus' },
  dracula: { label: 'Dracula', bg: '#282a36', text: '#f8f8f2', shikiTheme: 'dracula' },
  'github-dark': {
    label: 'GitHub Dark',
    bg: '#0d1117',
    text: '#c9d1d9',
    shikiTheme: 'github-dark'
  },
  'github-light': {
    label: 'GitHub Light',
    bg: '#ffffff',
    text: '#24292e',
    shikiTheme: 'github-light'
  },
  'gruvbox-dark': {
    label: 'Gruvbox Dark',
    bg: '#282828',
    text: '#ebdbb2',
    shikiTheme: 'gruvbox-dark-medium'
  },
  'material-theme': {
    label: 'Material Theme',
    bg: '#263238',
    text: '#eeffff',
    shikiTheme: 'material-theme'
  },
  'min-dark': { label: 'Min Dark', bg: '#1f1f1f', text: '#b392f0', shikiTheme: 'min-dark' },
  monokai: { label: 'Monokai', bg: '#272822', text: '#f8f8f2', shikiTheme: 'monokai' },
  'night-owl': { label: 'Night Owl', bg: '#011627', text: '#d6deeb', shikiTheme: 'night-owl' },
  nord: { label: 'Nord', bg: '#2e3440', text: '#d8dee9', shikiTheme: 'nord' },
  'one-dark-pro': {
    label: 'One Dark Pro',
    bg: '#282c34',
    text: '#abb2bf',
    shikiTheme: 'one-dark-pro'
  },
  'rose-pine': { label: 'Rosé Pine', bg: '#191724', text: '#e0def4', shikiTheme: 'rose-pine' },
  'solarized-dark': {
    label: 'Solarized Dark',
    bg: '#002b36',
    text: '#839496',
    shikiTheme: 'solarized-dark'
  },
  'solarized-light': {
    label: 'Solarized Light',
    bg: '#fdf6e3',
    text: '#657b83',
    shikiTheme: 'solarized-light'
  },
  'tokyo-night': {
    label: 'Tokyo Night',
    bg: '#1a1b26',
    text: '#a9b1d6',
    shikiTheme: 'tokyo-night'
  },
  'vitesse-dark': {
    label: 'Vitesse Dark',
    bg: '#121212',
    text: '#dbd7ca',
    shikiTheme: 'vitesse-dark'
  }
}

export const WINDOW_THEME_KEYS: WindowTheme[] = ['none', 'macos', 'windows']

export const WINDOW_THEME_LABEL_KEYS: Record<WindowTheme, I18nKey> = {
  none: 'codeCard.windowTheme.none',
  macos: 'codeCard.windowTheme.macos',
  windows: 'codeCard.windowTheme.windows'
}

export const BACKGROUND_COLORS: Array<{ labelKey: I18nKey; value: string }> = [
  {
    labelKey: 'codeCard.background.default',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    labelKey: 'codeCard.background.blue',
    value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'
  },
  {
    labelKey: 'codeCard.background.red',
    value: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)'
  },
  {
    labelKey: 'codeCard.background.green',
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  {
    labelKey: 'codeCard.background.purple',
    value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
  }
]
