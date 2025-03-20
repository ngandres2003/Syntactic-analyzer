import { cn } from "../../lib/utils"

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

