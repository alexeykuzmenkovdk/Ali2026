"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import { Bold, Heading2, Heading3, ImageIcon, Indent, Italic, List, ListOrdered, Outdent, Underline, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUploadMedia: (file: File) => Promise<string | null>
  disabled?: boolean
  id?: string
}

const formatBlock = (tag: string) => {
  document.execCommand("formatBlock", false, tag)
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onUploadMedia,
  disabled,
  id,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!editorRef.current) return
    const currentHtml = editorRef.current.innerHTML
    if (value !== currentHtml) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML ?? "")
  }, [onChange])

  const insertHtmlAtCursor = useCallback(
    (html: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      if (selection.rangeCount === 0) {
        editorRef.current.innerHTML += html
        handleInput()
        return
      }
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const fragment = range.createContextualFragment(html)
      range.insertNode(fragment)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      handleInput()
    },
    [handleInput]
  )

  const handleCommand = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue)
    editorRef.current?.focus()
    handleInput()
  }, [handleInput])

  const handleMediaUpload = useCallback(
    async (file: File, type: "image" | "video") => {
      const url = await onUploadMedia(file)
      if (!url) return
      if (type === "image") {
        insertHtmlAtCursor(`<img src="${url}" alt="Медиа" />`)
        return
      }
      insertHtmlAtCursor(`<video src="${url}" controls></video>`)
    },
    [insertHtmlAtCursor, onUploadMedia]
  )

  const handleImageChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await handleMediaUpload(file, "image")
      event.target.value = ""
    },
    [handleMediaUpload]
  )

  const handleVideoChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await handleMediaUpload(file, "video")
      event.target.value = ""
    },
    [handleMediaUpload]
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-md border bg-white p-2">
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("bold")} disabled={disabled}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("italic")} disabled={disabled}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("underline")} disabled={disabled}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("h2")} disabled={disabled}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("h3")} disabled={disabled}>
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => formatBlock("p")} disabled={disabled}>
          Текст
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("insertUnorderedList")} disabled={disabled}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("insertOrderedList")} disabled={disabled}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("indent")} disabled={disabled}>
          <Indent className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("outdent")} disabled={disabled}>
          <Outdent className="h-4 w-4" />
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={disabled}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoChange}
          disabled={disabled}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} disabled={disabled}>
          <ImageIcon className="h-4 w-4 mr-1" />
          Фото
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => videoInputRef.current?.click()} disabled={disabled}>
          <Video className="h-4 w-4 mr-1" />
          Видео
        </Button>
      </div>
      <div className="relative">
        {!value && !isFocused && (
          <div className="pointer-events-none absolute left-3 top-3 text-sm text-gray-400">
            {placeholder ?? "Введите текст"}
          </div>
        )}
        <div
          ref={editorRef}
          id={id}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={placeholder ?? "Текст"}
          className="min-h-[200px] rounded-md border border-input bg-white px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  )
}
