import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LiquidGlassCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function LiquidGlassCard({
  title,
  description,
  icon,
  children,
  className,
  interactive = true,
}: LiquidGlassCardProps) {
  return (
    <div
      className={cn(
        "liquid-glass-base",
        "p-6 rounded-2xl",
        "group relative overflow-hidden",
        interactive && "liquid-glass-interactive cursor-pointer",
        className
      )}
    >
      {/* Shimmer effect on hover */}
      <div className="liquid-glass-shimmer" />

      {/* Content */}
      <div className="relative z-10">
        {icon && (
          <div className="mb-4 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            {icon}
          </div>
        )}
        
        {title && (
          <h3 className="font-inter tracking-tight text-xl font-semibold mb-2 text-foreground">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="font-inter tracking-tight text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
}
