export type CodeCardTheme =
  | 'dracula'
  | 'github-dark'
  | 'github-light'
  | 'monokai'
  | 'solarized-dark'
  | 'solarized-light'

export type WindowTheme = 'none' | 'macos' | 'windows'

export interface CodeCardConfig {
  theme: CodeCardTheme
  windowTheme: WindowTheme
  backgroundColor: string
  padding: number
  showLineNumbers: boolean
}

export const CODE_CARD_THEMES: Record<CodeCardTheme, { label: string; bg: string; text: string }> =
  {
    dracula: { label: 'Dracula', bg: '#282a36', text: '#f8f8f2' },
    'github-dark': { label: 'GitHub Dark', bg: '#0d1117', text: '#c9d1d9' },
    'github-light': { label: 'GitHub Light', bg: '#ffffff', text: '#24292e' },
    monokai: { label: 'Monokai', bg: '#272822', text: '#f8f8f2' },
    'solarized-dark': { label: 'Solarized Dark', bg: '#002b36', text: '#839496' },
    'solarized-light': { label: 'Solarized Light', bg: '#fdf6e3', text: '#657b83' }
  }

export const WINDOW_THEMES: Record<WindowTheme, { label: string }> = {
  none: { label: '无' },
  macos: { label: 'macOS' },
  windows: { label: 'Windows' }
}

export const BACKGROUND_COLORS = [
  { label: '默认', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '蓝色', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { label: '红色', value: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)' },
  { label: '绿色', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { label: '紫色', value: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' }
]
