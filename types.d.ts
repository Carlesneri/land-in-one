export type AspectRatio = "9/16" | "3/4" | "4/3" | "1/1" | "16/9"
export type Status = "publish" | "preview"
export type BackdropType = "linear" | "radial"
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
  backdropActive?: boolean
  backdropType?: BackdropType
  backdropColors?: string[] // format: "#rrggbbaa offset%" e.g. "#000000cc 0%"
  backdropAngle?: number
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
