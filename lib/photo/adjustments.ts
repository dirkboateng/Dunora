export interface Adjustments {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  saturation: number;
  vibrance: number;
  temperature: number;
  tint: number;
  hue: number;
  clarity: number;
  sharpen: number;
  noise_reduction: number;
  vignette: number;
  grain: number;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  exposure: 0, contrast: 0, highlights: 0, shadows: 0,
  whites: 0, blacks: 0, saturation: 0, vibrance: 0,
  temperature: 0, tint: 0, hue: 0, clarity: 0,
  sharpen: 0, noise_reduction: 0, vignette: 0, grain: 0,
};

export function mergeAdjustments(partial: Partial<Adjustments> | null | undefined): Adjustments {
  return { ...DEFAULT_ADJUSTMENTS, ...(partial ?? {}) };
}

export function toCssFilter(a: Adjustments): string {
  const parts: string[] = [];
  const brightness = 1 + (a.exposure / 100) * 0.5;
  if (brightness !== 1) parts.push(`brightness(${brightness.toFixed(3)})`);
  const contrast = 1 + (a.contrast / 100) * 0.5 + (a.clarity / 100) * 0.2;
  if (contrast !== 1) parts.push(`contrast(${contrast.toFixed(3)})`);
  const sat = 1 + (a.saturation / 100) + (a.vibrance / 100) * 0.6;
  if (sat !== 1) parts.push(`saturate(${Math.max(0, sat).toFixed(3)})`);
  const totalHue = a.hue + (a.temperature / 100) * 12 + (a.tint / 100) * 12;
  if (totalHue !== 0) parts.push(`hue-rotate(${totalHue.toFixed(1)}deg)`);
  if (a.temperature > 0) parts.push(`sepia(${(a.temperature / 100 * 0.25).toFixed(3)})`);
  if (a.noise_reduction > 0) parts.push(`blur(${((a.noise_reduction / 100) * 1.2).toFixed(2)}px)`);
  return parts.join(" ");
}

export type AdjustmentKey = keyof Adjustments;

export interface SliderConfig {
  key: AdjustmentKey;
  label: string;
  min: number;
  max: number;
  step: number;
  group: "light" | "color" | "effects";
}

export const SLIDERS: SliderConfig[] = [
  { key: "exposure", label: "Exposure", min: -100, max: 100, step: 1, group: "light" },
  { key: "contrast", label: "Contrast", min: -100, max: 100, step: 1, group: "light" },
  { key: "highlights", label: "Highlights", min: -100, max: 100, step: 1, group: "light" },
  { key: "shadows", label: "Shadows", min: -100, max: 100, step: 1, group: "light" },
  { key: "whites", label: "Whites", min: -100, max: 100, step: 1, group: "light" },
  { key: "blacks", label: "Blacks", min: -100, max: 100, step: 1, group: "light" },
  { key: "temperature", label: "Temperature", min: -100, max: 100, step: 1, group: "color" },
  { key: "tint", label: "Tint", min: -100, max: 100, step: 1, group: "color" },
  { key: "saturation", label: "Saturation", min: -100, max: 100, step: 1, group: "color" },
  { key: "vibrance", label: "Vibrance", min: -100, max: 100, step: 1, group: "color" },
  { key: "hue", label: "Hue shift", min: -180, max: 180, step: 1, group: "color" },
  { key: "clarity", label: "Clarity", min: -100, max: 100, step: 1, group: "effects" },
  { key: "vignette", label: "Vignette", min: -100, max: 100, step: 1, group: "effects" },
  { key: "grain", label: "Grain", min: 0, max: 100, step: 1, group: "effects" },
  { key: "sharpen", label: "Sharpen", min: 0, max: 100, step: 1, group: "effects" },
  { key: "noise_reduction", label: "Noise reduction", min: 0, max: 100, step: 1, group: "effects" },
];

export function isAdjustmentsEqual(a: Adjustments, b: Adjustments): boolean {
  for (const k of Object.keys(DEFAULT_ADJUSTMENTS) as AdjustmentKey[]) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export function isDefaultAdjustments(a: Adjustments): boolean {
  return isAdjustmentsEqual(a, DEFAULT_ADJUSTMENTS);
}
