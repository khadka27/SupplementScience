import { Stethoscope } from "lucide-react";

interface DoctorCalloutProps {
  message?: string;
}

/**
 * DoctorCallout — "Talk to your doctor or pharmacist" reminder.
 * Placed near dosage and safety sections in health articles.
 * Uses role="note" so screen readers announce it clearly.
 */
export function DoctorCallout({
  message = "The information on this page is for educational purposes only and does not replace professional medical advice. Before starting, stopping, or changing any supplement, talk to your doctor, pharmacist, or a qualified healthcare provider.",
}: DoctorCalloutProps) {
  return (
    <aside className="doctor-callout" role="note" aria-label="Medical advice reminder">
      <div className="doctor-callout-icon" aria-hidden="true">
        <Stethoscope size={24} />
      </div>
      <div className="doctor-callout-body">
        <p className="doctor-callout-title">Talk to your doctor or pharmacist</p>
        <p>{message}</p>
      </div>
    </aside>
  );
}
