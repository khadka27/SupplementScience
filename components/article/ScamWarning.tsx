import { ShieldAlert } from "lucide-react";

interface ScamWarningProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * ScamWarning — distinctive bordered callout for scam/fraud alerts.
 * Shield icon + "Warning" label so meaning is never conveyed by color alone.
 * Uses role="alert" so screen readers prioritize it.
 */
export function ScamWarning({
  title = "Warning",
  children,
}: ScamWarningProps) {
  return (
    <aside className="scam-warning" role="alert" aria-label="Scam warning">
      <div className="scam-warning-icon" aria-hidden="true">
        <ShieldAlert size={24} />
      </div>
      <div className="scam-warning-body">
        <p className="scam-warning-title">⚠ {title}</p>
        <div>{children}</div>
      </div>
    </aside>
  );
}
