import { Zap } from "lucide-react";
import type { ArticleSummary } from "@/types";

interface BreakingTickerProps {
  articles: ArticleSummary[];
}

export function BreakingTicker({ articles }: BreakingTickerProps) {
  if (articles.length === 0) return null;

  const content = articles.map((a) => a.titulo).join("  \u2022  ");

  return (
    <div className="overflow-hidden border-b border-[var(--color-breaking)]/20 bg-[var(--color-breaking)]">
      <div className="mx-auto flex max-w-7xl items-center">
        {/* Label */}
        <div className="flex shrink-0 items-center gap-1.5 bg-[var(--color-breaking)] px-4 py-2">
          <Zap size={14} className="animate-pulse-dot text-white" />
          <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wider text-white">
            Breaking
          </span>
        </div>

        {/* Scrolling content */}
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="animate-ticker flex whitespace-nowrap">
            <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-white/95">
              {content}&nbsp;&nbsp;&bull;&nbsp;&nbsp;{content}&nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
