import type { WindowTheme } from './types'

interface WindowTitleBarProps {
  windowTheme: WindowTheme
  themeBg: string
}

export function WindowTitleBar({
  windowTheme,
  themeBg
}: WindowTitleBarProps): React.JSX.Element | null {
  if (windowTheme === 'none') return null

  const isMacos = windowTheme === 'macos'

  return (
    <div className="flex items-center px-4 h-10 gap-2" style={{ background: themeBg }}>
      {isMacos ? (
        <>
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </>
      ) : (
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-3 h-0.5 bg-gray-400" />
          <div className="w-3 h-3 border border-gray-400" />
          <div className="w-3 h-3 border-t-2 border-r-2 border-gray-400 rotate-45" />
        </div>
      )}
    </div>
  )
}
