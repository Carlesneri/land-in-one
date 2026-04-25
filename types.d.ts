export type AspectRatio = "9/16" | "3/4" | "4/3" | "1/1" | "16/9"
export type Status = "publish" | "preview"
export interface BaseElement {
  id: string
  position: number
}
export interface TextElement extends BaseElement {
  type: "text"
  content: string
}
export interface ImageElement extends BaseElement {
  type: "image"
  content: string
  aspectRatio?: AspectRatio
}
export interface ImageTextElement extends BaseElement {
  type: "image-text"
  text: string
  image: string
}
export type LandingPageElement = TextElement | ImageElement | ImageTextElement
export interface LandingPage {
  slug: string
  elements: LandingPageElement[]
  userEmail: string
  mode?: "light" | "dark"
  previewPageId?: string
  previewPageDate?: Date
}
