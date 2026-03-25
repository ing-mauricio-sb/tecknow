import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text-primary)] md:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text-primary)]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 max-w-[68ch] font-[family-name:var(--font-body)] text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-4 list-disc space-y-1 font-[family-name:var(--font-body)] text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-4 list-decimal space-y-1 font-[family-name:var(--font-body)] text-[17px] leading-[1.8] text-[var(--color-text-primary)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-[var(--color-text-primary)]">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent-text)] underline decoration-[var(--color-accent-text)]/30 underline-offset-2 transition-colors hover:decoration-[var(--color-accent-text)]"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-[var(--color-accent)] pl-4 font-[family-name:var(--font-body)] italic text-[var(--color-text-secondary)]">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[#0A0A14] p-5 font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[var(--color-text-primary)]">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-[var(--color-border)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent-text)]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-6 overflow-hidden rounded-lg">{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
