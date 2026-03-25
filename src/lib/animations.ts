export function staggerDelay(index: number, baseMs: number = 80): string {
  return `${index * baseMs}ms`;
}

export function staggerStyle(index: number, baseMs: number = 80) {
  return { animationDelay: staggerDelay(index, baseMs) };
}
