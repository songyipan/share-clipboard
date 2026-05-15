import { useEffect, useState } from 'react'

export function ImagePanel(): React.JSX.Element {
  const [lastSelectedText, setLastSelectedText] = useState('')

  useEffect(() => {
    window.api.getLastSelectedText().then((text) => {
      setLastSelectedText(text)
    })
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div
        className="flex items-center h-10 px-3 pt-2"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>
      <div className="flex-1 p-3 text-sm text-gray-500 flex items-center justify-center whitespace-pre-wrap">
        {lastSelectedText || '图片功能'}
      </div>
    </div>
  )
}
