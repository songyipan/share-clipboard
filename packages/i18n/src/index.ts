import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import * as enUS from './locales/en-US.json'
import * as zhCN from './locales/zh-CN.json'

export type Language = 'zh-CN' | 'en-US'

type TranslationResource = typeof zhCN
type DotPrefix<Prefix extends string, Key extends string> = `${Prefix}.${Key}`
type TranslationKey<T, Prefix extends string = ''> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Prefix extends ''
      ? Key
      : DotPrefix<Prefix, Key>
    : T[Key] extends Record<string, unknown>
      ? TranslationKey<T[Key], Prefix extends '' ? Key : DotPrefix<Prefix, Key>>
      : never
}[keyof T & string]

export type I18nKey = TranslationKey<TranslationResource>

export type TFunction = (key: I18nKey, params?: Record<string, string | number>) => string

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: TFunction
}

interface I18nProviderProps {
  children: React.ReactNode
  storageKey?: string
  defaultLanguage?: Language
}

const DEFAULT_LANGUAGE: Language = 'zh-CN'
const DEFAULT_STORAGE_KEY = 'share-clipboard:language'
const RESOURCES: Record<Language, TranslationResource> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
  defaultLanguage = DEFAULT_LANGUAGE
}: I18nProviderProps): React.ReactElement {
  const [language, setLanguageState] = useState<Language>(() =>
    readStoredLanguage(storageKey, defaultLanguage)
  )

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== storageKey) return
      setLanguageState(readStoredLanguage(storageKey, defaultLanguage))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [defaultLanguage, storageKey])

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        localStorage.setItem(storageKey, nextLanguage)
        setLanguageState(nextLanguage)
      },
      t: (key, params) => interpolate(readTranslation(RESOURCES[language], key), params)
    }),
    [language, storageKey]
  )

  return createElement(I18nContext.Provider, { value }, children)
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}

export function isLanguage(value: unknown): value is Language {
  return value === 'zh-CN' || value === 'en-US'
}

function readStoredLanguage(storageKey: string, defaultLanguage: Language): Language {
  const storedLanguage = localStorage.getItem(storageKey)
  return isLanguage(storedLanguage) ? storedLanguage : defaultLanguage
}

function readTranslation(resource: TranslationResource, key: I18nKey): string {
  const value = key
    .split('.')
    .reduce<unknown>((current, segment) => readRecordValue(current, segment), resource)

  return typeof value === 'string' ? value : key
}

function readRecordValue(value: unknown, key: string): unknown {
  if (!value || typeof value !== 'object') return undefined
  return (value as Record<string, unknown>)[key]
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = params[key]
    return value === undefined ? match : String(value)
  })
}
