"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"
import type { LandingPageElement } from "@/types"

interface TextElementProps {
  element: LandingPageElement
  index: number
  onEdit: (element: LandingPageElement, index: number) => void
  onContentChange: (index: number, content: string) => void
  onDelete: (index: number) => void
  onSave: () => void
}

const TOOLBAR_BUTTONS = [
  { action: "toggleBold", label: "B", title: "Bold", className: "font-bold" },
  {
    action: "toggleItalic",
    label: "I",
    title: "Italic",
    className: "italic",
  },
  {
    action: "toggleStrike",
    label: "S",
    title: "Strikethrough",
    className: "line-through",
  },
  {
    action: "toggleBulletList",
    label: "• List",
    title: "Bullet list",
    className: "",
  },
  {
    action: "toggleOrderedList",
    label: "1. List",
    title: "Ordered list",
    className: "",
  },
] as const

type ToolbarAction = (typeof TOOLBAR_BUTTONS)[number]["action"]

export function TextElement({
  element,
  index,
  onContentChange,
  onDelete,
  onSave,
}: TextElementProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Click to edit text…",
      }),
    ],
    content: element.content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[2rem] px-2 py-1 text-gray-800 leading-relaxed",
      },
    },
    onUpdate({ editor }) {
      onContentChange(index, editor.getHTML())
    },
  })

  // Sync external content changes (e.g. initial load)
  useEffect(() => {
    if (!editor) return
    const incoming = element.content || ""
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming, { emitUpdate: false })
    }
  }, [editor, element.content])

  if (!editor) return null

  const runAction = (action: ToolbarAction) => {
    const chain = editor.chain().focus()
    chain[action]().run()
  }

  return (
    <div className="w-full rounded border border-transparent focus-within:border-[#C8B3FD] focus-within:bg-white transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-slate-200 bg-slate-100 rounded-t opacity-0 focus-within:opacity-100 group-focus-within:opacity-100 [.group:focus-within_&]:opacity-100 transition-opacity">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.action}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault()
              runAction(btn.action)
            }}
            className={`px-2 py-0.5 text-xs rounded hover:bg-slate-200 text-slate-700 ${btn.className} ${
              (btn.action === "toggleBold" && editor.isActive("bold")) ||
              (btn.action === "toggleItalic" && editor.isActive("italic")) ||
              (btn.action === "toggleStrike" && editor.isActive("strike")) ||
              (btn.action === "toggleBulletList" &&
                editor.isActive("bulletList")) ||
              (
                btn.action === "toggleOrderedList" &&
                  editor.isActive("orderedList")
              )
                ? "bg-[#EDE9FB] text-[#6442D6]"
                : ""
            }`}
          >
            {btn.label}
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save button */}
        <button
          type="button"
          title="Save page"
          onMouseDown={(e) => {
            e.preventDefault()
            onSave()
            editor.commands.blur()
          }}
          className="px-2 py-0.5 text-xs rounded hover:bg-[#DCFCE7] text-[#16A34A] ml-1"
        >
          ✓ Save
        </button>

        {/* Delete button */}
        <button
          type="button"
          title="Remove element"
          onMouseDown={(e) => {
            e.preventDefault()
            onDelete(index)
          }}
          className="px-2 py-0.5 text-xs rounded hover:bg-[#FEE2E2] text-[#DC2626] ml-1"
        >
          ✕ Remove
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
