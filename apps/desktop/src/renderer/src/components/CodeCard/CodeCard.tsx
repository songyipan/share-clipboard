import { useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { WindowTitleBar } from './WindowTitleBar'
import { ResizeHandle } from './ResizeHandle'
import { useResize } from './useResize'
import type { CodeCardConfig } from './types'
import { CODE_CARD_THEMES } from './types'

interface CodeCardProps {
  content: string
  config: CodeCardConfig
}

function CodeCardContent({
  content,
  themeBg,
  themeText,
  minHeight
}: {
  content: string
  themeBg: string
  themeText: string
  minHeight: number
}): React.JSX.Element {
  return (
    <div
      className="p-6 overflow-auto"
      style={{
        background: themeBg,
        color: themeText,
        minHeight: `${minHeight}px`
      }}
    >
      <style>{`
        .code-card-wrapper pre {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        .code-card-wrapper code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      `}</style>
      <div className="code-card-wrapper w-full">
        <MDEditor.Markdown
          source={content}
          className="!bg-transparent w-full"
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  )
}

export function CodeCard({ content, config }: CodeCardProps): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null)
  const { width, height, handleMouseDown } = useResize()
  const themeConfig = CODE_CARD_THEMES[config.theme]

  return (
    <div
      ref={cardRef}
      id="code-card"
      className="flex items-center justify-center"
      style={{
        background: config.backgroundColor,
        padding: `${config.padding}px`,
        minHeight: '100%'
      }}
    >
      <div
        className="rounded-lg shadow-2xl overflow-hidden relative"
        style={{ width: `${width}px`, minHeight: `${height}px` }}
      >
        <WindowTitleBar windowTheme={config.windowTheme} themeBg={themeConfig.bg} />
        <CodeCardContent
          content={content}
          themeBg={themeConfig.bg}
          themeText={themeConfig.text}
          minHeight={height - 40}
        />
        <ResizeHandle onMouseDown={handleMouseDown} />
      </div>
    </div>
  )
}
