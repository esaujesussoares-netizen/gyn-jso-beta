import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LiquidGlassNavProps {
  children: ReactNode;
  className?: string;
}

export function LiquidGlassNav({ children, className }: LiquidGlassNavProps) {
  return (
    <nav
      className={cn(
        "liquid-glass-base",
        "flex items-center justify-between px-6 py-4",
        "border-b border-white/20 dark:border-white/10",
        className
      )}
    >
      {children}
    </nav>
  );
}

interface LiquidGlassNavItemProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function LiquidGlassNavItem({ 
  children, 
  active, 
  onClick,
  className 
}: LiquidGlassNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "liquid-glass-interactive",
        "px-4 py-2 rounded-xl",
        "font-inter tracking-tight text-sm font-medium",
        "transition-all duration-300",
        active 
          ? "bg-white/20 text-foreground shadow-lg" 
          : "bg-white/10 text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
