"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop — fixed button that appears after 400px scroll.
 * Large touch target (48×48px), labeled for screen readers,
 * hidden via opacity (stays in DOM so it doesn't cause layout shift).
 * Respects prefers-reduced-motion via CSS.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`back-to-top ${visible ? "visible" : ""}`}
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
    </button>
  );
}
