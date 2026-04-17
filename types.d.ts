export interface LandingPageElement {
  type: "text" | "image" | "headline"
  content?: string
  position: number
  headlineLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface LandingPage {
  slug: string
  elements: LandingPageElement[]
  userEmail: string
  createdAt: Date
  updatedAt: Date
}

export type Status = "publish" | "preview"
