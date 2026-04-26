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

// Accordion Item Schema
const accordionItemSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false },
)

const elementSchema = new Schema(
  {
    type: String,
    id: String,
    position: Number,
    content: String,
    aspectRatio: String,
    text: String,
    image: String,
    backdropActive: Boolean,
    backdropType: String,
    backdropColors: [colorSchema],
    backdropAngle: Number,
    items: [accordionItemSchema],
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
    },
    elements: {
      type: [elementSchema], // Accept any of the element schemas
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
