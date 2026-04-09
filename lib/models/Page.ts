import mongoose, { Schema, type Document } from "mongoose"

export interface PageElement {
  type: "text" | "image" | "headline"
  content: string
  position: number
}

export interface IPage extends Document {
  slug: string
  elements: PageElement[]
  createdAt: Date
  updatedAt: Date
}

const elementSchema = new Schema<PageElement>(
  {
    type: {
      type: String,
      enum: ["text", "image", "headline"],
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
)

const pageSchema = new Schema<IPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    elements: {
      type: [elementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

export { pageSchema }
export const Page =
  mongoose.models.Page || mongoose.model<IPage>("Page", pageSchema)
export const PreviewPage =
  mongoose.models.PreviewPage ||
  mongoose.model<IPage>("PreviewPage", pageSchema, "PreviewPage")
export const PublishPage =
  mongoose.models.PublishPage ||
  mongoose.model<IPage>("PublishPage", pageSchema, "PublishPage")
