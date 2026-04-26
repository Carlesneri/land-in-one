import type { PaletteColor } from "@/lib/backdrop"
import type { LandingPage } from "@/types"
import mongoose, { Schema } from "mongoose"

const colorSchema = new Schema<PaletteColor>(
  {
    color: { type: String, required: true }, // hex
    offset: { type: Number, required: true }, // 0–1
    opacity: { type: Number, required: false }, // 0–1
  },
  {
    _id: false,
  },
)

const elementSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "image-text"],
      required: true,
    },
    position: { type: Number, required: true },
    // TextElement & ImageElement fields
    content: { type: String, default: "" },
    // ImageElement & ImageTextElement fields
    aspectRatio: { type: String, enum: ["9/16", "3/4", "4/3", "1/1", "16/9"] },
    // ImageTextElement fields
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    backdropActive: { type: Boolean, default: false },
    backdropType: {
      type: String,
      enum: ["linear", "radial", "solid"],
    },
    backdropColors: [colorSchema],
    backdropAngle: { type: Number },
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
    name: {
      type: String,
    },
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
