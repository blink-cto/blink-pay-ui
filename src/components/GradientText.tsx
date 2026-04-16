import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

export function GradientText({ children, className, as: Tag = 'span' }: GradientTextProps) {
  return (
    <Tag
      className={cn(
        'bg-gradient-to-r from-[#FF2D78] via-[#9B6DFF] to-[#4B7BFF] bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Tag>
  )
}
