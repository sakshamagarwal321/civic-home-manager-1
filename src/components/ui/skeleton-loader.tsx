
import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  className?: string
  variant?: "card" | "table" | "text" | "avatar" | "button"
  count?: number
}

export const SkeletonLoader = ({ 
  className, 
  variant = "card", 
  count = 1 
}: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-muted-foreground/20 rounded w-1/4"></div>
            </div>
          </div>
        )
      case "table":
        return (
          <div className="animate-pulse">
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-4 bg-muted-foreground/10 rounded"></div>
                <div className="h-4 bg-muted-foreground/10 rounded"></div>
                <div className="h-4 bg-muted-foreground/10 rounded"></div>
                <div className="h-4 bg-muted-foreground/10 rounded"></div>
              </div>
            </div>
          </div>
        )
      case "text":
        return (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-4/5"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
          </div>
        )
      case "avatar":
        return (
          <div className="animate-pulse">
            <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
          </div>
        )
      case "button":
        return (
          <div className="animate-pulse">
            <div className="h-10 bg-muted-foreground/20 rounded w-24"></div>
          </div>
        )
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-muted-foreground/20 rounded"></div>
          </div>
        )
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
