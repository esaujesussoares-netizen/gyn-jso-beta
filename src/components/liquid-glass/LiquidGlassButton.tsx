import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, useState } from "react";

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const LiquidGlassButton = forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  ({ className, variant = "default", size = "md", children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      onClick?.(e);
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const variantClasses = {
      default: "bg-white/10 hover:bg-white/20",
      primary: "bg-gradient-to-r from-primary/30 to-primary/20 hover:from-primary/40 hover:to-primary/30",
      secondary: "bg-gradient-to-r from-secondary/30 to-secondary/20 hover:from-secondary/40 hover:to-secondary/30",
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "liquid-glass-base liquid-glass-interactive",
          "relative overflow-hidden",
          "font-inter tracking-tight font-medium",
          "transition-all duration-300",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
        {children}
      </button>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";
