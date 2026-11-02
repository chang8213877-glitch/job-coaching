import {
  CERTIFICATE_PRIORITY_LABELS,
  COMPETENCY_PRIORITY_LABELS,
} from "../data/rolesData";

interface PriorityBadgeProps {
  type: "competency" | "certificate";
  priority: 1 | 2 | 3;
}

export function PriorityBadge({ type, priority }: PriorityBadgeProps) {
  if (type === "competency") {
    const label = COMPETENCY_PRIORITY_LABELS[priority as 1 | 2];
    if (priority === 1) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-bold rounded-[4px] bg-[var(--badge-p1-bg)] text-[var(--badge-p1-text)] shrink-0">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-bold rounded-[4px] bg-[var(--badge-p2-bg)] text-[var(--badge-p2-text)] shrink-0">
        {label}
      </span>
    );
  }

  // Certificate priority
  const label = CERTIFICATE_PRIORITY_LABELS[priority];
  if (priority === 1) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-bold rounded-[4px] bg-[var(--badge-p1-bg)] text-[var(--badge-p1-text)] shrink-0">
        {label}
      </span>
    );
  }
  if (priority === 2) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-bold rounded-[4px] bg-[var(--badge-p2-bg)] text-[var(--badge-p2-text)] shrink-0">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded-[4px] bg-[var(--badge-p3-bg)] text-[var(--badge-p3-text)] shrink-0">
      {label}
    </span>
  );
}
