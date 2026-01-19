"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ClipboardEvent } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eye,
  Heading2,
  Heading3,
  ImageIcon,
  Indent,
  Italic,
  List,
  ListOrdered,
  Outdent,
  Underline,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")

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
  const [selectedFontFamily, setSelectedFontFamily] = useState("inherit")
  const [selectedFontSize, setSelectedFontSize] = useState("inherit")
  const [selectedLineHeight, setSelectedLineHeight] = useState("normal")

  const fontFamilies = useMemo(
    () => [
      { label: "Сайт (по умолчанию)", value: "inherit" },
      { label: "Inter", value: "Inter, sans-serif" },
      { label: "Montserrat", value: "Montserrat, sans-serif" },
      { label: "Arial", value: "Arial, sans-serif" },
      { label: "Georgia", value: "Georgia, serif" },
      { label: "Times New Roman", value: "'Times New Roman', serif" },
    ],
    [],
  )

  const fontSizes = useMemo(
    () => [
      { label: "По умолчанию", value: "inherit" },
      { label: "12 px", value: "12px" },
      { label: "14 px", value: "14px" },
      { label: "16 px", value: "16px" },
      { label: "18 px", value: "18px" },
      { label: "20 px", value: "20px" },
      { label: "24 px", value: "24px" },
      { label: "28 px", value: "28px" },
      { label: "32 px", value: "32px" },
    ],
    [],
  )

  const lineHeights = useMemo(
    () => [
      { label: "По умолчанию", value: "normal" },
      { label: "1.2", value: "1.2" },
      { label: "1.4", value: "1.4" },
      { label: "1.6", value: "1.6" },
      { label: "1.8", value: "1.8" },
      { label: "2.0", value: "2" },
    ],
    [],
  )

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

  const insertHtmlAfterSelection = useCallback(
    (html: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      if (selection.rangeCount === 0) {
        editorRef.current.innerHTML += html
        handleInput()
        return
      }
      const range = selection.getRangeAt(0)
      range.collapse(false)
      const htmlWithMarker = `${html}<span data-cursor-marker="true"></span>`
      const fragment = range.createContextualFragment(htmlWithMarker)
      range.insertNode(fragment)
      const marker = editorRef.current.querySelector('[data-cursor-marker="true"]')
      if (marker) {
        const newRange = document.createRange()
        newRange.setStartAfter(marker)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        marker.remove()
      }
      editorRef.current.focus()
      handleInput()
    },
    [handleInput]
  )

  const handleCommand = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue)
    editorRef.current?.focus()
    handleInput()
  }, [handleInput])

  const wrapSelectionWithSpan = useCallback(
    (style: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      if (selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      const span = document.createElement("span")
      span.setAttribute("style", style)
      if (range.collapsed) {
        span.appendChild(document.createTextNode("\u200b"))
        range.insertNode(span)
        const newRange = document.createRange()
        newRange.setStart(span.firstChild ?? span, 1)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
        editorRef.current.focus()
        handleInput()
        return
      }
      try {
        range.surroundContents(span)
      } catch {
        const fragment = range.extractContents()
        span.appendChild(fragment)
        range.insertNode(span)
      }
      const newRange = document.createRange()
      newRange.setStartAfter(span)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
      editorRef.current.focus()
      handleInput()
    },
    [handleInput],
  )

  const applyLineHeight = useCallback(
    (value: string) => {
      const selection = window.getSelection()
      if (!selection || !editorRef.current) return
      const node = selection.anchorNode
      const element = node instanceof Element ? node : node?.parentElement
      const blockElement =
        element?.closest("p, div, h1, h2, h3, h4, h5, h6, li, blockquote") ?? editorRef.current
      blockElement.style.lineHeight = value
      editorRef.current.focus()
      handleInput()
    },
    [handleInput],
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const text = event.clipboardData?.getData("text/plain")
      if (!text) return
      event.preventDefault()
      const normalized = text.replace(/\r\n/g, "\n").trim()
      const paragraphs = normalized.split(/\n{2,}/)
      const html = paragraphs
        .map((paragraph) => {
          const lines = paragraph.split("\n").map(escapeHtml).join("<br />")
          return `<p>${lines}</p>`
        })
        .join("")
      insertHtmlAfterSelection(html)
    },
    [insertHtmlAfterSelection],
  )

  const handleMediaUpload = useCallback(
    async (file: File, type: "image" | "video") => {
      const url = await onUploadMedia(file)
      if (!url) return
      if (type === "image") {
        insertHtmlAfterSelection(
          `<img src="${url}" alt="Медиа" style="max-width: 100%; height: auto; display: block; margin: 16px 0;" />`,
        )
        return
      }
      insertHtmlAfterSelection(
        `<video src="${url}" controls style="max-width: 100%; height: auto; display: block; margin: 16px 0;"></video>`,
      )
    },
    [insertHtmlAfterSelection, onUploadMedia]
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
        <select
          value={selectedFontFamily}
          onChange={(event) => {
            const value = event.target.value
            setSelectedFontFamily(value)
            wrapSelectionWithSpan(`font-family: ${value};`)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
        <select
          value={selectedFontSize}
          onChange={(event) => {
            const value = event.target.value
            setSelectedFontSize(value)
            wrapSelectionWithSpan(`font-size: ${value};`)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
        <select
          value={selectedLineHeight}
          onChange={(event) => {
            const value = event.target.value
            setSelectedLineHeight(value)
            applyLineHeight(value)
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          disabled={disabled}
        >
          {lineHeights.map((height) => (
            <option key={height.value} value={height.value}>
              {height.label}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("bold")} disabled={disabled}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("italic")} disabled={disabled}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleCommand("underline")} disabled={disabled}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyLeft")}
          disabled={disabled}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyCenter")}
          disabled={disabled}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand("justifyRight")}
          disabled={disabled}
        >
          <AlignRight className="h-4 w-4" />
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
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" disabled={disabled}>
              <Eye className="h-4 w-4 mr-1" />
              Предпросмотр
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Предпросмотр публикации</DialogTitle>
              <DialogDescription>Так пост будет выглядеть на сайте.</DialogDescription>
            </DialogHeader>
            <div
              className="max-h-[60vh] overflow-auto rounded-md border bg-white p-4 text-sm leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:rounded-md"
              dangerouslySetInnerHTML={{ __html: value || "<p>Текст пока не добавлен.</p>" }}
            />
          </DialogContent>
        </Dialog>
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
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={placeholder ?? "Текст"}
          className="min-h-[200px] rounded-md border border-input bg-white px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  )
}
