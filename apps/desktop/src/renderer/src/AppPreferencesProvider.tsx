import { I18nProvider } from '@share-clipboard/i18n'
import { ThemeProvider } from '@share-clipboard/ui/theme'

export function AppPreferencesProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  )
}
