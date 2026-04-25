"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Modal } from "@/app/ui/Modal"
import { RichTextEditor } from "@/app/components/builder/RichTextEditor"
import { IconPhoto } from "@tabler/icons-react"
import {
  GradientPickerPopover,
  GRADIENT_TYPES,
} from "react-linear-gradient-picker"
import { SketchPicker } from "react-color"
import type { BackdropType } from "@/types"
import type { FlatBackdrop, PaletteColor } from "@/lib/backdrop"
import {
  paletteToCssStops,
  cssStopsToPalette,
  buildBackdropCss,
} from "@/lib/backdrop"

const DEFAULT_PALETTE: PaletteColor[] = [
  { offset: 0, color: "#000000", opacity: 0.8 },
  { offset: 1, color: "#000000", opacity: 0 },
]
const DEFAULT_ANGLE = 180

/** Wrap SketchPicker as required by react-linear-gradient-picker */
const WrappedSketchPicker = ({
  onSelect,
  ...rest
}: {
  onSelect?: (color: string, opacity: number) => void
  color?: string
  opacity?: number
  [key: string]: unknown
}) => (
  <SketchPicker
    {...(rest as object)}
    color={rest.color ?? "#000000"}
    onChange={(c: { hex: string; rgb: { a?: number } }) => {
      onSelect?.(c.hex, c.rgb.a ?? 1)
    }}
  />
)

interface EditImageTextModalProps {
  isOpen: boolean
  image: string
  text: string
  backdropActive?: boolean
  backdropType?: BackdropType
  backdropColors?: string[]
  backdropAngle?: number
  onClose: () => void
  onImageChange: (file: File) => void
  onImageRemove: () => void
  onTextChange: (value: string) => void
  onBackdropActiveChange: (active: boolean) => void
  onBackdropChange: (flat: FlatBackdrop) => void
  onSave: () => void
}

export function EditImageTextModal({
  isOpen,
  image,
  text,
  backdropActive = false,
  backdropType,
  backdropColors,
  backdropAngle,
  onClose,
  onImageChange,
  onImageRemove,
  onTextChange,
  onBackdropActiveChange,
  onBackdropChange,
  onSave,
}: EditImageTextModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [gradientType, setGradientType] = useState<BackdropType>(
    backdropType ?? GRADIENT_TYPES.LINEAR,
  )
  const [palette, setPalette] = useState<PaletteColor[]>(
    backdropColors ? cssStopsToPalette(backdropColors) : DEFAULT_PALETTE,
  )
  const [angle, setAngle] = useState(backdropAngle ?? DEFAULT_ANGLE)

  // Sync state when modal opens
  const prevIsOpen = useRef(isOpen)
  if (prevIsOpen.current !== isOpen) {
    prevIsOpen.current = isOpen
    if (isOpen) {
      setGradientType(backdropType ?? GRADIENT_TYPES.LINEAR)
      setPalette(
        backdropColors ? cssStopsToPalette(backdropColors) : DEFAULT_PALETTE,
      )
      setAngle(backdropAngle ?? DEFAULT_ANGLE)
    }
  }

  const makeBackdrop = useCallback(
    (type: BackdropType, pal: PaletteColor[], ang: number): FlatBackdrop => ({
      backdropType: type,
      backdropColors: paletteToCssStops(pal),
      backdropAngle: ang,
    }),
    [],
  )

  const handlePaletteChange = useCallback(
    (newPalette: PaletteColor[]) => {
      setPalette(newPalette)
      if (backdropActive)
        onBackdropChange(makeBackdrop(gradientType, newPalette, angle))
    },
    [backdropActive, gradientType, angle, onBackdropChange, makeBackdrop],
  )

  const handleAngleChange = useCallback(
    (newAngle: number) => {
      setAngle(newAngle)
      if (backdropActive)
        onBackdropChange(makeBackdrop(gradientType, palette, newAngle))
    },
    [backdropActive, gradientType, palette, onBackdropChange, makeBackdrop],
  )

  const handleGradientTypeChange = useCallback(
    (newType: BackdropType) => {
      setGradientType(newType)
      if (backdropActive)
        onBackdropChange(makeBackdrop(newType, palette, angle))
    },
    [backdropActive, palette, angle, onBackdropChange, makeBackdrop],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image & Text"
      size="large"
    >
      <div className="space-y-5">
        {/* Image section */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Image</p>
          {image ? (
            <div className="space-y-3">
              <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={image}
                  alt="Element image"
                  width={800}
                  height={400}
                  className="w-full object-cover rounded-lg max-h-52"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={onImageRemove}
                  className="flex-1 py-2 px-4 bg-warning-light hover:bg-warning-light-hover text-warning font-medium rounded-lg transition-colors text-sm"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <IconPhoto
                size={28}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span className="text-sm text-slate-500 font-medium">
                Click to add image
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onImageChange(file)
                // reset so same file can be picked again
                e.target.value = ""
              }
            }}
          />
        </div>

        {/* Backdrop gradient section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-700">
              Backdrop gradient
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={backdropActive}
              onClick={() => {
                const newActive = !backdropActive
                onBackdropActiveChange(newActive)
                if (newActive)
                  onBackdropChange(makeBackdrop(gradientType, palette, angle))
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                backdropActive ? "bg-primary" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  backdropActive ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div
            className={`space-y-4 p-3 rounded-lg border border-slate-200 transition-opacity ${
              backdropActive ? "opacity-100" : "opacity-50 pointer-events-none"
            }`}
            style={{
              background: buildBackdropCss(
                makeBackdrop(gradientType, palette, angle),
              ),
            }}
          >
            <GradientPickerPopover
              {...{
                trigger: () => (
                  <button
                    type="button"
                    disabled={!backdropActive}
                    onClick={() => setPickerOpen(true)}
                    className="w-full py-2 px-4 bg-white/70 hover:bg-white/90 disabled:cursor-not-allowed text-slate-700 font-medium rounded-lg transition-colors text-sm backdrop-blur-sm"
                  >
                    Edit gradient
                  </button>
                ),
                open: pickerOpen,
                setOpen: setPickerOpen,
                angle,
                setAngle: handleAngleChange,
                gradientType,
                setGradientType: handleGradientTypeChange,
                paletteHeight: 32,
                palette,
                onPaletteChange: handlePaletteChange,
              }}
            >
              <WrappedSketchPicker />
            </GradientPickerPopover>
          </div>
        </div>

        {/* Text section */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Overlay text
          </p>
          <RichTextEditor content={text} onChange={onTextChange} colorPicker />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 py-2 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
