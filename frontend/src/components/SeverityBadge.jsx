// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/components/SeverityBadge.jsx
import { severityColors } from "../utils/constants";

export default function SeverityBadge({ severity = "LOW" }) {
  const cls = severityColors[severity] || severityColors.LOW;
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] ${cls}`}>{severity}</span>;
}
