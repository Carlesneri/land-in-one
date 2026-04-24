---
name: tailwind-css-patterns
description: Provides comprehensive Tailwind CSS utility-first styling patterns including responsive design, layout utilities, flexbox, grid, spacing, typography, colors, and modern CSS best practices. Use when styling React/Vue/Svelte components, building responsive layouts, implementing design systems, or optimizing CSS workflow.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Tailwind CSS Development Patterns

Expert guide for building modern, responsive user interfaces with Tailwind CSS utility-first framework. Covers v4.1+ features including CSS-first configuration, custom utilities, and enhanced developer experience.

## Overview

Provides actionable patterns for responsive, accessible UIs with Tailwind CSS v4.1+. Covers utility composition, dark mode, component patterns, and performance optimization.

## When to Use

- Styling React/Vue/Svelte components
- Building responsive layouts and grids
- Implementing design systems
- Adding dark mode support
- Optimizing CSS workflow

## Quick Reference

### Responsive Breakpoints

| Prefix | Min Width | Description |
|--------|-----------|-------------|
| `sm:` | 640px | Small screens |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large screens |
| `2xl:` | 1536px | Extra large |

### Common Patterns

```html
<!-- Center content -->
<div class="flex items-center justify-center min-h-screen">
  Content
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Items -->
</div>

<!-- Card component -->
<div class="bg-white rounded-lg shadow-lg p-6">
  <h3 class="text-xl font-bold">Title</h3>
  <p class="text-gray-600">Description</p>
</div>
```

## Instructions

1. **Start Mobile-First**: Write base styles for mobile, add responsive prefixes (`sm:`, `md:`, `lg:`) for larger screens
2. **Use Design Tokens**: Leverage Tailwind's spacing, color, and typography scales
3. **Compose Utilities**: Combine multiple utilities for complex styles
4. **Extract Components**: Create reusable component classes for repeated patterns
5. **Use CVA for Variants**: When a component has multiple style options (size, color, state), use `class-variance-authority` instead of inline ternaries or string concatenation
6. **Use `cn` for Class Merging**: Always use the `cn` utility (wrapper around `clsx` + `tailwind-merge`) when combining static classes, variant output, and optional overrides — it deduplicates conflicting Tailwind utilities correctly
6. **Configure Theme**: Customize design tokens in `tailwind.config.js` or using `@theme`
7. **Verify Changes**: Test at each breakpoint using DevTools responsive mode. Check for visual regressions and accessibility issues before committing.

## Examples

### Responsive Card Component

```tsx
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden sm:flex">
      <img className="h-48 w-full object-cover sm:h-auto sm:w-48" src={product.image} />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

### Component Variants with class-variance-authority

Use `cva` whenever a component has **more than one style option** (variant, size, state, etc.).
Avoid inline ternaries or string concatenation for multi-option styling.

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define variants at module level (outside the component)
const buttonVariants = cva(
  // Base classes applied to every variant
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "hover:bg-gray-100 text-gray-700",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    // Applied when two variants match simultaneously
    compoundVariants: [
      { variant: "primary", size: "lg", className: "shadow-lg" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Usage
<Button variant="danger" size="sm">Delete</Button>
<Button variant="secondary">Cancel</Button>
```

Use a plain `Record` lookup (not `cva`) when you only need to map a prop to a **single CSS value** (e.g. a gradient string):

```tsx
const gradientByPosition: Record<"top" | "center" | "bottom", string> = {
  top:    "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 60%)",
  center: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6) 50%, transparent)",
  bottom: "linear-gradient(to top,   rgba(0,0,0,0.6) 0%, transparent 60%)",
}

// Usage
<span style={{ background: gradientByPosition[position] }} />
```

### Merging Classes with `cn`

`cn` is a thin wrapper around `clsx` (conditional classes) and `tailwind-merge` (conflict resolution).
Always use it when combining static classes, CVA output, and external `className` props.

