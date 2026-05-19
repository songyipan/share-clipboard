export { StatusCard } from './StatusCard'

export function GuideStep({
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

export function FeatureCard({
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
