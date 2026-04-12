export interface LandingPageElement {
  type: "text" | "image" | "headline"
  content?: string
  position: number
}

export interface LandingPage {
  slug: string
  elements: LandingPageElement[]
  userEmail: string
  createdAt: Date
  updatedAt: Date
}

export type Status = "publish" | "preview"

export type AppBuilderElements = {
  type: "text" | "image" | "headline"
  content?: string | File
  position: number
}[]
