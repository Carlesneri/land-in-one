import { z } from "zod"

// Reserved slugs matching current application routes
export const RESERVED_SLUGS = [
  "builder",
  "dashboard",
  "login",
  "preview",
  "api",
  "auth",
  "upload-image",
] as const

export const slugSchema = z
  .string()
  .min(15, "Slug must be at least 15 characters")
  .max(100, "Slug must be at most 100 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens (no leading, trailing, or consecutive hyphens)",
  )
  .refine(
    (val) => !RESERVED_SLUGS.includes(val as (typeof RESERVED_SLUGS)[number]),
    { message: "This slug is reserved and cannot be used" },
  )

export type SlugValidationResult =
  | { valid: true }
  | { valid: false; error: string }

export function validateSlug(slug: string): SlugValidationResult {
  const result = slugSchema.safeParse(slug)
  if (result.success) return { valid: true }
  return {
    valid: false,
    error: result.error.issues[0]?.message ?? "Invalid slug",
  }
}