```tsx
import { cn } from "@/lib/utils"

// ✅ Correct — tailwind-merge resolves the p-4 vs p-2 conflict in favour of the last one
<div className={cn("p-4 text-sm", isActive && "bg-blue-100", className)} />

// ❌ Wrong — naive concatenation keeps both `p-4` and `p-2`, browser picks arbitrarily
<div className={`p-4 text-sm ${isActive ? "bg-blue-100" : ""} ${className}`} />
```

The typical pattern inside a component that uses CVA:

```tsx
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      // 1. CVA resolves variant classes
      // 2. cn merges them with any caller overrides, resolving conflicts
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### Dark Mode Toggle

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 class="dark:text-white">Title</h1>
</div>
```

### Form Input

```html
<input
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="you@example.com"
/>
```

## Best Practices

1. **Consistent Spacing**: Use Tailwind's spacing scale (4, 8, 12, 16, etc.)
2. **Color Palette**: Stick to Tailwind's color system for consistency
3. **Component Extraction**: Extract repeated patterns into reusable components
4. **Variants with CVA**: Use `class-variance-authority` for any component with multiple style options; never use inline ternaries or string concatenation for variant logic
5. **Merge Classes with `cn`**: Use `cn(...)` (clsx + tailwind-merge) whenever combining fixed classes, CVA output, and caller-provided `className` overrides — it resolves Tailwind conflicts (e.g. `p-2` vs `p-4`) instead of blindly concatenating strings
5. **Utility Composition**: Prefer utility classes over `@apply` for maintainability
6. **Semantic HTML**: Use proper HTML elements with Tailwind classes
7. **Performance**: Ensure content paths include all template files for optimal purging
8. **Accessibility**: Include focus styles, ARIA labels, and respect user preferences (reduced-motion)

## Troubleshooting

### Classes Not Applying
- **Check content paths**: Ensure all template files are included in `content: []` in config
- **Verify build**: Run `npm run build` to regenerate purged CSS
- **Dev mode**: Use `npx tailwindcss -o` with `--watch` flag for live updates

### Responsive Styles Not Working
- **Order matters**: Responsive prefixes must come before non-responsive (e.g., `md:flex` not `flex md:flex`)
- **Check breakpoint values**: Verify breakpoints match your design requirements
- **DevTools**: Use browser DevTools responsive mode to test at each breakpoint

### Dark Mode Issues
- **Verify config**: Ensure `darkMode: 'class'` or `'media'` is set correctly
- **Toggle implementation**: Use `document.documentElement.classList.toggle('dark')` for class strategy
- **Initial flash**: Add `dark` class to `<html>` before body renders

## Constraints and Warnings

- **Class Proliferation**: Long class strings reduce readability; extract into components
- **Content Paths**: Misconfigured paths cause classes to be purged in production
- **Arbitrary Values**: Use sparingly; prefer design tokens for consistency
- **Specificity Issues**: Avoid `@apply` with complex selectors
- **Dark Mode**: Requires correct configuration (`class` or `media` strategy)
- **Browser Support**: Check Tailwind docs for compatibility notes

## References

- **[references/layout-patterns.md](references/layout-patterns.md)** — Flexbox, grid, spacing, typography, colors
- **[references/component-patterns.md](references/component-patterns.md)** — Cards, navigation, forms, modals, React patterns
- **[references/responsive-design.md](references/responsive-design.md)** — Responsive patterns, dark mode, container queries
- **[references/animations.md](references/animations.md)** — Transitions, transforms, built-in animations, motion preferences
- **[references/performance.md](references/performance.md)** — Bundle optimization, CSS optimization, production builds
- **[references/accessibility.md](references/accessibility.md)** — Focus management, screen readers, color contrast, ARIA
- **[references/configuration.md](references/configuration.md)** — CSS-first config, JavaScript config, plugins, presets
- **[references/reference.md](references/reference.md)** — Additional reference materials

## External Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)
- [Tailwind Play](https://play.tailwindcss.com)
