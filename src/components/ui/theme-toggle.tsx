
import { Moon, Sun } from "lucide-react"
import { Button } from "./button"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export const ThemeToggle = () => {
  const { actualTheme, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleTheme()
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "relative w-10 h-10 rounded-full transition-all duration-300 ease-in-out",
        "hover:bg-accent hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "active:scale-95",
        isAnimating && "scale-105"
      )}
      aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out",
            actualTheme === 'light' 
              ? "rotate-0 scale-100 opacity-100" 
              : "-rotate-90 scale-0 opacity-0"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out",
            actualTheme === 'dark' 
              ? "rotate-0 scale-100 opacity-100" 
              : "rotate-90 scale-0 opacity-0"
          )} 
        />
      </div>
      
      {/* Subtle glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-300",
          "bg-primary/10 opacity-0",
          isAnimating && "opacity-100"
        )}
      />
    </Button>
  )
}
