
import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl"
  gradient?: boolean
  hover?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = "md", gradient = false, hover = true, ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md", 
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-white/20 bg-white/10 shadow-xl transition-all duration-300",
          blurClasses[blur],
          gradient && "bg-gradient-to-br from-white/20 to-white/5",
          hover && "hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
