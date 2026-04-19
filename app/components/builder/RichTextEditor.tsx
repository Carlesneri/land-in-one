"use client"

import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import {
  RichTextEditor as MantineRTE,
  Link as MantineLink,
} from "@mantine/tiptap"
import { useEffect } from "react"
import type { AnyExtension } from "@tiptap/react"

// Extend MantineLink so setLink always produces an absolute URL
const AbsoluteLink = MantineLink.extend({
  addCommands() {
    const parent = this.parent?.() ?? {}
    return {
      ...parent,
      setLink:
        (attrs: {
          href: string
          target?: string | null
          rel?: string | null
        }) =>
        (cmdProps) => {
          const href = attrs.href ?? ""
          const normalized =
            href && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href)
              ? `https://${href}`
              : href
          return (
            parent.setLink?.({ ...attrs, href: normalized })(cmdProps) ?? false
          )
        },
    }
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Enter your text here…",
  minHeight = "8rem",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      AbsoluteLink.configure({ openOnClick: false, defaultProtocol: "https" }),
    ] as unknown as AnyExtension[],
    content,
    autofocus: "end",
    editorProps: {
      attributes: {
        style: `min-height: ${minHeight}`,
      },
      handleClick(_, __, event) {
        const target = event.target as HTMLElement
        if (target.closest("a")) {
          event.preventDefault()
          return true
        }
        return false
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

  return (
    <MantineRTE editor={editor}>
      <MantineRTE.Toolbar sticky stickyOffset={0}>
        <MantineRTE.ControlsGroup>
          <MantineRTE.Bold />
          <MantineRTE.Italic />
          <MantineRTE.Underline />
          <MantineRTE.Strikethrough />
        </MantineRTE.ControlsGroup>

        <MantineRTE.ControlsGroup>
          <MantineRTE.H1 />
          <MantineRTE.H2 />
          <MantineRTE.H3 />
          <MantineRTE.H4 />
          <MantineRTE.H5 />
          <MantineRTE.H6 />
        </MantineRTE.ControlsGroup>

        <MantineRTE.ControlsGroup>
          <MantineRTE.AlignLeft />
          <MantineRTE.AlignCenter />
          <MantineRTE.AlignRight />
        </MantineRTE.ControlsGroup>

        <MantineRTE.ControlsGroup>
          <MantineRTE.BulletList />
          <MantineRTE.OrderedList />
        </MantineRTE.ControlsGroup>

        <MantineRTE.ControlsGroup>
          <MantineRTE.Link />
          <MantineRTE.Unlink />
        </MantineRTE.ControlsGroup>

        <MantineRTE.ControlsGroup>
          <MantineRTE.Hr />
        </MantineRTE.ControlsGroup>
      </MantineRTE.Toolbar>

      <MantineRTE.Content />
    </MantineRTE>
  )
}
