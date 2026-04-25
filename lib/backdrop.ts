import type { BackdropType } from "@/types"

export type PaletteColor = {
  color: string // hex color: "#rrggbb"
  offset: number // 0–1
  opacity?: number // 0–1
}

export type FlatBackdrop = {
  backdropType?: BackdropType
  backdropColors?: string[]
  backdropAngle?: number
}

const ch = (n: number) => Math.round(n).toString(16).padStart(2, "0")

/**
 * Combine a 6-digit hex color + opacity (0–1) into an 8-digit hex (#rrggbbaa).
 * This is used as the CSS stop value in the gradient.
 */
function hexWithOpacity(hex: string, opacity = 1): string {
  const h = hex.replace("#", "").slice(0, 6)
  return `#${h}${ch(Math.round(opacity * 255))}`
}

/**
 * Convert stored backdropColors ("#rrggbbaa offset%") back to GradientPicker palette.
 * color is returned as 6-digit hex, opacity as 0–1 number.
 */
export function cssStopsToPalette(stops: string[]): PaletteColor[] {
  return stops.map((stop) => {
    const lastSpace = stop.lastIndexOf(" ")
    const hex8 = stop.slice(0, lastSpace)
    const pct = Number.parseFloat(stop.slice(lastSpace + 1)) / 100
    const h = hex8.replace("#", "")
    const color = `#${h.slice(0, 6)}`
    const opacity = h.length >= 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1
    return { color, offset: pct, opacity }
  })
}

/**
 * Convert GradientPicker palette → backdropColors stored in BackdropConfig.
 * Format: "#rrggbbaa offset%" e.g. "#000000cc 0%"
 */
export function paletteToCssStops(palette: PaletteColor[]): string[] {
  return palette.map((p) => {
    const pct = Math.round(Number(p.offset) * 100)
    return `${hexWithOpacity(p.color, p.opacity ?? 1)} ${pct}%`
  })
}

export function buildBackdropCss(b: FlatBackdrop): string {
  const stops = (b.backdropColors ?? []).join(", ")
  if (b.backdropType === "radial") return `radial-gradient(circle, ${stops})`
  return `linear-gradient(${b.backdropAngle ?? 180}deg, ${stops})`
}
