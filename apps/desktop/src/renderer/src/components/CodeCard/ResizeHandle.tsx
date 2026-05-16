interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
}

export function ResizeHandle({ onMouseDown }: ResizeHandleProps): React.JSX.Element {
  return (
    <div
      className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize resize-handle"
      style={{
        background:
          'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 70%)',
        zIndex: 100,
        margin: '0 2px 2px 0'
      }}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
          width: '16px',
          height: '16px',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.4) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.4) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px',
          borderRadius: '2px'
        }}
      />
    </div>
  )
}
