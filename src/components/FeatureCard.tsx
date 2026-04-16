import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  accentColor?: 'teal' | 'pink' | 'purple'
}

const accentStyles = {
  teal: { icon: 'text-[#00D4B8]', bg: 'bg-[#00D4B8]/10', hover: 'hover:border-[#00D4B8]/30' },
  pink: { icon: 'text-[#FF2D78]', bg: 'bg-[#FF2D78]/10', hover: 'hover:border-[#FF2D78]/30' },
  purple: { icon: 'text-[#9B6DFF]', bg: 'bg-[#9B6DFF]/10', hover: 'hover:border-[#9B6DFF]/30' },
}

export function FeatureCard({ icon: Icon, title, description, accentColor = 'teal' }: FeatureCardProps) {
  const styles = accentStyles[accentColor]
  return (
    <Card className={cn('bg-card border-border transition-colors duration-300 h-full', styles.hover)}>
      <CardHeader className="pb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-2', styles.bg)}>
          <Icon className={cn('w-5 h-5', styles.icon)} />
        </div>
        <h3 className="text-foreground font-semibold text-lg leading-tight">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
