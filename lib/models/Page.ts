import mongoose, { Schema, type Document } from "mongoose"

export interface LandingPageElement {
  type: "text" | "image" | "headline"
  content?: string
  position: number
}

export interface LandingPage extends Document {
  slug: string
  elements: LandingPageElement[]
  userEmail: string
  createdAt: Date
  updatedAt: Date
}

const elementSchema = new Schema<LandingPageElement>(
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

const pageSchema = new Schema<LandingPage>(
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
    userEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export { pageSchema }
export const Page =
  mongoose.models.Page || mongoose.model<LandingPage>("Page", pageSchema)
export const PreviewPage =
  mongoose.models.PreviewPage ||
  mongoose.model<LandingPage>("PreviewPage", pageSchema, "PreviewPage")
export const PublishPage =
  mongoose.models.PublishPage ||
  mongoose.model<LandingPage>("PublishPage", pageSchema, "PublishPage")
