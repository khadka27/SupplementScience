"use client";

import * as React from "react";

const SIZES = [1.0, 1.125, 1.25, 1.375, 1.5]; // rem values (16px base = 16, 18, 20, 22, 24px)
const DEFAULT_IDX = 1; // 1.125rem = 18px default
const STORAGE_KEY = "sd-font-size-idx";

/**
 * TextSizeControl — A− / A+ buttons that adjust the site font size.
 * Persisted in localStorage. Applied via CSS custom property on <html>.
 * Respects browser zoom on top of this.
 */
export function TextSizeControl() {
  const [idx, setIdx] = React.useState(DEFAULT_IDX);

  // Restore from storage on mount
  React.useEffect(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? "", 10);
    if (!isNaN(saved) && saved >= 0 && saved < SIZES.length) {
      setIdx(saved);
      document.documentElement.style.setProperty(
        "--user-font-size",
        `${SIZES[saved]}rem`
      );
    }
  }, []);

  const apply = (newIdx: number) => {
    setIdx(newIdx);
    document.documentElement.style.setProperty(
      "--user-font-size",
      `${SIZES[newIdx]}rem`
    );
    localStorage.setItem(STORAGE_KEY, String(newIdx));
  };

  return (
    <div className="text-size-control" aria-label="Text size controls">
      <button
        className="text-size-btn"
        onClick={() => apply(Math.max(0, idx - 1))}
        disabled={idx === 0}
        aria-label="Decrease text size"
        title="Smaller text (A−)"
      >
        A−
      </button>
      <button
        className="text-size-btn"
        onClick={() => apply(Math.min(SIZES.length - 1, idx + 1))}
        disabled={idx === SIZES.length - 1}
        aria-label="Increase text size"
        title="Larger text (A+)"
      >
        A+
      </button>
    </div>
  );
}
