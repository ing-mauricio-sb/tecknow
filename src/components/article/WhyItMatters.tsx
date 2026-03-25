import { Target } from "lucide-react";

interface WhyItMattersProps {
  content: string;
}

export function WhyItMatters({ content }: WhyItMattersProps) {
  return (
    <aside className="glass-subtle my-8 rounded-xl border-l-4 border-l-[var(--color-accent)] p-5 md:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Target size={18} className="text-[var(--color-accent-text)]" aria-hidden="true" />
        <h3 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-text)]">
          Por que te importa
        </h3>
      </div>
      <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--color-text-secondary)]">
        {content}
      </p>
    </aside>
  );
}
