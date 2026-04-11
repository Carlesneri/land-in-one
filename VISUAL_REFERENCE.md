# 🎨 Land In One - UI System Visual Reference

## Component Gallery

### Button Variants
```
Primary:    [Indigo→Blue Gradient] Create New
Secondary:  [Light Slate] View Details  
Outline:    [Indigo Border] Learn More
Ghost:      [No Background] Minimal Action
Danger:     [Red Background] Delete Item
```

### Status Badges
```
Active:     [Indigo Background] Active
Success:    [Green Background] Completed
Warning:    [Amber Background] Pending
Error:      [Red Background] Failed
Neutral:    [Slate Background] Neutral
```

### Color Combinations

**Primary Actions**
- Button: Indigo-600 → Blue-600 gradient
- Hover: Darker gradient + shadow
- Focus: Ring-2 ring-indigo-500

**Secondary Actions**
- Button: Slate-100 background
- Hover: Slate-200
- Focus: Ring-2 ring-slate-300

**Danger Actions**
- Button: Red-600 background
- Hover: Red-700
- Focus: Ring-2 ring-red-500

### Typography Hierarchy
```
Page Title      text-4xl md:text-5xl font-bold
Section Title   text-2xl font-bold
Subsection      text-lg font-semibold
Body Text       text-base
Small Label     text-sm
Caption         text-xs
```

### Spacing Grid
```
Compact:    gap-2  (0.5rem)
Normal:     gap-4  (1rem)
Relaxed:    gap-6  (1.5rem)
Generous:   gap-8  (2rem)
```

### Component Sizes
```
Button:     sm (small), md (medium), lg (large), icon
Avatar:     sm, md, lg, xl
Spinner:    sm, md, lg
Modal:      sm (max-w-sm), md (max-w-md), lg (max-w-lg)
Container:  sm (2xl), md (4xl), lg (6xl), xl (7xl)
```

### Responsive Behavior
```
Mobile (< 640px):
  ├─ Stack vertically
  ├─ Full width components
  ├─ Single column layouts
  └─ Large touch targets

Tablet (640px - 1024px):
  ├─ Two column grids
  ├─ Condensed sidebars
  ├─ Horizontal menus
  └─ Medium spacing

Desktop (1024px+):
  ├─ Three column grids
  ├─ Side navigation
  ├─ Optimal line lengths
  └─ Enhanced spacing
```

## Shadow Elevation System
```
None:    No shadow (backgrounds)
sm:      0 1px 2px (subtle)
md:      0 4px 6px (cards at rest)
lg:      0 10px 15px (cards on hover)
xl:      0 20px 25px (modals)
```

## Animation Timings
```
Quick:   100-150ms (hover states)
Normal:  200-300ms (transitions)
Slow:    500ms+ (page animations)
```

## Border Radius Scale
```
sm:      0.375rem (inputs)
base:    0.5rem (general)
lg:      0.5rem (input)
xl:      0.75rem (cards)
2xl:     1rem (large cards)
full:    9999px (avatars)
```

## Focus States
All interactive elements have visible focus indicators:
```
Buttons:     ring-2 ring-primary-500
Inputs:      ring-2 ring-primary-200 (blue outline)
Links:       underline + color change
Cards:       shadow + border change
```

## Accessibility Features
```
✓ Keyboard Navigation
✓ Tab Order Logical
✓ Focus Indicators Visible
✓ ARIA Labels Present
✓ Color Contrast WCAG AA
✓ Screen Reader Compatible
✓ Semantic HTML
✓ Error Messages Clear
```

## Light Mode Colors Reference
```
Background:     #ffffff
Text Primary:   #0f172a (slate-900)
Text Secondary: #475569 (slate-600)
Border:         #e2e8f0 (slate-200)

Brand Primary:  #4f46e5 (indigo-600)
Brand Alt:      #3b82f6 (blue-600)
Brand Accent:   #a855f7 (purple-600)

Success:        #10b981 (emerald-600)
Warning:        #f59e0b (amber-500)
Danger:         #ef4444 (red-600)
Info:           #0ea5e9 (cyan-500)
```

## Component Usage Patterns

### Form Layout
```
FormGroup
├─ FormLabel
├─ Input
└─ FormHelp/FormError
```

### Card Pattern
```
Card
├─ CardHeader
│  ├─ CardTitle
│  └─ CardDescription
├─ CardContent
└─ CardFooter
```

### Modal Pattern
```
Modal (isOpen, onClose, title)
├─ Content (children)
├─ Close Button (auto)
└─ Backdrop (auto)
```

### Alert Pattern
```
Alert (variant)
├─ AlertTitle
└─ AlertDescription
```

### Empty State Pattern
```
Empty
├─ icon
├─ title
├─ description
└─ action
```

---

**Reference Version:** 1.0.0  
**Last Updated:** April 11, 2026
