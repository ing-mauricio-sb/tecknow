import { MessageSquare } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="group flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 px-3.5 py-2.5 text-left font-[family-name:var(--font-ui)] text-xs leading-relaxed text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-accent-text)]/30 hover:bg-[var(--color-accent-text)]/8 hover:text-[var(--color-text-primary)] hover:shadow-md hover:shadow-[var(--color-accent-glow)]"
        >
          <MessageSquare
            size={13}
            className="mt-0.5 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent-text)]"
          />
          <span>{q}</span>
        </button>
      ))}
    </div>
  );
}
