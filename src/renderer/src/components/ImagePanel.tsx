interface ImagePanelProps {
  children?: React.ReactNode
}

export function ImagePanel({ children }: ImagePanelProps): React.JSX.Element {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div
        className="flex items-center h-10 px-3 pt-2"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>
      <div className="flex-1 p-3 text-sm text-gray-500 flex items-center justify-center">
        {children || '图片功能'}
      </div>
    </div>
  )
}
