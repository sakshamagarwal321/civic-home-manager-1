
import { forwardRef } from "react"
import { Button, ButtonProps } from "./button"
import { LoadingSpinner } from "./loading-spinner"
import { cn } from "@/lib/utils"

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ children, loading, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative transition-all duration-200 hover:scale-105 active:scale-95",
          loading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading && (
          <LoadingSpinner size="sm" className="mr-2" />
        )}
        {loading ? loadingText || "Loading..." : children}
      </Button>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"
