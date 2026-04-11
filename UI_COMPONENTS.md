# Land In One - UI Component System

## Overview

A comprehensive, fully responsive, light-mode only UI component library built with React, TypeScript, and Tailwind CSS v4. All components use modern design patterns with smooth animations and transitions, perfect for building landing page builders and SaaS applications.

## Color Palette

The system uses a modern light mode color scheme:

- **Primary**: Indigo (`#4f46e5`) - Main action colors with gradient overlays
- **Accent**: Blue (`#3b82f6`) - Supporting brand color
- **Neutral**: Slate (`#64748b`) - Text, borders, backgrounds
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Danger/Error**: Red (`#ef4444`)
- **Background**: White (`#ffffff`)
- **Text**: Slate-900 (`#0f172a`)

## Core Components

### 1. **Button**
Flexible button component with multiple variants and sizes.

```tsx
import { Button } from "@/app/ui/Button"

// Primary action
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon">•••</Button>

// Full width
<Button fullWidth>Full Width</Button>

// Disabled
<Button disabled>Disabled</Button>
```

**Variants:**
- `primary`: Gradient indigo-blue with shadow, perfect for CTAs
- `secondary`: Light slate background
- `outline`: Border-based with hover fill
- `ghost`: Minimal hover effect
- `danger`: Red background for destructive actions

### 2. **Card**
Container component for content grouping with header, content, and footer.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/ui/Card"

<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Props:**
- `hover`: Adds hover animation and shadow effect

### 3. **Input**
Text input with optional error states and helper text.

```tsx
import { Input } from "@/app/ui/Input"

<Input placeholder="Enter text" />
<Input error helperText="This field is required" />
<Input helperText="Example: john@example.com" />
```

**Props:**
- `error`: Boolean to show error state
- `helperText`: Helper or error message below input

### 4. **Textarea**
Multi-line text input with same features as Input.

```tsx
import { Textarea } from "@/app/ui/Textarea"

<Textarea placeholder="Enter description" rows={5} />
<Textarea error helperText="Max 500 characters" />
```

### 5. **Badge**
Inline label component with color variants.

```tsx
import { Badge } from "@/app/ui/Badge"

<Badge variant="default">Active</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="slate">Neutral</Badge>
```

### 6. **Alert**
Dismissible alert messages with icon support.

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/app/ui/Alert"

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

<Alert variant="danger">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

**Variants:** `default`, `success`, `warning`, `danger`, `info`

### 7. **Modal**
Centered overlay modal with backdrop and smooth animations.

```tsx
import { Modal } from "@/app/ui/Modal"
import { useState } from "react"

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        size="md"
      >
        <p>Are you sure?</p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="danger">Confirm</Button>
        </div>
      </Modal>
    </>
  )
}
```

**Props:**
- `isOpen`: Boolean to control visibility
- `onClose`: Callback when modal closes
- `title`: Modal header title
- `size`: `"sm"`, `"md"`, `"lg"` (default: `"md"`)
- `closeButton`: Show close button (default: `true`)

### 8. **Separator**
Visual divider line.

```tsx
import { Separator } from "@/app/ui/Separator"

<Separator />
<Separator orientation="vertical" />
```

**Props:**
- `orientation`: `"horizontal"` (default) or `"vertical"`

### 9. **Container**
Max-width wrapper for responsive layouts.

```tsx
import { Container } from "@/app/ui/Container"

<Container>
  <h1>Page content</h1>
</Container>

<Container size="sm">
  <p>Narrower container</p>
</Container>
```

**Sizes:** `"sm"` (max-w-2xl), `"md"` (max-w-4xl), `"lg"` (max-w-6xl), `"xl"` (max-w-7xl)

### 10. **Avatar**
User avatar with image fallback and initials.

```tsx
import { Avatar } from "@/app/ui/Avatar"

<Avatar src="/user.png" alt="User" />
<Avatar initials="JD" fallbackColor="indigo" />
```

**Props:**
- `src`: Image URL
- `alt`: Image alt text
- `size`: `"sm"`, `"md"`, `"lg"`, `"xl"` (default: `"md"`)
- `initials`: Text to show as fallback
- `fallbackColor`: Color for fallback background

### 11. **Skeleton**
Loading placeholder with pulsing animation.

```tsx
import { Skeleton } from "@/app/ui/Skeleton"

<div className="space-y-3">
  <Skeleton className="h-12 w-12 rounded-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

### 12. **Empty**
Empty state component with icon, title, description, and action.

```tsx
import { Empty } from "@/app/ui/Empty"

