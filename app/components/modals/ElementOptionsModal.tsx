import { Modal } from "@/app/ui/Modal"
import type { LandingPageElement } from "@/types"

interface ElementOptionsModalProps {
  isOpen: boolean
  element: LandingPageElement | undefined
  onClose: () => void
  onHeadlineLevelChange: (
    level: NonNullable<LandingPageElement["headlineLevel"]>,
  ) => void
  onAspectRatioChange: (
    ratio: LandingPageElement["aspectRatio"] | undefined,
  ) => void
}

export function ElementOptionsModal({
  isOpen,
  element,
  onClose,
  onHeadlineLevelChange,
  onAspectRatioChange,
}: ElementOptionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Element Options">
      <div className="space-y-4">
        {element?.type === "headline" && (
          <div>
            <label
              htmlFor="options-headline-level-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Headline Level
            </label>
            <select
              id="options-headline-level-select"
              value={element.headlineLevel ?? 1}
              onChange={(e) =>
                onHeadlineLevelChange(
                  Number(e.target.value) as NonNullable<
                    LandingPageElement["headlineLevel"]
                  >,
                )
              }
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
            >
              {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                <option key={lvl} value={lvl}>
                  H{lvl}
                </option>
              ))}
            </select>
          </div>
        )}

        {element?.type === "image" && (
          <div>
            <label
              htmlFor="options-aspect-ratio-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aspect Ratio
            </label>
            <select
              id="options-aspect-ratio-select"
              value={element.aspectRatio ?? ""}
              onChange={(e) =>
                onAspectRatioChange(
                  (e.target.value as NonNullable<
                    LandingPageElement["aspectRatio"]
                  >) || undefined,
                )
              }
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">Original (no crop)</option>
              <option value="16/9">16:9 (Landscape)</option>
              <option value="4/3">4:3</option>
              <option value="1/1">1:1 (Square)</option>
              <option value="3/4">3:4 (Portrait)</option>
              <option value="9/16">9:16 (Portrait)</option>
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-text font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
