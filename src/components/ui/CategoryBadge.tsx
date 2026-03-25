import * as LucideIcons from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types";

interface CategoryBadgeProps {
  category: CategorySlug;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const IconComponent = LucideIcons[
    config.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ size: number; className?: string }>;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-[family-name:var(--font-ui)] font-medium uppercase tracking-wider",
        size === "sm" && "px-2.5 py-1 text-[10px]",
        size === "md" && "px-3 py-1.5 text-xs",
        className
      )}
      style={{
        color: config.color,
        backgroundColor: `${config.color}15`,
        border: `1px solid ${config.color}30`,
      }}
    >
      {IconComponent && (
        <IconComponent size={size === "sm" ? 12 : 14} className="shrink-0" />
      )}
      {config.label}
    </span>
  );
}
