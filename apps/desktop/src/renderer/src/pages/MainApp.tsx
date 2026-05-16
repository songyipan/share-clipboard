import { useState, useEffect } from 'react'
import { Activity, Command, ImageIcon } from 'lucide-react'

export function MainApp(): React.JSX.Element {
  const [shortcut, setShortcut] = useState<string>('')

  useEffect(() => {
    window.api.getCurrentShortcut().then(setShortcut)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部拖动区域 */}
      <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <main className="max-w-3xl mx-auto px-6 pb-8">
        {/* 状态卡片 */}
        <section className="mb-8 mt-4">
          <StatusCard />
        </section>

        {/* 使用指南 */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-wrap-balance">
            使用指南
          </h2>
          <div className="grid gap-3">
            {/* <GuideStep
              step={1}
              icon={<MousePointer className="w-4 h-4" aria-hidden="true" />}
              title="划选文本"
              description="在任意应用中选中想要处理的文字"
            /> */}
            <GuideStep
              step={1}
              icon={<Command className="w-4 h-4" aria-hidden="true" />}
              title="触发快捷键"
              description={`按下 ${shortcut || '⌘⇧C'} 唤起悬浮球`}
            />
          </div>
        </section>

        {/* 功能特性 */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-wrap-balance">
            功能特性
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <FeatureCard
              icon={<ImageIcon className="w-5 h-5" aria-hidden="true" />}
              title="图片生成"
              description="分享图片"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function StatusCard(): React.JSX.Element {
  const [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    window.api.isListenerActive().then(setActive)
  }, [])

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              active ? 'bg-primary shadow-lg shadow-primary/25' : 'bg-muted'
            }`}
          >
            <Activity
              className={`w-5 h-5 transition-colors ${
                active ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-wrap-balance">
              {active ? '运行中' : '已暂停'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {active ? '划词监听已启用' : '划词监听未启用'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-sm font-medium transition-colors ${
              active ? 'text-green-500' : 'text-muted-foreground'
            }`}
          >
            {active ? '正常' : '异常'}
          </span>
        </div>
      </div>
    </div>
  )
}

function GuideStep({
  step,
  icon,
  title,
  description
}: {
  step: number
  icon: React.ReactNode
  title: string
  description: string
}): React.JSX.Element {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary/20">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm"
        aria-hidden="true"
      >
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 min-w-0">
          <span className="text-muted-foreground flex-shrink-0">{icon}</span>
          <h3 className="font-medium text-foreground truncate">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}): React.JSX.Element {
  return (
    <div className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-center focus-within:ring-2 focus-within:ring-primary/20">
      <div
        className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-medium text-foreground text-sm mb-1 text-wrap-balance">{title}</h3>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
  )
}
