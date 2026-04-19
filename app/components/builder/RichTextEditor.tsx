"use client"

import { useEditor, EditorContent, type AnyExtension } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { useEffect, useRef, useState } from "react"
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
  IconList,
  IconListNumbers,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconLink,
  IconLinkOff,
  IconTypography,
  IconSeparator,
} from "@tabler/icons-react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#111827" },
  { label: "Gray", value: "#6b7280" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#d97706" },
  { label: "Yellow", value: "#ca8a04" },
  { label: "Green", value: "#16a34a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
]

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Enter your text here…",
  minHeight = "8rem",
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
    ] as unknown as AnyExtension[],
    content,
    autofocus: "end",
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none px-3 py-2 text-gray-800 leading-relaxed`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  // Close color picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!editor) return null

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs)

  const btnClass = (active: boolean, extra = "") =>
    `p-1.5 rounded text-slate-600 hover:bg-slate-200 transition-colors ${extra} ${
      active ? "bg-primary-light text-primary" : ""
    }`

  const handleSetLink = () => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }

  const openLinkInput = () => {
    const existing = editor.getAttributes("link").href ?? ""
    setLinkUrl(existing)
    setShowLinkInput(true)
  }

  return (
    <div className="rounded-lg border-2 border-slate-200 focus-within:border-primary transition-colors overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
        {/* Text style */}
        <button
          type="button"
          title="Bold"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBold().run()
          }}
          className={btnClass(isActive("bold"))}
        >
          <IconBold size={14} />
        </button>
        <button
          type="button"
          title="Italic"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleItalic().run()
          }}
          className={btnClass(isActive("italic"))}
        >
          <IconItalic size={14} />
        </button>
        <button
          type="button"
          title="Underline"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleUnderline().run()
          }}
          className={btnClass(isActive("underline"))}
        >
          <IconUnderline size={14} />
        </button>
        <button
          type="button"
          title="Strikethrough"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleStrike().run()
          }}
          className={btnClass(isActive("strike"))}
        >
          <IconStrikethrough size={14} />
        </button>

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Heading levels */}
        {([1, 2, 3] as const).map((level) => (
          <button
            key={level}
            type="button"
            title={`Heading ${level}`}
            onMouseDown={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleHeading({ level }).run()
            }}
            className={btnClass(
              isActive("heading", { level }),
              "text-xs font-bold px-2 py-1",
            )}
          >
            H{level}
          </button>
        ))}

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Alignment */}
        {(["left", "center", "right"] as const).map((align) => {
          const Icon =
            align === "left"
              ? IconAlignLeft
              : align === "center"
                ? IconAlignCenter
                : IconAlignRight
          return (
            <button
              key={align}
              type="button"
              title={`Align ${align}`}
              // biome-ignore lint/suspicious/noExplicitAny: TextAlign commands not typed in ChainedCommands
              onMouseDown={(e) => {
                e.preventDefault()
                ;(editor.chain().focus() as any).setTextAlign(align).run()
              }}
              className={btnClass(editor.isActive({ textAlign: align }))}
            >
              <Icon size={14} />
            </button>
          )
        })}

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          title="Bullet list"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleBulletList().run()
          }}
          className={btnClass(isActive("bulletList"))}
        >
          <IconList size={14} />
        </button>
        <button
          type="button"
          title="Ordered list"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={btnClass(isActive("orderedList"))}
        >
          <IconListNumbers size={14} />
        </button>

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          title="Set link"
          onMouseDown={(e) => {
            e.preventDefault()
            openLinkInput()
          }}
          className={btnClass(isActive("link"))}
        >
          <IconLink size={14} />
        </button>
        {isActive("link") && (
          <button
            type="button"
            title="Remove link"
            onMouseDown={(e) => {
              e.preventDefault()
              editor.chain().focus().unsetLink().run()
            }}
            className={btnClass(false)}
          >
            <IconLinkOff size={14} />
          </button>
        )}

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Text color */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            title="Text color"
            onMouseDown={(e) => {
              e.preventDefault()
              setShowColorPicker((v) => !v)
            }}
            className={btnClass(showColorPicker)}
          >
            <IconTypography size={14} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex flex-wrap gap-1 w-40">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    if (c.value) {
                      // biome-ignore lint/suspicious/noExplicitAny: Color commands not typed in ChainedCommands
                      ;(editor.chain().focus() as any).setColor(c.value).run()
                    } else {
                      // biome-ignore lint/suspicious/noExplicitAny: Color commands not typed in ChainedCommands
                      ;(editor.chain().focus() as any).unsetColor().run()
                    }
                    setShowColorPicker(false)
                  }}
                  className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value || "#ffffff" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="w-px h-4 bg-slate-300 mx-1" />

        {/* Horizontal rule */}
        <button
          type="button"
          title="Horizontal rule"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.chain().focus().setHorizontalRule().run()
          }}
          className={btnClass(false)}
        >
          <IconSeparator size={14} />
        </button>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
            className="flex-1 text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-primary"
            // biome-ignore lint/a11y/noAutofocus: intentional focus on link input
            autoFocus
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs px-2 py-1 text-slate-600 hover:bg-slate-200 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
