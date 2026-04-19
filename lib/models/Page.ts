import type { LandingPage, LandingPageElement } from "@/types"
import mongoose, { Schema } from "mongoose"

const elementSchema = new Schema<LandingPageElement>(
  {
    type: {
      type: String,
      enum: ["text", "image"],
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
    aspectRatio: {
      type: String,
      enum: ["9/16", "3/4", "4/3", "1/1", "16/9"],
    },
  },
  { _id: false },
)

export type PageModelType = LandingPage & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const pageSchema = new Schema<PageModelType>(
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
    mode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    previewPageId: {
      type: Schema.ObjectId,
    },
    previewPageDate: {
      type: String,
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

export const PreviewPage = mongoose.model<PageModelType>(
  "PreviewPage",
  pageSchema,
  "PreviewPage",
)
export const PublishPage = mongoose.model<PageModelType>(
  "PublishPage",
  pageSchema,
  "PublishPage",
)
