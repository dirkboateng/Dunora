"use client";

import { useEffect, useRef } from "react";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  bipolar?: boolean;
}

export function AdjustmentSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  bipolar = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const range = max - min;
    if (bipolar && min < 0 && max > 0) {
      const center = (-min / range) * 100;
      const cur = ((value - min) / range) * 100;
      const left = Math.min(center, cur);
      const right = Math.max(center, cur);
      el.style.background = `linear-gradient(to right, var(--line) 0%, var(--line) ${left}%, var(--accent) ${left}%, var(--accent) ${right}%, var(--line) ${right}%, var(--line) 100%)`;
    } else {
      const pct = ((value - min) / range) * 100;
      el.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--line) ${pct}%, var(--line) 100%)`;
    }
  }, [value, min, max, bipolar]);

  const isDefault = bipolar ? value === 0 : value === min;

  function reset() {
    onChange(bipolar ? 0 : min);
  }

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-ink-2">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
            }}
            className="w-12 text-right text-xs font-mono text-ink bg-transparent border-0 outline-none focus:bg-surface-2 rounded px-1 py-0.5"
          />
          <button
            type="button"
            onClick={reset}
            disabled={isDefault}
            className="text-[10px] font-semibold text-muted hover:text-ink-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Reset"
            aria-label={`Reset ${label}`}
          >
            ↺
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        onDoubleClick={reset}
        className="dunora-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
      />
      <style jsx>{`
        .dunora-slider {
          -webkit-appearance: none;
        }
        .dunora-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--surface);
          border: 2px solid var(--accent);
          cursor: grab;
          transition: transform 0.15s ease;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        }
        .dunora-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
        .dunora-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--surface);
          border: 2px solid var(--accent);
          cursor: grab;
          transition: transform 0.15s ease;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        }
        .dunora-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}
