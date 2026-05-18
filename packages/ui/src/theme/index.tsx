import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Theme = "system" | "light" | "dark"
export type ResolvedTheme = Exclude<Theme, "system">

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

interface ThemeProviderProps {
  children: React.ReactNode
  storageKey?: string
  defaultTheme?: Theme
}

const DEFAULT_THEME: Theme = "system"
const DEFAULT_STORAGE_KEY = "share-clipboard:theme"
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
  defaultTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(storageKey, defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme))

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme)
    applyTheme(nextResolvedTheme)
    setResolvedTheme(nextResolvedTheme)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (): void => {
      const nextResolvedTheme = resolveTheme("system")
      applyTheme(nextResolvedTheme)
      setResolvedTheme(nextResolvedTheme)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== storageKey) return
      setThemeState(readStoredTheme(storageKey, defaultTheme))
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [defaultTheme, storageKey])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme) => {
        localStorage.setItem(storageKey, nextTheme)
        setThemeState(nextTheme)
      },
    }),
    [resolvedTheme, storageKey, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

export function isTheme(value: unknown): value is Theme {
  return value === "system" || value === "light" || value === "dark"
}

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  const storedTheme = localStorage.getItem(storageKey)
  return isTheme(storedTheme) ? storedTheme : defaultTheme
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}
