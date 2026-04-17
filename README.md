# Land In One

> Create your landing page in less than one minute.

**Land In One** is a full-stack landing page builder built with Next.js 16, MongoDB, and AWS S3. Users can sign in, create landing pages by combining headline, text, and image elements, preview them instantly, and publish them to a public URL — all without writing a single line of code.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Usage](#usage)
- [Page Builder](#page-builder)
- [Image Uploads](#image-uploads)
- [Publishing](#publishing)
- [Deployment](#deployment)

---

## Features

- 🔐 **Authentication** — Sign in with Google via NextAuth
- 🛠 **Drag-and-drop builder** — Reorder elements by dragging them
- 📰 **Headline elements** — Supports H1–H6 levels with automatic smart defaulting
- 📝 **Rich text elements** — Powered by Tiptap editor
- 🖼 **Image elements** — Upload images (up to 4.5 MB) directly to AWS S3
- 👁 **Preview** — Instant preview page before publishing
- 🌐 **Publish / Unpublish** — One-click publishing to a public slug URL
- 💾 **Auto-save** — Changes are automatically persisted to the preview model with debouncing
- 📋 **Dashboard** — Manage all your landing pages in one place

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB via [Mongoose](https://mongoosejs.com/) |
| Auth | [NextAuth.js](https://next-auth.js.org/) (Google provider) |
| Storage | AWS S3 (presigned URL uploads) |
| Rich Text | [Tiptap](https://tiptap.dev/) |
| Icons | [Tabler Icons](https://tabler-icons.io/) |
| Linting/Formatting | [Biome](https://biomejs.dev/) |

---

## Project Structure

```
app/
├── [slug]/           # Public published page route
├── preview/[slug]/   # Preview page route
├── builder/[id]/     # Page builder route
├── dashboard/        # User dashboard
├── login/            # Login page
├── actions/          # Next.js Server Actions (pages, cloud storage)
├── components/       # React components (AppBuilder, Dashboard, etc.)
│   └── builder/      # Element-level components (Headline, Text, Image)
├── providers/        # Context providers (AuthProvider)
├── ui/               # Reusable UI primitives (Button, Modal, Card, etc.)
└── globals.css       # Global styles
lib/
├── auth.ts           # NextAuth configuration
├── mongodb.ts        # MongoDB connection helper
├── utils.ts          # Utility functions
└── models/
    └── Page.ts       # Mongoose models (PreviewPage, PublishPage)
CONSTANTS.ts          # App-wide constants (S3 config, limits)
types.d.ts            # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- [pnpm](https://pnpm.io/) (recommended) or npm
- A MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Google OAuth app (for authentication)
- An AWS S3 bucket for image storage

### Environment Variables

Create a `.env.local` file at the root of the project with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET_NAME=land-in-one-bucket-name
```

> See [`S3_CORS_SETUP.md`](./S3_CORS_SETUP.md) for required S3 CORS configuration.

### Installation

```bash
pnpm install
```

### Running Locally

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Navigate to the app and sign in with Google.
2. From the **Dashboard**, click **New Page** to create a landing page — a random slug is auto-generated.
3. Use the **Builder** to add, reorder, and edit elements.
4. Click **View Preview** to see the page before publishing.
5. When ready, click **Publish Page** to make it live at `/<slug>`.
6. To take a page offline, click **Unpublish** in the builder or from the dashboard.

---

## Page Builder

The builder supports three element types:

| Element | Description |
|---|---|
| **Headline** | A heading (H1–H6). Defaults to H1 if none exists, otherwise H2. Level is editable per element. |
| **Text** | Rich text block using the Tiptap editor. |
| **Image** | An image uploaded to S3. Maximum 10 images per page, 4.5 MB each. |

Elements can be **reordered by dragging**. Each element can be **edited** (click it) or **deleted** from within its edit modal.

---

## Image Uploads

Images are uploaded directly to AWS S3 using **presigned URLs**:

1. The client requests a presigned URL from the server (`/api/upload-image` + server action).
2. The image is uploaded directly from the browser to S3 — no data passes through the Next.js server.
3. The resulting S3 URL is stored in the element's `content` field.
4. Deleted images are automatically cleaned up from S3.

---

## Publishing

Landing pages have two separate MongoDB collections:

- **`PreviewPage`** — auto-saved drafts (debounced, every 300 ms).
- **`PublishPage`** — explicitly published versions.

Publishing copies the current preview state into `PublishPage`. Unpublishing deletes the document from `PublishPage` while keeping the draft intact.

Public pages are accessible at `/<slug>`. Preview pages are at `/preview/<slug>`.

---

## Deployment

The app is designed to be deployed on [Vercel](https://vercel.com/). See [`VERCEL_COMPLIANCE.md`](./VERCEL_COMPLIANCE.md) for Vercel-specific considerations.

```bash
pnpm build
```

Make sure all environment variables are configured in your Vercel project settings.
