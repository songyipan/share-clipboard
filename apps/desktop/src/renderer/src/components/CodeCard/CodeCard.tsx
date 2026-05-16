import { useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { WindowTitleBar } from './WindowTitleBar'
import type { CodeCardConfig } from './types'
import { CODE_CARD_THEMES } from './types'

interface CodeCardProps {
  content: string
  config: CodeCardConfig
}

export function CodeCard({ content, config }: CodeCardProps): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null)
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
        className="rounded-lg shadow-2xl overflow-hidden"
        style={{ minWidth: '400px', maxWidth: '800px' }}
      >
        <WindowTitleBar windowTheme={config.windowTheme} themeBg={themeConfig.bg} />
        <div
          className="p-4 overflow-auto"
          style={{
            background: themeConfig.bg,
            color: themeConfig.text,
            maxHeight: '500px'
          }}
        >
          <MDEditor.Markdown
            source={content}
            className="!bg-transparent"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>
    </div>
  )
}
