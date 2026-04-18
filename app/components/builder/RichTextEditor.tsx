"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
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

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Enter your text here…",
  minHeight = "8rem",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
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

  if (!editor) return null

  const runAction = (action: ToolbarAction) => {
    editor.chain().focus()[action]().run()
  }

  return (
    <div className="rounded-lg border-2 border-slate-200 focus-within:border-[#6442D6] transition-colors overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-slate-200 bg-slate-100">
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
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
