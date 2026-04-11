# UI Component Showcase & Style Guide

## Project Theme

**Name:** Land In One  
**Style:** Modern, Light-mode Only, Clean & Professional  
**Color Scheme:** Indigo + Blue Primary with Slate Neutrals

---

## Visual Components Overview

### Header Component
- Sticky top navigation with blur background
- Logo with gradient icon (L)
- Navigation links with hover effects
- User avatar or sign-in button
- Fully responsive - hamburger menu on mobile

### Footer Component
- Three-column layout on desktop, stacked on mobile
- Quick links section
- Contact email link
- Social media icons (Twitter, GitHub)
- Copyright information

### Home Page (Hero Section)
**Features:**
- Centered hero with large headline
- Split headline with gradient accent
- Supporting description text
- Dual CTAs (Primary + Secondary)
- Three feature cards below fold:
  - Lightning Fast
  - Fully Responsive
  - Easy to Use

**Color Scheme:**
- Hero background: White
- Primary button: Indigo→Blue gradient
- Secondary button: Outline style
- Feature icons: Indigo, Blue, and Purple containers

### Dashboard Page
**Layout:**
- Heading with subtitle
- Empty state when no pages exist
- Grid layout of landing pages (1 col mobile, 2 cols tablet, 3 cols desktop)
- Each card shows:
  - Landing page slug/name
  - Active badge
  - Edit button (primary)
  - Delete button (danger)

**Empty State:**
- Icon placeholder
- "No landing pages yet" message
- Description text
- Call-to-action button

### Login Page
**Components:**
- Centered card container
- Welcome heading
- Description text
- Sign in with Google button (with icon)
- Clean, minimal layout

### Dashboard Cards
- Hover effect with shadow lift
- Title truncation for long names
- Responsive button layout (stacked on mobile)
- Badge styling (active/inactive status)

---

## Color Palette in Use

### Primary Colors
```
Indigo:   #4f46e5  (Primary brand)
Blue:     #3b82f6  (Secondary brand)
Purple:   #a855f7  (Accent)
```

### State Colors
```
Success:  #10b981  (Emerald)
Warning:  #f59e0b  (Amber)
Danger:   #ef4444  (Red)
Info:     #0ea5e9  (Cyan)
```

### Neutral Colors
```
Slate-50:    #f8fafc  (Lightest background)
Slate-100:   #f1f5f9  (Light background)
Slate-200:   #e2e8f0  (Borders)
Slate-600:   #475569  (Secondary text)
Slate-900:   #0f172a  (Primary text)
```

### Special
```
Transparent Overlays: bg-black/40 (modal backdrops)
```

---

## Responsive Design Breakpoints

**Mobile First Approach:**

| Breakpoint | Width | Use Case |
|-----------|-------|----------|
| Default | <640px | Mobile phones |
| sm | ≥640px | Landscape phones |
| md | ≥768px | Tablets |
| lg | ≥1024px | Small desktops |
| xl | ≥1280px | Full desktops |
| 2xl | ≥1536px | Wide displays |

**Grid Layouts:**
- Single column on mobile
- Two columns on tablets (md)
- Three columns on desktops (lg)
- Adaptive padding on different sizes

---

## Animation & Transitions

### Hover Effects
- **Buttons:** Color fade + shadow lift (200ms)
- **Cards:** Subtle shadow increase + border change
- **Links:** Text color change to primary color
- **Icons:** Smooth scale/rotate on hover

### Entrance Animations
- **Modals:** Fade-in with zoom (95% → 100%)
- **Dropdowns:** Fade-in with scale animation
- **Page transitions:** Smooth fade (200-500ms)

### Loading States
- **Spinners:** Continuous rotation animation
- **Skeleton loaders:** Pulsing gradient animation
- **Buttons:** Disabled state with reduced opacity

---

## Typography System

### Heading Sizes
```
h1: text-4xl md:text-5xl (Hero titles)
h2: text-3xl md:text-4xl (Page titles)
h3: text-xl md:text-2xl (Section titles)
h4: text-lg               (Card titles)
```

### Body Text
```
Body:     text-base      (16px, main content)
Small:    text-sm        (14px, labels, help)
Extra:    text-xs        (12px, captions)
```

### Font Weights
```
Normal:    font-normal   (Regular text)
Medium:    font-medium   (Buttons, labels)
Semibold:  font-semibold (Subheadings)
Bold:      font-bold     (Headings)
```

---

## Component-Specific Styling

### Buttons
**Primary:**
- Background: Indigo→Blue gradient
- Text: White
- Hover: Darker gradient + shadow
- Focus: Ring-2 ring-indigo-500