<Empty
  title="No items yet"
  description="Create your first item to get started"
  action={<Button>Create Item</Button>}
/>
```

### 13. **Tabs**
Tabbed navigation component.

```tsx
import { Tabs } from "@/app/ui/Tabs"

<Tabs
  tabs={[
    { id: "tab1", label: "Overview", content: <p>Content 1</p> },
    { id: "tab2", label: "Details", content: <p>Content 2</p> },
  ]}
  defaultTab="tab1"
/>
```

### 14. **Spinner**
Loading spinner with customizable size and color.

```tsx
import { Spinner } from "@/app/ui/Spinner"

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" color="indigo" />
<Spinner color="white" />
```

**Props:**
- `size`: `"sm"`, `"md"`, `"lg"` (default: `"md"`)
- `color`: `"indigo"`, `"white"` (default: `"indigo"`)

### 15. **DropdownMenu**
Context menu with custom actions.

```tsx
import { DropdownMenu } from "@/app/ui/DropdownMenu"

<DropdownMenu
  trigger={<Button>•••</Button>}
  items={[
    { id: "edit", label: "Edit", onClick: () => {} },
    { id: "delete", label: "Delete", onClick: () => {}, variant: "danger" },
  ]}
/>
```

### 16. **Form Utilities**
Helper components for form layouts.

```tsx
import { FormGroup, FormLabel, FormError, FormHelp } from "@/app/ui/Form"

<FormGroup>
  <FormLabel htmlFor="email" required>Email</FormLabel>
  <Input id="email" type="email" />
  <FormHelp>We'll never share your email</FormHelp>
</FormGroup>

<FormGroup>
  <FormLabel htmlFor="password">Password</FormLabel>
  <Input id="password" type="password" error />
  <FormError>Password must be at least 8 characters</FormError>
</FormGroup>
```

## Responsive Breakpoints

All components are fully responsive using Tailwind CSS breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example responsive usage:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>
```

## Typography

The system uses a clean, modern typography scale:

- **Display**: `text-3xl` to `text-6xl` (headings)
- **Heading**: `text-xl` to `text-2xl` (subheadings)
- **Body**: `text-base` (main content)
- **Small**: `text-sm` (labels, help text)
- **Extra Small**: `text-xs` (captions)

Example:
```tsx
<h1 className="text-4xl md:text-5xl font-bold text-slate-900">
  Main Heading
</h1>
<p className="text-slate-600 mt-2">
  Supporting paragraph
</p>
```

## Spacing System

Consistent spacing using Tailwind's scale:

- `gap-2` (0.5rem) - Tight spacing
- `gap-4` (1rem) - Standard spacing
- `gap-6` (1.5rem) - Relaxed spacing
- `gap-8` (2rem) - Generous spacing

## Animations

All interactive components include smooth transitions:

- Buttons: Color/shadow transitions on hover
- Cards: Shadow and opacity on hover
- Modals: Fade-in with zoom animation
- Dropdowns: Smooth open/close with scale animation

## Accessibility

All components follow web accessibility standards:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Focus indicators on all interactive elements
- ✅ Semantic HTML elements
- ✅ Color contrast ratios meet WCAG AA standards
- ✅ Screen reader compatible

## Usage Example

```tsx
"use client"

import { useState } from "react"
import { Container } from "@/app/ui/Container"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/ui/Card"
import { Button } from "@/app/ui/Button"
import { Input } from "@/app/ui/Input"
import { Badge } from "@/app/ui/Badge"

export function Dashboard() {
  const [name, setName] = useState("")

  return (
    <Container>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>

        <Card hover>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Badge variant="success">Active</Badge>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
```

## Installation & Import

All components are located in `app/ui/` and can be imported:

```tsx
// Individual imports
import { Button } from "@/app/ui/Button"
import { Card } from "@/app/ui/Card"

// Bulk import from index
import { Button, Card, Input, Badge } from "@/app/ui"
```

## Customization

Components accept standard HTML attributes and className props for customization:

```tsx
<Button
  className="custom-class"
  onClick={handleClick}
  disabled={isLoading}
>
  Custom Button
</Button>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Tree-shakable ES modules
- No unused code in production builds
- Optimized for fast load times
- Smooth 60fps animations using CSS transforms

---

**Last Updated:** April 2026
**Version:** 1.0.0
