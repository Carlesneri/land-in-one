export interface LandingPageElement {
  type: "text" | "image"
  content?: string
  position: number
  aspectRatio?: "9/16" | "3/4" | "4/3" | "1/1" | "16/9"
}

export interface LandingPage {
  slug: string
  elements: LandingPageElement[]
  userEmail: string
  mode?: "light" | "dark"
  previewPageId?: string
  previewPageDate?: Date
}

export type Status = "publish" | "preview"
