interface GaugeProgressBarProps {
  percent: number;
  label?: string;
  subLabel?: string;
  showPercentText?: boolean;
  className?: string;
}

export function GaugeProgressBar({
  percent,
  label,
  subLabel,
  showPercentText = true,
  className = "",
}: GaugeProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentText) && (
        <div className="flex items-center justify-between mb-1 text-[13px]">
          {label && <span className="font-semibold text-[var(--ink)]">{label}</span>}
          {subLabel && <span className="text-[var(--mute)] ml-auto mr-2">{subLabel}</span>}
          {showPercentText && (
            <span className="font-mono tabular-nums font-semibold text-[var(--ink)]">
              {clampedPercent}%
            </span>
          )}
        </div>
      )}
      <div
        className="gauge-track w-full"
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "진행률"}
      >
        <div
          className="gauge-fill"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
}
