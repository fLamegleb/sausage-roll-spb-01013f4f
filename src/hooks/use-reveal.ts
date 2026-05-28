import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 visible progress
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 when bottom of element enters viewport, 1 when fully visible above mid screen
      const start = vh;
      const end = vh * 0.35;
      const raw = (start - rect.top) / (start - end);
      const p = Math.max(0, Math.min(1, raw));
      setProgress(p);
      if (p > threshold) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);

  return { ref, progress, visible };
}
