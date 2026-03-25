"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Sparkles,
  Send,
  X,
  MessageCircle,
  Loader2,
  AlertTriangle,
  Bot,
} from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleChatbotProps {
  article: Article;
}

export function ArticleChatbot({ article }: ArticleChatbotProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(mobileOpen);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { articleSlug: article.slug },
      }),
    [article.slug]
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (error) => {
      if (
        error.message?.includes("429") ||
        error.message?.includes("rate_limit")
      ) {
        setRateLimited(true);
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const suggestedQuestions = article.preguntasChat.map((faq) => faq.pregunta);

  function handleSend(text?: string) {
    const content = text || inputValue.trim();
    if (!content || isLoading || rateLimited) return;
    sendMessage({ text: content });
    setInputValue("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend();
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatContent = (
    <div className="flex flex-col overflow-hidden">
      {/* ── Header with gradient accent bar ── */}
      <div className="relative">
        {/* Top gradient bar */}
        <div className="h-[2px] bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-text)] to-[var(--color-cat-tech)]" />

        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] shadow-lg shadow-[var(--color-accent)]/25">
              <Sparkles size={16} className="text-white" />
              {/* Pulse dot */}
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg-primary)] bg-emerald-400 animate-pulse-dot" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                TECKNOW AI
              </h3>
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text-muted)]">
                gemini-2.5-flash &middot; contextual
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)] lg:hidden"
            aria-label="Cerrar chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      {/* ── Messages area ── */}
      <div
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        style={{ maxHeight: "340px" }}
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="space-y-3">
            {/* Welcome state */}
            <div className="mb-4 flex flex-col items-center gap-2 py-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/20">
                <Bot size={18} className="text-[var(--color-accent-text)]" />
              </div>
              <p className="max-w-[200px] font-[family-name:var(--font-ui)] text-[11px] leading-relaxed text-[var(--color-text-muted)]">
                Preguntame sobre este articulo. Mis respuestas estan basadas
                unicamente en su contenido.
              </p>
            </div>
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={(q) => handleSend(q)}
            />
          </div>
        ) : (
          messages.map((msg) => {
            const textContent =
              msg.parts
                ?.filter((p) => p.type === "text")
                .map((p) => (p as { type: "text"; text: string }).text)
                .join("") || "";
            if (!textContent) return null;
            return (
              <ChatMessage
                key={msg.id}
                role={msg.role as "user" | "assistant"}
                content={textContent}
              />
            );
          })
        )}

        {/* Loading indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/20">
              <Loader2 size={13} className="animate-spin text-white" />
            </div>
            <div className="flex gap-1.5 rounded-2xl rounded-bl-sm bg-[var(--color-bg-elevated)] px-4 py-3 shadow-md shadow-black/20">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent-text)]/60 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent-text)]/60 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-accent-text)]/60 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Rate limit warning */}
        {rateLimited && (
          <div className="mx-auto max-w-[220px] rounded-xl bg-[var(--color-cat-finanzas)]/10 px-4 py-3 text-center ring-1 ring-[var(--color-cat-finanzas)]/20">
            <AlertTriangle
              size={16}
              className="mx-auto mb-1.5 text-[var(--color-cat-finanzas)]"
            />
            <p className="font-[family-name:var(--font-ui)] text-[11px] font-medium text-[var(--color-cat-finanzas)]">
              Limite de 3 preguntas/dia alcanzado
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-ui)] text-[10px] text-[var(--color-cat-finanzas)]/70">
              Vuelve manana
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggested questions after messages ── */}
      {messages.length > 0 && messages.length < 4 && !rateLimited && (
        <div className="border-t border-white/[0.04] px-4 py-2.5">
          <SuggestedQuestions
            questions={suggestedQuestions.slice(0, 2)}
            onSelect={(q) => handleSend(q)}
          />
        </div>
      )}

      {/* ── Input area ── */}
      <div className="border-t border-white/[0.06] bg-[var(--color-bg-primary)]/40 p-3">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-1 transition-all duration-300",
            inputFocused
              ? "border-[var(--color-accent-text)]/30 bg-[var(--color-bg-elevated)] shadow-[0_0_20px_var(--color-accent-glow)]"
              : "border-white/[0.06] bg-[var(--color-bg-elevated)]/60",
            rateLimited && "opacity-50"
          )}
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder={
              rateLimited
                ? "Limite diario alcanzado"
                : "Escribe tu pregunta..."
            }
            disabled={rateLimited}
            className="flex-1 bg-transparent py-2 font-[family-name:var(--font-ui)] text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || rateLimited}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white transition-all duration-200 hover:bg-[var(--color-accent-light)] hover:shadow-lg hover:shadow-[var(--color-accent)]/30 active:scale-90 disabled:opacity-30 disabled:hover:shadow-none"
            aria-label="Enviar"
          >
            <Send size={13} />
          </button>
        </form>
        <p className="mt-2 text-center font-[family-name:var(--font-mono)] text-[9px] tracking-wide text-[var(--color-text-muted)]/60">
          respuestas basadas en el contenido del articulo
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — sidebar card */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--color-bg-surface)]/80 shadow-2xl shadow-black/40 backdrop-blur-xl lg:flex lg:flex-col">
        {chatContent}
      </div>

      {/* Mobile — FAB + Bottom Sheet */}
      <div className="lg:hidden">
        {/* Floating Action Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className={cn(
            "fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white shadow-xl shadow-[var(--color-accent)]/30 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-[var(--color-accent)]/40 active:scale-95",
            mobileOpen && "hidden"
          )}
          aria-label="Abrir chat"
        >
          <MessageCircle size={22} />
          {/* Pulse ring */}
          <span className="absolute inset-0 animate-ping rounded-2xl bg-[var(--color-accent)]/20 [animation-duration:3s]" />
        </button>

        {/* Bottom Sheet */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <div className="animate-slide-up-sheet fixed right-0 bottom-0 left-0 z-50 flex max-h-[75vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/[0.08] bg-[var(--color-bg-surface)]/95 shadow-2xl backdrop-blur-xl">
              {chatContent}
            </div>
          </>
        )}
      </div>
    </>
  );
}
