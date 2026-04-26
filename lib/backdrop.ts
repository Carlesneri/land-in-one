export type PaletteColor = {
  color: string // hex color: "#rrggbb"
  offset: number // 0–1
  opacity?: number // 0–1
}

export type FlatBackdrop = {
  backdropType?: BackdropType
  backdropColors?: PaletteColor[]
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
export function cssStopsToPalette(stops: string): PaletteColor[] {
  return stops.split(/,(?![^()]*\))/).map((stop) => {
    const [color, offset] = stop.trim().split(/\s+(?=\d+%$)/)
    return { ...rgbaToHexStop(color), offset: parseFloat(offset) / 100 }
  })
}

/**
 * Convert GradientPicker palette → backdropColors stored in BackdropConfig.
 * Format: "#rrggbbaa offset%" e.g. "#000000cc 0%"
 */
export function paletteToCssStops(palette: PaletteColor[]): string {
  return palette
    .map((p) => {
      const pct = Math.round(Number(p.offset) * 100)
      const hex = hexWithOpacity(p.color, p.opacity ?? 1)
      return `${hex} ${pct}%`
    })
    .join(", ")
}

export type BackdropType = "linear" | "radial" | "solid"

export function rgbaToHexStop(color: string): PaletteColor {
  // Accepts: rgba(r,g,b,a) or rgb(r,g,b) or #hex
  if (color.startsWith("#")) {
    return {
      color: color.slice(0, 7),
      offset: 0,
      opacity: color.length === 9 ? parseInt(color.slice(7, 9), 16) / 255 : 1,
    }
  }
  const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (rgba) {
    const r = parseInt(rgba[1]),
      g = parseInt(rgba[2]),
      b = parseInt(rgba[3])
    const a = rgba[4] !== undefined ? parseFloat(rgba[4]) : 1
    return { color: `#${ch(r)}${ch(g)}${ch(b)}`, offset: 0, opacity: a }
  }
  // fallback: just return black
  return { color, offset: 0, opacity: 1 }
}

export function buildBackdropCss(b: FlatBackdrop): string {
  if (
    b.backdropType === "solid" &&
    b.backdropColors &&
    b.backdropColors.length === 1
  ) {
    const { color, opacity } = b.backdropColors[0]
    if (typeof opacity === "number" && opacity < 1) {
      // Convert hex to rgb
      const hex = color.replace("#", "")
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const bVal = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r},${g},${bVal},${opacity})`
    }
    return color
  }
  const stops = b.backdropColors
    ? paletteToCssStops(b.backdropColors as PaletteColor[])
    : "#000000cc 0%, #00000000 100%"
  if (b.backdropType === "radial") return `radial-gradient(circle, ${stops})`
  return `linear-gradient(${b.backdropAngle ?? 180}deg, ${stops})`
}

/**
 * Parse a CSS gradient string (linear/radial) into type, angle, and stops (hex+alpha+offset).
 * Returns: { type, angle, stops }
 */
export function parseCssGradient(gradient: string): {
  type: BackdropType
  angle?: number
  stops: PaletteColor[]
} | null {
  // Solid color: just a hex or rgb/rgba string
  if (/^#([0-9a-f]{6,8})$/i.test(gradient) || gradient.startsWith("rgb")) {
    return {
      type: "solid",
      stops: [rgbaToHexStop(gradient)],
    }
  }
  const linear = gradient.match(/^linear-gradient\((\d+)deg,\s*(.+)\)$/i)
  if (linear) {
    const angle = Number(linear[1])
    const stops = cssStopsToPalette(linear[2])
    return { type: "linear", angle, stops }
  }
  const radial = gradient.match(/^radial-gradient\([^,]+,\s*(.+)\)$/i)
  if (radial) {
    const stops = cssStopsToPalette(radial[1])
    return { type: "radial", stops }
  }
  return null
}

/**
 * Returns a React style object for a backdrop, using PaletteColor[].
 */
export function getBackdropStyle({
  backdropType,
  backdropColors,
  backdropAngle,
}: {
  backdropType?: BackdropType
  backdropColors?: PaletteColor[]
  backdropAngle?: number
}): React.CSSProperties {
  return {
    background: buildBackdropCss({
      backdropType,
      backdropColors,
      backdropAngle,
    }),
  }
}
