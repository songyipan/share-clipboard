import { useState, useEffect } from 'react'
import { MousePointer, Sparkles, Activity, Command } from 'lucide-react'

export function MainApp(): React.JSX.Element {
  const [shortcut, setShortcut] = useState<string>('')

  useEffect(() => {
    window.api.getCurrentShortcut().then(setShortcut)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部拖动区域 - 适配 hiddenInset 标题栏 */}
      <div className="h-10 w-full" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />

      <div className="max-w-3xl mx-auto px-6 pb-8">
        {/* 状态卡片 */}
        <section className="mb-8 mt-8">
          <StatusCard />
        </section>

        {/* 使用指南 */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            使用指南
          </h2>
          <div className="grid gap-3">
            <GuideStep
              step={1}
              icon={<MousePointer className="w-4 h-4" />}
              title="划选文本"
              description="在任意应用中选中想要处理的文字"
            />
            <GuideStep
              step={2}
              icon={<Command className="w-4 h-4" />}
              title="触发快捷键"
              description={`按下 ${shortcut || 'Ctrl+Shift+C'} 唤起悬浮球`}
            />
            <GuideStep
              step={3}
              icon={<Sparkles className="w-4 h-4" />}
              title="选择功能"
              description="点击搜索、翻译或图片识别按钮"
            />
          </div>
        </section>

        {/* 功能特性 */}
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            功能特性
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <FeatureCard icon={<SearchIcon />} title="智能搜索" description="一键跳转搜索引擎" />
            <FeatureCard
              icon={<TranslateIcon />}
              title="多语言翻译"
              description="支持多种语言互译"
            />
            <FeatureCard icon={<ImageIcon />} title="图片识别" description="文字转图片搜索" />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatusCard(): React.JSX.Element {
  const [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    window.api.isListenerActive().then(setActive)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-6">
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              active ? 'bg-primary shadow-lg shadow-primary/25' : 'bg-muted'
            }`}
          >
            <Activity
              className={`w-5 h-5 transition-colors ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{active ? '运行中' : '已暂停'}</h3>
            <p className="text-sm text-muted-foreground">
              {active ? '划词监听已启用' : '划词监听未启用'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${active ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}
          />
          <span
            className={`text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
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
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-200">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-muted-foreground">{icon}</span>
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
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
    <div className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-center">
      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="font-medium text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

// 图标组件
function SearchIcon(): React.JSX.Element {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}

function TranslateIcon(): React.JSX.Element {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
  )
}

function ImageIcon(): React.JSX.Element {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}
