import type { LandingPage, LandingPageElement } from "@/types"
import mongoose, { Schema } from "mongoose"

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
    headlineLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
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

// Delete cached models to ensure schema changes are picked up during hot reload
if (mongoose.models.Page) mongoose.deleteModel("Page")
if (mongoose.models.PreviewPage) mongoose.deleteModel("PreviewPage")
if (mongoose.models.PublishPage) mongoose.deleteModel("PublishPage")

export const Page = mongoose.model<LandingPage>("Page", pageSchema)
export const PreviewPage = mongoose.model<LandingPage>(
  "PreviewPage",
  pageSchema,
  "PreviewPage",
)
export const PublishPage = mongoose.model<LandingPage>(
  "PublishPage",
  pageSchema,
  "PublishPage",
)