**Secondary:**
- Background: Slate-100
- Text: Slate-900
- Hover: Slate-200
- Focus: Ring-2 ring-slate-300

**Outline:**
- Background: Transparent
- Border: 2px indigo-600
- Text: Indigo-600
- Hover: Indigo-50 background

**Ghost:**
- Background: Transparent
- Text: Slate-700
- Hover: Slate-100
- No shadow

**Danger:**
- Background: Red-600
- Text: White
- Hover: Red-700
- Focus: Ring-2 ring-red-500

### Input Fields
- Border: 2px slate-200
- Focus: Border indigo-500 + ring-indigo-200
- Padding: px-4 py-2.5
- Radius: lg (border-radius: 0.5rem)
- Error State: Red borders and text

### Cards
- Background: White
- Border: 1px slate-200
- Radius: xl (0.75rem)
- Shadow: sm (0 1px 2px)
- Hover: Shadow lift + border-slate-300

### Modals
- Backdrop: Black 40% opacity + blur
- Card: White background, xl radius
- Width: Max 448px (md) with padding
- Animation: Fade in + zoom from 95%

---

## Spacing System (Tailwind Scale)

```
2:    0.5rem (8px)   - Very tight
3:    0.75rem (12px) - Tight
4:    1rem (16px)    - Standard
6:    1.5rem (24px)  - Relaxed
8:    2rem (32px)    - Generous
12:   3rem (48px)    - Large
```

**Common Usage Patterns:**
- Gap between elements: `gap-4`
- Padding in containers: `p-6`
- Margin between sections: `mb-8`
- Between lines of text: `leading-relaxed`

---

## Accessibility Features

✅ **Keyboard Navigation**
- All interactive elements are keyboard accessible
- Tab order is logical
- Escape key closes modals

✅ **Screen Readers**
- ARIA labels on all buttons
- Semantic HTML (buttons, links, forms)
- Hidden icons marked with aria-hidden="true"

✅ **Visual**
- Color contrast meets WCAG AA standards
- Focus indicators visible on all elements
- No color-only information conveyed

✅ **Motor Control**
- Large touch targets (min 44x44px)
- No hover-only interactions
- Adequate spacing between clickables

---

## File Structure

```
app/ui/
├── index.ts              # Barrel export
├── Button.tsx            # Primary action component
├── Card.tsx              # Card containers
├── Input.tsx             # Text input fields
├── Textarea.tsx          # Multi-line input
├── Badge.tsx             # Status badges
├── Alert.tsx             # Alert messages
├── Modal.tsx             # Overlay modals
├── Separator.tsx         # Divider lines
├── Container.tsx         # Width-limited wrapper
├── Avatar.tsx            # User avatars
├── Skeleton.tsx          # Loading placeholders
├── Empty.tsx             # Empty states
├── Tabs.tsx              # Tab navigation
├── Spinner.tsx           # Loading spinners
├── DropdownMenu.tsx      # Context menus
├── Form.tsx              # Form helpers
└── [component].tsx       # Individual components
```

---

## Design Tokens

### Radii
```
sm: 0.375rem
base: 0.5rem
lg: 0.5rem (inputs)
xl: 0.75rem (cards)
2xl: 1rem
full: 9999px (avatars)
```

### Shadows
```
None:  No shadow
sm:    0 1px 2px 0 rgba(0,0,0,0.05)
md:    0 4px 6px -1px rgba(0,0,0,0.1)
lg:    0 10px 15px -3px rgba(0,0,0,0.1)
```

### Blur
```
sm: blur-sm (4px)
md: blur (12px)
```

---

## Usage Guidelines

1. **Always use Container for page content** - Ensures consistent max-width and padding
2. **Use semantic spacing** - Don't create custom gaps, use Tailwind scale
3. **Maintain color consistency** - Use defined palette, don't create custom colors
4. **Keep animations subtle** - Smooth transitions, nothing jarring
5. **Test responsiveness** - Check all breakpoints (mobile, tablet, desktop)
6. **Ensure accessibility** - Add ARIA labels, test with keyboard
7. **Use proper heading hierarchy** - h1 for main title, h2 for sections, etc.

---

## Browser Support

✅ Chrome/Edge (latest 2 versions)  
✅ Firefox (latest 2 versions)  
✅ Safari (latest 2 versions)  
✅ Mobile browsers (iOS Safari 12+, Chrome Mobile)

---

## Performance Notes

- All components use CSS-in-JS with class-variance-authority for minimal bundle size
- Animations use CSS transforms (GPU accelerated)
- No JavaScript animations for smooth 60fps performance
- Components are tree-shakable - only import what you use
- Tailwind classes are automatically purged in production

---

**Last Updated:** April 11, 2026  
**Status:** ✅ Production Ready
