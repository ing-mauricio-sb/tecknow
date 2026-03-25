import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/20">
          <Bot size={14} className="text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] px-3.5 py-2.5 font-[family-name:var(--font-ui)] text-[13px] leading-[1.6]",
          isUser
            ? "rounded-2xl rounded-br-sm bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/25"
            : "rounded-2xl rounded-bl-sm border-l-2 border-l-[var(--color-accent-text)]/40 bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-md shadow-black/20"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
