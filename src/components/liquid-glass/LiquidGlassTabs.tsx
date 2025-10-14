import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface LiquidGlassTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function LiquidGlassTabs({ 
  tabs, 
  defaultTab, 
  className,
  onTabChange 
}: LiquidGlassTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tab List */}
      <div className="liquid-glass-base p-1 rounded-2xl inline-flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "liquid-glass-interactive",
              "px-4 py-2 rounded-xl",
              "font-inter tracking-tight text-sm font-medium",
              "flex items-center gap-2",
              "transition-all duration-300",
              activeTab === tab.id
                ? "bg-white/20 text-foreground shadow-lg"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/10"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="liquid-glass-base p-6 rounded-2xl animate-fade-in">
        {activeContent}
      </div>
    </div>
  );
}
